import { Link, createFileRoute } from "@tanstack/react-router";

import { CITY_GUIDES } from "@/data/city-guides";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { getDestinationImage } from "@/lib/destination-images";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Guides destinations : que faire dans chaque ville | TrouveMonVol";
const DESCRIPTION =
  "Nos guides voyage par destination : meilleure période, quartiers à voir, budget sur place, transports et formalités pour les voyageurs français.";
const PAGE_URL = `${SITE_URL}/conseils/destinations`;

export const Route = createFileRoute("/conseils/destinations/")({
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
          "@type": "ItemList",
          name: TITLE,
          url: PAGE_URL,
          itemListElement: CITY_GUIDES.map((guide, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: guide.title,
            url: `${PAGE_URL}/${guide.slug}`,
          })),
        }),
      },
    ],
  }),
  component: CityGuidesIndex,
});

function CityGuidesIndex() {
  return (
    <div className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/conseils" className="hover:text-foreground">
          Conseils
        </Link>{" "}
        / Guides destinations
      </nav>

      <h1 className="mt-3 font-display text-3xl font-semibold">Guides destinations</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Pour chaque ville desservie sur le site, un guide pratique : quand partir, quels quartiers
        voir, quel budget prévoir sur place, comment se déplacer et quelles formalités anticiper.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {CITY_GUIDES.map((guide) => {
          const image = getDestinationImage(guide.destination, guide.city);
          return (
            <li key={guide.slug}>
              <Link
                to="/conseils/destinations/$city"
                params={{ city: guide.slug }}
                className="flex h-full gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              >
                <ResponsivePicture
                  src={image.src}
                  webp={image.webp}
                  alt={image.alt}
                  loading="lazy"
                  width={128}
                  height={96}
                  className="size-20 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0">
                  <span className="block font-display text-base font-semibold">
                    Que faire à {guide.city}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{guide.country}</span>
                  <span className="mt-2 block text-sm text-muted-foreground">
                    {guide.description}
                  </span>
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
