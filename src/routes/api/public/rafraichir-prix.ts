import { createFileRoute } from "@tanstack/react-router";

/**
 * Mise à jour des prix Travelpayouts (appelée par la tâche planifiée).
 *
 * L'endpoint acceptait, à défaut de secret, la clé publiable du projet — laquelle
 * est injectée dans le bundle client sous `VITE_SUPABASE_PUBLISHABLE_KEY`. Elle
 * ne protégeait donc rien : n'importe quel visiteur pouvait la lire et déclencher
 * la tâche en boucle, aux frais du quota tarifaire. Un vrai secret serveur est
 * désormais exigé, et l'endpoint refuse tout s'il n'est pas configuré.
 *
 * `x-refresh-secret` / `PRICE_REFRESH_SECRET` reste accepté le temps que la tâche
 * déjà planifiée bascule sur `x-cron-secret` / `CRON_SECRET` : c'est un secret
 * serveur lui aussi, pas un trou.
 */
export const Route = createFileRoute("/api/public/rafraichir-prix")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const { refuseJobRequest } = await import("@/lib/job-auth.server");
        // Troisième argument : repli temporaire sur la clé publiable, le temps
        // de la migration. Il ne concerne que cet endpoint — le relevé de
        // saisonnalité, lui, reste fermé.
        const refus = refuseJobRequest(
          request,
          [{ header: "x-refresh-secret", env: "PRICE_REFRESH_SECRET" }],
          true,
        );
        if (refus) return refus;

        const { refreshFlightPrices } = await import("@/lib/price-refresh.server");
        const state = await refreshFlightPrices("cron");

        return new Response(JSON.stringify(state), {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
