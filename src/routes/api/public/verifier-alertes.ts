import { createFileRoute } from "@tanstack/react-router";

/**
 * Vérification quotidienne des alertes prix (appelée par la tâche planifiée).
 * Protégée par un secret partagé passé dans l'en-tête x-alert-secret.
 */
export const Route = createFileRoute("/api/public/verifier-alertes")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const secret = process.env["ALERTS_CRON_SECRET"];
        const provided = request.headers.get("x-alert-secret");
        if (!secret || provided !== secret) {
          return new Response(JSON.stringify({ error: "Unauthorized" }), {
            status: 401,
            headers: { "Content-Type": "application/json" },
          });
        }

        const { runAlertCheck } = await import("@/lib/alerts.server");
        const origin = new URL(request.url).origin;
        const result = await runAlertCheck(origin);

        return new Response(JSON.stringify(result), {
          headers: { "Content-Type": "application/json", "Cache-Control": "no-store" },
        });
      },
    },
  },
});
