import { SITE_URL } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { CITY_GUIDES } from "@/data/city-guides";
import { COMPARISONS } from "@/data/comparisons";
import { DESTINATIONS } from "@/data/destinations";
import {
  PRUNED_COMPARISON_SLUGS,
  PRUNED_GUIDE_SLUGS,
  PRUNED_ROUTE_SLUGS,
  withoutPruned,
} from "@/data/pruned-pages";
import { POSTS } from "@/data/posts";
import {
  INDEXED_LEGACY_SLUGS,
  ROUTE_WHITELIST,
  WHITELIST_VALIDATED_AT,
} from "@/data/route-whitelist";
import { pageLastmod } from "@/data/page-lastmod";
import { TRAVEL_DOCUMENTS } from "@/data/travel-documents";
import { HOTEL_CITIES } from "@/lib/hotel-cities";
import { urlsetXml, xmlResponse, type SitemapEntry } from "@/lib/sitemap-xml";

/**
 * Sitemap unique.
 *
 * La découpe en index + segments n'a plus lieu d'être : le site est passé
 * d'environ un millier de pages de liaison à la liste blanche, très loin de la
 * limite de 50 000 URL par fichier.
 *
 * Aucune entrée ne porte `changefreq` ni `priority` : Google les ignore.
 *
 * Chaque entrée porte en revanche un `lastmod` réel. Il vient soit du champ
 * `updated` tenu à la main (guides, articles, comparatifs, formalités), soit de
 * la date de validation de la liste blanche, soit de l'historique Git via
 * `PAGE_LASTMOD` pour les pages qui n'ont pas de date dans leurs données.
 * Aucune n'est une date de génération : elles ne bougent que si le contenu bouge.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const origin = SITE_URL;

        // Pages fixes. Leur `lastmod` vient de l'historique Git via
        // `PAGE_LASTMOD` : elles n'ont pas de date d'édition dans les données,
        // et la date du dernier commit qui les a touchées est la seule date de
        // modification réellement vérifiable.
        //
        // Les pages de service (mentions légales, CGU, confidentialité, cookies)
        // n'y figurent PAS : elles sont en `noindex`. Un sitemap ne doit
        // déclarer que des pages qu'on demande à Google d'indexer — y laisser
        // une page en noindex envoie deux consignes contradictoires.
        const staticPages = [
          "/",
          "/mode-budget",
          "/alertes",
          "/conseils",
          "/conseils/destinations",
          "/comparatifs",
          "/conseils/formalites",
          "/faq",
          "/methodologie",
          // Les grilles tarifaires bagages, retirées des 126 pages de liaison
          // où elles étaient recopiées à l'identique. Indexée une fois, ici.
          "/bagages",
          "/contact",
          "/indemnisation",
          "/hebergement",
        ];

        /** Toute entrée est datée dès que nous connaissons une date réelle. */
        const dated = (loc: string, lastmod?: string): SitemapEntry => {
          const date = lastmod ?? pageLastmod(loc);
          return date ? { loc, lastmod: date } : { loc };
        };

        const entries: SitemapEntry[] = [
          ...staticPages.map((loc) => dated(loc)),
          // Pages de liaison éditoriales : rédigées à la main, sans date de
          // révision dans les données — celle-ci vient donc de Git.
          ...withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS).map((d) => dated(`/vols/${d.slug}`)),
          // Pages de liaison de la liste blanche : leur contenu ne bouge qu'à la
          // revalidation de la liste contre l'API, c'est la vraie date.
          ...ROUTE_WHITELIST.map((r) => dated(`/vols/${r.slug}`, WHITELIST_VALIDATED_AT)),
          // Pages générées hors liste blanche mais déjà indexées : on ne les
          // retire pas de l'index, donc elles restent listées. Leur contenu sort
          // entièrement du générateur, c'est donc lui qui les date.
          ...INDEXED_LEGACY_SLUGS.map((slug) => dated(`/vols/${slug}`)),
          ...withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS).map((g) =>
            dated(`/conseils/destinations/${g.slug}`, g.updated),
          ),
          ...POSTS.map((p) => dated(`/conseils/${p.slug}`, p.updated)),
          ...withoutPruned(COMPARISONS, PRUNED_COMPARISON_SLUGS).map((c) =>
            dated(`/comparatifs/${c.slug}`, c.updated),
          ),
          ...TRAVEL_DOCUMENTS.map((d) => dated(`/conseils/formalites/${d.slug}`, d.updated)),
          // Pages hébergement par ville : leur contenu suit la liste blanche,
          // qui les date.
          ...HOTEL_CITIES.map((v) => dated(`/hebergement/${v.slug}`, WHITELIST_VALIDATED_AT)),
        ];

        // Une page éditoriale peut aussi figurer dans la liste blanche : on ne
        // la déclare qu'une fois.
        const seen = new Set<string>();
        const unique = entries.filter((entry) => {
          if (seen.has(entry.loc)) return false;
          seen.add(entry.loc);
          return true;
        });

        return xmlResponse(urlsetXml(origin, unique));
      },
    },
  },
});
