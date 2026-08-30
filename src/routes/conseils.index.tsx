import { Link, createFileRoute } from "@tanstack/react-router";

import { POSTS } from "@/data/posts";

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
