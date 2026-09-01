import { createFileRoute } from "@tanstack/react-router";

/**
 * Nombre de lignes des trois tables non régénérables. Trois entiers, rien d'autre.
 *
 * TEMPORAIRE — À SUPPRIMER DÈS LES CHIFFRES RELEVÉS.
 *
 * Pourquoi cet endpoint existe : ces tables portent une politique RLS « aucun
 * accès public », et PostgREST répond alors 200 avec un compte de 0 au lieu
 * d'une erreur. Un 0 y signifie « lecture refusée », pas « table vide » — de
 * quoi croire qu'il n'y a rien à sauvegarder avant une migration. Seule la clé
 * de service, qui contourne RLS et n'existe qu'à l'exécution, donne le vrai
 * chiffre.
 *
 * Pourquoi il n'est pas protégé : trois entiers ne sont pas des données
 * personnelles, et le secret qui l'aurait protégé n'est pas relisible sur cette
 * plateforme — la protection aurait donc surtout empêché son usage légitime.
 *
 * Ce qu'il ne peut pas divulguer, par construction : `head: true` fait émettre
 * une requête HEAD à PostgREST, qui renvoie le compte dans l'en-tête
 * `content-range` et **aucune ligne**. Il n'y a pas de contenu à filtrer,
 * puisqu'aucun contenu n'est demandé.
 */

const TABLES = ["price_alerts", "newsletter_subscribers", "contact_messages"] as const;

export const Route = createFileRoute("/api/public/compter-lignes")({
  server: {
    handlers: {
      GET: async () => {
        const entetes = {
          "Content-Type": "application/json; charset=utf-8",
          "Cache-Control": "no-store",
          "X-Robots-Tag": "noindex, nofollow",
        };

        try {
          const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
          const comptes: Record<string, number | null> = {};

          for (const table of TABLES) {
            const { count, error } = await supabaseAdmin
              .from(table)
              .select("*", { count: "exact", head: true });
            if (error) throw error;
            // `null` plutôt que 0 si le compte manque : un zéro inventé serait
            // exactement l'erreur que cet endpoint sert à éviter.
            comptes[table] = typeof count === "number" ? count : null;
          }

          return new Response(JSON.stringify(comptes, null, 2), { headers: entetes });
        } catch (error) {
          console.error("Comptage impossible", error);
          return new Response(
            JSON.stringify({ error: error instanceof Error ? error.message : "échec" }, null, 2),
            { status: 500, headers: entetes },
          );
        }
      },
    },
  },
});
