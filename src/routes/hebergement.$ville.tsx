import { createFileRoute, notFound } from "@tanstack/react-router";

import { HebergementView } from "@/components/stay/HebergementView";
import {
  FEATURED_HOTEL_CITY_CODES,
  findHotelCity,
  validateHebergementSearch,
  type HebergementSearch,
} from "@/lib/hotel-cities";
import { observedLowestPrices } from "@/lib/route-pages.functions";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

/** Départ de référence des prix d'appel affichés sur les tuiles. */
const ORIGINE_PRIX = "PAR";

/**
 * Page hébergement d'une ville.
 *
 * Le périmètre est fermé (voir HOTEL_CITIES) : une ville inconnue renvoie 404
 * plutôt qu'une page générée à la volée. Nous avons déjà payé le prix des
 * pages fabriquées en masse sur /vols — pas deux fois.
 */
export const Route = createFileRoute("/hebergement/$ville")({
  validateSearch: (search: Record<string, unknown>): HebergementSearch =>
    validateHebergementSearch(search),
  loader: async ({ params }) => {
    const ville = findHotelCity(params.ville);
    if (!ville) throw notFound();
    const { prices } = await observedLowestPrices({
      data: { origin: ORIGINE_PRIX, destinations: [...FEATURED_HOTEL_CITY_CODES] },
    }).catch(() => ({ prices: {} as Record<string, { priceEur: number }> }));
    return {
      ville,
      prixVols: Object.fromEntries(
        Object.entries(prices).map(([code, low]) => [code, low.priceEur]),
      ),
    };
  },
  head: ({ loaderData }) => {
    const ville = loaderData?.ville;
    if (!ville) return {};
    const title = `Hôtels à ${ville.ville} — prix par nuit affichés | TrouveMonVol`;
    const description = `Hôtels et appartements à ${ville.ville} (${ville.pays}) sur une carte : prix par nuit tel qu'il apparaît chez nos partenaires de réservation, dates de votre vol reprises, réservation directement chez eux.`;
    const url = `${SITE_URL}/hebergement/${ville.slug}`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: title,
            url,
            inLanguage: "fr-FR",
            description,
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Hébergement",
                item: `${SITE_URL}/hebergement`,
              },
              { "@type": "ListItem", position: 3, name: ville.ville, item: url },
            ],
          }),
        },
      ],
    };
  },
  component: HebergementVillePage,
});

function HebergementVillePage() {
  const search = Route.useSearch();
  const { ville, prixVols } = Route.useLoaderData();
  // `key` : passer d'une ville à l'autre remonte le formulaire, sinon l'état
  // saisi pour Alger resterait affiché sur la page d'Oran.
  return (
    <HebergementView key={ville.slug} search={search} villeFixee={ville} prixVols={prixVols} />
  );
}
