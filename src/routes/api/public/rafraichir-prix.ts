import { createFileRoute } from "@tanstack/react-router";

/**
 * Mise à jour horaire des prix Travelpayouts (appelée par la tâche planifiée).
 * Protégée par le secret partagé `PRICE_REFRESH_SECRET` (en-tête
 * x-refresh-secret) ou, à défaut, par la clé publiable du projet (apikey).
 */
export const Route = createFileRoute("/api/public/rafraichir-prix")({
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

        const { refreshFlightPrices } = await import("@/lib/price-refresh.server");
        const state = await refreshFlightPrices("cron");

        return new Response(JSON.stringify(state), {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
