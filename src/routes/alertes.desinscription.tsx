import { Link, createFileRoute } from "@tanstack/react-router";

import { unsubscribeAlert } from "@/lib/flights.functions";

type SearchParams = { token: string };

export const Route = createFileRoute("/alertes/desinscription")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    token: typeof search["token"] === "string" ? search["token"].slice(0, 128) : "",
  }),
  loader: async ({ location }) => {
    const token = (location.search as Record<string, unknown>)["token"];
    if (typeof token !== "string" || token.length < 8) return { done: false };
    const result = await unsubscribeAlert({ data: { token } });
    return { done: result.ok };
  },
  head: () => ({
    meta: [
      { title: "Désinscription des alertes prix | TrouveMonVol" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: UnsubscribePage,
});

function UnsubscribePage() {
  const { done } = Route.useLoaderData();

  return (
    <div className="container-page max-w-xl py-16 text-center">
      <h1 className="font-display text-2xl font-semibold">
        {done ? "Alerte désactivée" : "Lien de désinscription invalide"}
      </h1>
      <p className="mt-3 text-sm text-muted-foreground">
        {done
          ? "C'est fait : vous ne recevrez plus d'email pour ce trajet. Aucune donnée supplémentaire n'est conservée."
          : "Ce lien n'est plus valide ou l'alerte a déjà été désactivée. Vous pouvez en créer une nouvelle à tout moment depuis une page de résultats."}
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
      >
        Retour à l'accueil
      </Link>
    </div>
  );
}
