import { Link, createFileRoute } from "@tanstack/react-router";

import { CITY_GUIDES, type CityGuide } from "@/data/city-guides";
import { PRUNED_GUIDE_SLUGS, withoutPruned } from "@/data/pruned-pages";
import { listPublishedGuides } from "@/lib/published-guides.functions";
import { FondAnime } from "@/components/site/FondAnime";
import { CityPicture } from "@/components/site/CityPicture";
import { getDestinationImage } from "@/lib/destination-images";
import { withPreposition } from "@/lib/french-grammar";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Guides destinations : que faire dans chaque ville | TrouveMonVol";
const DESCRIPTION =
  "Nos guides voyage par destination : meilleure période, quartiers à voir, budget sur place, transports et formalités pour les voyageurs français.";
const PAGE_URL = `${SITE_URL}/conseils/destinations`;

export const Route = createFileRoute("/conseils/destinations/")({
  loader: async () => {
    // Guides rédigés en dur + fiches générées puis publiées depuis
    // /destinations-proposes.
    const { guides } = await listPublishedGuides();
    const known = new Set(CITY_GUIDES.map((guide) => guide.slug));
    const extra = guides.filter((guide) => !known.has(guide.slug));
    // Les guides élagués sortent de la liste : aucun lien interne ne doit
    // pointer vers une page en noindex.
    const listed = withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS);
    return { guides: [...listed, ...extra] as CityGuide[] };
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
          "@type": "ItemList",
          name: TITLE,
          url: PAGE_URL,
          itemListElement: withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS).map((guide, index) => ({
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
  const { guides } = Route.useLoaderData();
  return (
    <div>
      <section className="relative isolate overflow-hidden border-b border-border">
        <FondAnime variante="guides" />
        <div className="container-page py-14 lg:py-20">
          <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
            <Link to="/conseils" className="hover:text-foreground">
              Conseils
            </Link>{" "}
            / Guides destinations
          </nav>

          <h1 className="mt-3 font-display">Guides destinations</h1>
          <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
            Pour chaque ville desservie sur le site, un guide pratique : quand partir, quels
            quartiers voir, quel budget prévoir sur place, comment se déplacer et quelles formalités
            anticiper.
          </p>
        </div>
      </section>

      <ul className="container-page mt-8 grid gap-4 pb-10 md:grid-cols-2">
        {guides.map((guide) => {
          const image = getDestinationImage(guide.destination, guide.city, guide.country);
          return (
            <li
              key={guide.slug}
              className="flex h-full flex-col rounded-xl border border-border bg-card p-5"
            >
              <Link
                to="/conseils/destinations/$city"
                params={{ city: guide.slug }}
                className="flex gap-4 rounded-lg transition-colors hover:bg-secondary"
              >
                <CityPicture
                  imageUrl={guide.imageUrl}
                  fallback={image}
                  city={guide.city}
                  vignette
                  loading="lazy"
                  width={128}
                  height={96}
                  className="size-20 shrink-0 rounded-lg object-cover"
                />
                <span className="min-w-0">
                  <span className="block font-display text-base font-semibold">
                    Que faire {withPreposition("à", guide.city)}
                  </span>
                  <span className="mt-1 block text-xs text-muted-foreground">{guide.country}</span>
                  <span className="mt-2 block text-sm text-muted-foreground">
                    {guide.description}
                  </span>
                </span>
              </Link>
              <Link
                to="/vols/$slug"
                params={{ slug: guide.routeSlug }}
                className="mt-3 text-sm font-medium text-primary underline-offset-2 hover:underline"
              >
                Voir les vols pas chers {guide.originCity} — {guide.city}
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
