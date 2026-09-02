import { createFileRoute } from "@tanstack/react-router";

import { HebergementView } from "@/components/stay/HebergementView";
import {
  FEATURED_HOTEL_CITY_CODES,
  validateHebergementSearch,
  type HebergementSearch,
} from "@/lib/hotel-cities";
import { observedLowestPrices } from "@/lib/route-pages.functions";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Hôtels et locations : le prix par nuit affiché | TrouveMonVol";
const DESCRIPTION =
  "Cherchez un hôtel ou un appartement dans la ville de votre vol : prix par nuit tel qu'il apparaît chez nos partenaires de réservation, dates de vol reprises, réservation directement chez eux.";
const PAGE_URL = `${SITE_URL}/hebergement`;

/** Départ de référence des prix d'appel affichés sur les tuiles. */
const ORIGINE_PRIX = "PAR";

export const Route = createFileRoute("/hebergement/")({
  validateSearch: (search: Record<string, unknown>): HebergementSearch =>
    validateHebergementSearch(search),
  /**
   * Une seule lecture en base pour les six tuiles, aucun appel à l'API
   * tarifaire : la page hébergement ne consomme pas le quota des vols.
   */
  loader: async () => {
    const { prices } = await observedLowestPrices({
      data: { origin: ORIGINE_PRIX, destinations: [...FEATURED_HOTEL_CITY_CODES] },
    }).catch(() => ({ prices: {} as Record<string, { priceEur: number }> }));
    return {
      prixVols: Object.fromEntries(
        Object.entries(prices).map(([code, low]) => [code, low.priceEur]),
      ),
    };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: TITLE,
          url: PAGE_URL,
          inLanguage: "fr-FR",
          description: DESCRIPTION,
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Hébergement", item: PAGE_URL },
          ],
        }),
      },
    ],
  }),
  component: HebergementIndexPage,
});

function HebergementIndexPage() {
  const search = Route.useSearch();
  const { prixVols } = Route.useLoaderData();
  return <HebergementView search={search} prixVols={prixVols} />;
}
