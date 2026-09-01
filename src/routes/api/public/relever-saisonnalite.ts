import { createFileRoute } from "@tanstack/react-router";

/**
 * Relevé de la saisonnalité, appelé par la tâche planifiée.
 *
 * Chaque invocation traite les quelques routes les plus anciennement relevées,
 * douze mois chacune. Le travail est donc étalé sur plusieurs passages, et
 * reprenable : il n'y a aucun curseur à tenir, l'ordre de fraîcheur suffit à
 * reprendre là où le passage précédent s'est arrêté — ou interrompu.
 *
 * `?routes=N` force la taille d'un passage, dans la limite de 24.
 *
 * Protection : secret serveur `CRON_SECRET` en en-tête `x-cron-secret`, jamais
 * la clé publiable — celle-ci est dans le bundle client et ne protège rien.
 */

/**
 * Un seul relevé à la fois par isolat.
 *
 * Sans ce garde, deux appels concurrents traiteraient les mêmes routes (elles
 * sont choisies par ancienneté, et rien n'est encore écrit au moment du choix)
 * et doubleraient la consommation du quota tarifaire pour rien.
 */
let enCours = false;

export const Route = createFileRoute("/api/public/relever-saisonnalite")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { refuseJobRequest } = await import("@/lib/job-auth.server");
        const refus = refuseJobRequest(request);
        if (refus) return refus;

        if (enCours) {
          return new Response(
            JSON.stringify({ error: "Un relevé est déjà en cours.", reprenable: true }),
            { status: 409, headers: { "Content-Type": "application/json" } },
          );
        }

        const demande = Number(new URL(request.url).searchParams.get("routes"));
        const routes = Number.isFinite(demande) && demande > 0 ? Math.min(demande, 24) : undefined;

        enCours = true;
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
        } finally {
          enCours = false;
        }
      },
    },
  },
});
