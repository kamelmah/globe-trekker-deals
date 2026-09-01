import { createFileRoute } from "@tanstack/react-router";

/**
 * Relevé de la saisonnalité, appelé par la tâche planifiée.
 *
 * Chaque invocation traite les quelques routes les plus anciennement relevées,
 * douze mois chacune. Le travail est donc étalé sur plusieurs passages, et
 * reprenable : il n'y a aucun curseur à tenir, l'ordre de fraîcheur suffit à
 * reprendre là où le passage précédent s'est arrêté — ou interrompu.
 *
 * `?routes=N` permet de forcer la taille d'un passage, dans la limite de 24
 * routes (soit ~288 appels) pour qu'une invocation reste courte.
 *
 * Même protection que le rafraîchissement des prix : secret partagé
 * `PRICE_REFRESH_SECRET` (en-tête x-refresh-secret), ou à défaut la clé
 * publiable du projet (apikey).
 */
export const Route = createFileRoute("/api/public/relever-saisonnalite")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["PRICE_REFRESH_SECRET"];
        const publishable =
          process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"];
        const authorized = secret
          ? request.headers.get("x-refresh-secret") === secret
          : Boolean(publishable) && request.headers.get("apikey") === publishable;

        if (!authorized) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const demande = Number(new URL(request.url).searchParams.get("routes"));
        const routes = Number.isFinite(demande) && demande > 0 ? Math.min(demande, 24) : undefined;

        try {
          const { ingestSeasonality } = await import("@/lib/seasonality.server");
          const rapport = await ingestSeasonality(routes === undefined ? {} : { routes });
          return new Response(JSON.stringify(rapport), {
            headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
          });
        } catch (error) {
          console.error("Relevé de saisonnalité interrompu", error);
          return new Response(
            JSON.stringify({
              error: error instanceof Error ? error.message : "échec du relevé",
              // Rien à réparer : le passage suivant reprendra les routes restées
              // anciennes.
              reprenable: true,
            }),
            { status: 500, headers: { "Content-Type": "application/json" } },
          );
        }
      },
    },
  },
});
