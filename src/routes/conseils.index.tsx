import { Link, createFileRoute } from "@tanstack/react-router";

import { CITY_GUIDES } from "@/data/city-guides";
import { POSTS } from "@/data/posts";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Conseils pour payer son billet d'avion moins cher | TrouveMonVol";
const DESCRIPTION =
  "Nos guides concrets pour trouver un vol pas cher : quand réserver, comment fonctionnent les prix des compagnies, comment éviter les frais cachés.";

export const Route = createFileRoute("/conseils/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/conseils` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/conseils` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: TITLE,
          url: `${SITE_URL}/conseils`,
          itemListElement: POSTS.map((post, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: post.title,
            url: `${SITE_URL}/conseils/${post.slug}`,
          })),
        }),
      },
    ],
  }),
  component: BlogIndex,
});

function BlogIndex() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold">Conseils voyage</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Des articles courts et concrets, sans jargon, pour comprendre comment se forment les prix des
        billets d'avion et payer le vôtre moins cher. Pas de listes recopiées : uniquement ce qui
        change vraiment le prix final.
      </p>

      <ul className="mt-8 grid gap-4 md:grid-cols-2">
        {POSTS.map((post) => (
          <li key={post.slug}>
            <Link
              to="/conseils/$slug"
              params={{ slug: post.slug }}
              className="block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary"
            >
              <h2 className="font-display text-lg font-semibold">{post.title}</h2>
              <p className="mt-2 text-sm text-muted-foreground">{post.description}</p>
              <p className="mt-3 text-xs text-muted-foreground">
                {post.readingMinutes} min de lecture · mis à jour le {post.updated}
              </p>
            </Link>
          </li>
        ))}
      </ul>

      <section className="mt-12">
        <h2 className="font-display text-2xl font-semibold">Guides par destination</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Que faire sur place, quand partir, quel budget prévoir : un guide pratique pour chaque
          ville desservie sur le site.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {CITY_GUIDES.map((guide) => (
            <li key={guide.slug}>
              <Link
                to="/conseils/destinations/$city"
                params={{ city: guide.slug }}
                className="block rounded-xl border border-border bg-card p-4 text-sm transition-colors hover:bg-secondary"
              >
                <span className="block font-medium">Que faire à {guide.city}</span>
                <span className="mt-1 block text-xs text-muted-foreground">{guide.country}</span>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          to="/conseils/destinations"
          className="mt-4 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Voir tous les guides destinations
        </Link>
      </section>

      <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
        Prêt à passer à la pratique ? Testez le{" "}
        <Link
          to="/mode-budget"
          search={{ origin: "PAR", budget: 400, month: "" }}
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          mode budget
        </Link>{" "}
        pour voir où partir avec la somme que vous avez en tête.
      </div>
    </div>
  );
}
