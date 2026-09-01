import { SITE_URL } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { CITY_GUIDES } from "@/data/city-guides";
import { COMPARISONS } from "@/data/comparisons";
import { DESTINATIONS } from "@/data/destinations";
import { POSTS } from "@/data/posts";
import {
  INDEXED_LEGACY_SLUGS,
  ROUTE_WHITELIST,
  WHITELIST_VALIDATED_AT,
} from "@/data/route-whitelist";
import { TRAVEL_DOCUMENTS } from "@/data/travel-documents";
import { urlsetXml, xmlResponse, type SitemapEntry } from "@/lib/sitemap-xml";

/**
 * Sitemap unique.
 *
 * La découpe en index + segments n'a plus lieu d'être : le site est passé
 * d'environ un millier de pages de liaison à la liste blanche, très loin de la
 * limite de 50 000 URL par fichier.
 *
 * Aucune entrée ne porte `changefreq` ni `priority` (Google les ignore), et
 * `lastmod` n'est renseigné que là où une vraie date d'édition existe.
 */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const origin = SITE_URL;

        // Pages fixes : pas de date d'édition suivie, donc pas de lastmod.
        const staticPages = [
          "/",
          "/mode-budget",
          "/conseils",
          "/conseils/destinations",
          "/comparatifs",
          "/conseils/formalites",
          "/faq",
          "/contact",
          "/mentions-legales",
          "/cgu",
          "/confidentialite",
          "/cookies",
        ];

        const entries: SitemapEntry[] = [
          ...staticPages.map((loc) => ({ loc })),
          // Pages de liaison éditoriales : rédigées à la main, sans date de
          // révision suivie dans les données.
          ...DESTINATIONS.map((d) => ({ loc: `/vols/${d.slug}` })),
          // Pages de liaison de la liste blanche : leur contenu ne bouge qu'à la
          // revalidation de la liste contre l'API, c'est la vraie date.
          ...ROUTE_WHITELIST.map((r) => ({
            loc: `/vols/${r.slug}`,
            lastmod: WHITELIST_VALIDATED_AT,
          })),
          // Pages générées hors liste blanche mais déjà indexées : on ne les
          // retire pas de l'index, donc elles restent listées.
          ...INDEXED_LEGACY_SLUGS.map((slug) => ({ loc: `/vols/${slug}` })),
          ...CITY_GUIDES.map((g) => ({
            loc: `/conseils/destinations/${g.slug}`,
            lastmod: g.updated,
          })),
          ...POSTS.map((p) => ({ loc: `/conseils/${p.slug}`, lastmod: p.updated })),
          ...COMPARISONS.map((c) => ({ loc: `/comparatifs/${c.slug}`, lastmod: c.updated })),
          ...TRAVEL_DOCUMENTS.map((d) => ({
            loc: `/conseils/formalites/${d.slug}`,
            lastmod: d.updated,
          })),
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
