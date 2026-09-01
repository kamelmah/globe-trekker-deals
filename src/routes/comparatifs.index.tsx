import { Link, createFileRoute } from "@tanstack/react-router";

import { COMPARISONS } from "@/data/comparisons";
import { PRUNED_COMPARISON_SLUGS, withoutPruned } from "@/data/pruned-pages";
import { getCityGuide } from "@/data/city-guides";
import { getDestinationImage } from "@/lib/destination-images";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Comparatifs de destinations : laquelle choisir ? | TrouveMonVol";
const DESCRIPTION =
  "Vol, budget, climat et ambiance comparés entre deux destinations pour vous aider à trancher avant de réserver.";
const PAGE_URL = `${SITE_URL}/comparatifs`;

export const Route = createFileRoute("/comparatifs/")({
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
          itemListElement: withoutPruned(COMPARISONS, PRUNED_COMPARISON_SLUGS).map((c, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: c.title,
            url: `${PAGE_URL}/${c.slug}`,
          })),
        }),
      },
    ],
  }),
  component: ComparisonsIndex,
});

function ComparisonsIndex() {
  return (
    <div className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/conseils" className="hover:text-foreground">
          Conseils
        </Link>{" "}
        / Comparatifs
      </nav>

      <h1 className="mt-3 font-display">Comparatifs de destinations</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Deux villes, une seule place dans votre agenda : ces comparatifs mettent face à face prix
        des vols, budget sur place, climat et ambiance, pour vous aider à trancher avant de
        réserver.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {withoutPruned(COMPARISONS, PRUNED_COMPARISON_SLUGS).map((comparison) => {
          const guideA = getCityGuide(comparison.cityA.guideSlug);
          const guideB = getCityGuide(comparison.cityB.guideSlug);
          const imageA = guideA ? getDestinationImage(guideA.destination, guideA.city) : null;
          const imageB = guideB ? getDestinationImage(guideB.destination, guideB.city) : null;
          return (
            <li key={comparison.slug}>
              <Link
                to="/comparatifs/$slug"
                params={{ slug: comparison.slug }}
                className="block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary"
              >
                {imageA && imageB && (
                  <div className="flex gap-2">
                    <ResponsivePicture
                      src={imageA.thumb}
                      webp={imageA.thumbWebp}
                      alt={imageA.alt}
                      loading="lazy"
                      width={200}
                      height={112}
                      className="h-24 w-1/2 rounded-lg object-cover"
                    />
                    <ResponsivePicture
                      src={imageB.thumb}
                      webp={imageB.thumbWebp}
                      alt={imageB.alt}
                      loading="lazy"
                      width={200}
                      height={112}
                      className="h-24 w-1/2 rounded-lg object-cover"
                    />
                  </div>
                )}
                <h3 className="mt-3 font-display text-base font-semibold">{comparison.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{comparison.intro}</p>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
