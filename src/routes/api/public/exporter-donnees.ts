import { createFileRoute } from "@tanstack/react-router";

/**
 * Export des deux seules tables irremplaçables, en JSON.
 *
 * `price_alerts` et `newsletter_subscribers` ne se reconstruisent pas : tout le
 * reste (prix, cache, journal) se régénère depuis la source tarifaire. Ce sont
 * donc les seules données dont la perte serait définitive, et rien ne doit
 * bouger avant qu'elles soient sorties et vérifiées.
 *
 * TEMPORAIRE — À SUPPRIMER UNE FOIS L'EXPORT FAIT ET VÉRIFIÉ.
 *
 * Cet endpoint expose des adresses e-mail. Il n'existe que parce que le projet
 * Supabase appartient à la plateforme et que sa clé de service n'est pas
 * lisible. Trois précautions :
 *
 *  - jeton exigé en en-tête `x-admin-token`, comparé à `ADMIN_LOGS_TOKEN`, la
 *    variable qui protège déjà la page d'administration. Aucun repli : si elle
 *    n'est pas définie, l'endpoint refuse tout ;
 *  - jamais de jeton dans l'URL, qui se retrouverait dans les journaux d'accès ;
 *  - `Cache-Control: no-store` et `X-Robots-Tag: noindex`.
 *
 * Le dépôt GitHub étant public, aucune valeur de jeton ne doit apparaître ici
 * ni dans un commit.
 */

const TABLES = ["price_alerts", "newsletter_subscribers"] as const;

/** Comparaison à durée constante : une comparaison naïve fuit le préfixe. */
function memeJeton(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i += 1) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

const json = (corps: unknown, status = 200) =>
  new Response(JSON.stringify(corps, null, 2), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex, nofollow",
    },
  });

export const Route = createFileRoute("/api/public/exporter-donnees")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const attendu = process.env["ADMIN_LOGS_TOKEN"];
        if (!attendu) {
          return json({ error: "ADMIN_LOGS_TOKEN n'est pas définie côté serveur." }, 503);
        }
        const fourni = request.headers.get("x-admin-token") ?? "";
        if (!memeJeton(fourni, attendu)) {
          return json({ error: "Unauthorized" }, 401);
        }

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const sortie: Record<string, { lignes: number; donnees: unknown[] }> = {};

          for (const table of TABLES) {
            // Pagination explicite : PostgREST plafonne les réponses, et un
            // export tronqué en silence serait pire que pas d'export du tout.
            const donnees: unknown[] = [];
            for (let debut = 0; ; debut += 1000) {
              const { data, error } = await supabaseAdmin
                .from(table)
                .select("*")
                .order("created_at", { ascending: true })
                .range(debut, debut + 999);
              if (error) throw error;
              donnees.push(...(data ?? []));
              if (!data || data.length < 1000) break;
            }
            sortie[table] = { lignes: donnees.length, donnees };
          }

          return json({
            exporteLe: new Date().toISOString(),
            source: process.env["SUPABASE_URL"] ?? null,
            tables: sortie,
          });
        } catch (error) {
          console.error("Export impossible", error);
          return json({ error: error instanceof Error ? error.message : "échec de l'export" }, 500);
        }
      },
    },
  },
});
