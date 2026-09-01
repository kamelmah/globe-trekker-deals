import { Link, createFileRoute } from "@tanstack/react-router";

import { TRAVEL_DOCUMENTS } from "@/data/travel-documents";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Documents et formalités par destination | TrouveMonVol";
const DESCRIPTION =
  "Visa, validité du passeport, vaccins recommandés : les formalités à connaître avant de partir, pays par pays, pour les voyageurs français.";
const PAGE_URL = `${SITE_URL}/conseils/formalites`;

export const Route = createFileRoute("/conseils/formalites/")({
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
          itemListElement: TRAVEL_DOCUMENTS.map((d, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: d.country,
            url: `${PAGE_URL}/${d.slug}`,
          })),
        }),
      },
    ],
  }),
  component: TravelDocumentsIndex,
});

function TravelDocumentsIndex() {
  return (
    <div className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/conseils" className="hover:text-foreground">
          Conseils
        </Link>{" "}
        / Formalités
      </nav>

      <h1 className="mt-3 font-display">Documents et formalités par destination</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Visa, validité du passeport, vaccins recommandés et particularités locales : ce qu'il faut
        vérifier avant de réserver, pays par pays. Cette liste démarre par les destinations hors
        Union européenne les plus consultées sur le site et s'étoffera avec le temps.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {TRAVEL_DOCUMENTS.map((doc) => (
          <li key={doc.slug}>
            <Link
              to="/conseils/formalites/$pays"
              params={{ pays: doc.slug }}
              className="block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary"
            >
              <h3 className="font-display text-base font-semibold">{doc.country}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{doc.intro}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
