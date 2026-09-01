/**
 * Relevé de la saisonnalité — tâche planifiée Netlify.
 *
 * Remplace l'endpoint POST /api/public/relever-saisonnalite. Même bénéfice que
 * pour le rafraîchissement des prix : pas d'URL, pas de secret.
 *
 * DIMENSIONNEMENT. Netlify accorde 30 secondes à une fonction planifiée. Le
 * temps a été mesuré sur trois routes réelles, douze mois chacune :
 *
 *   parallélisme 4   → 874 ms par route   (contrainte héritée de Cloudflare)
 *   parallélisme 12  → 288 ms par route
 *
 * Avec ~400 ms d'écritures Supabase, une route coûte ~700 ms. Vingt-quatre
 * routes tiennent donc en ~17 s, soit un peu plus de la moitié du budget. La
 * marge est volontaire : la latence de la source tarifaire n'est pas garantie.
 *
 * Le plafond de sous-requêtes de Cloudflare, qui limitait à 3 routes, n'existe
 * pas ici. C'est le gain principal du déménagement pour cette tâche.
 *
 * COUVERTURE. 128 routes ÷ 24 = 6 passages. La planification en prévoit 7, de
 * minuit à 6 h le 1er du mois : 168 créneaux pour 128 routes, soit une marge
 * d'un passage entier en cas d'échec. Environ 2 000 appels tarifaires par mois.
 *
 * REPRISE. Les routes sont choisies par ancienneté de relevé, sans curseur : un
 * passage interrompu ne laisse aucun état à réparer, le suivant reprend les
 * plus anciennes. Rien n'oblige jamais à tout relancer.
 */
import { ingestSeasonality } from "../../src/lib/seasonality.server";

/** Mesuré à ~700 ms par route ; 24 routes ≈ 17 s pour un budget de 30 s. */
const ROUTES_PAR_PASSAGE = 24;

export default async () => {
  const debut = Date.now();
  try {
    const rapport = await ingestSeasonality({ routes: ROUTES_PAR_PASSAGE });
    console.log(
      `[relever-saisonnalite] ${rapport.routesTraitees} routes · ${rapport.moisEcrits} mois écrits · ` +
        `${rapport.echecs} échecs · ${rapport.routesRestantes} restantes · ` +
        `${Math.round((Date.now() - debut) / 1000)}s`,
    );
    return new Response(JSON.stringify(rapport), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[relever-saisonnalite] échec", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "échec",
        // Aucun état à réparer : le passage suivant reprend les routes restées
        // anciennes.
        reprenable: true,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const config = {
  name: "relever-saisonnalite",
  schedule: "0 0-6 1 * *",
};
