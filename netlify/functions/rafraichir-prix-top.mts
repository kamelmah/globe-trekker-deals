/**
 * Rafraîchissement des prix PRIORITAIRES — tâche planifiée Netlify.
 *
 * Même travail que `rafraichir-prix`, sur l'autre moitié du périmètre et à une
 * cadence plus serrée : toutes les trois heures au lieu d'une fois par heure.
 * `priorite` partage les liaisons exactement en deux, aucune n'est traitée par
 * les deux tâches.
 *
 * CE QUE CETTE SÉPARATION COÛTE. La source tarifaire n'interroge qu'une VILLE DE
 * DÉPART à la fois : `destinations` ne filtre que le résultat. Les deux groupes
 * couvrant les mêmes cinq origines, chacune est donc balayée par les deux
 * tâches. Le nombre d'appels passe de 120 à 160 par jour (+33 %), et ce n'est
 * pas un effet de bord à corriger : c'est le prix de relever plus souvent les
 * liaisons qui comptent. Le ramener à son niveau d'avant demanderait de séparer
 * les groupes par ORIGINE et non par destination.
 *
 * À savoir : les fonctions planifiées ne s'exécutent QUE sur le déploiement
 * publié en production. Elles ne tournent pas sur une préversion.
 */
import { refreshFlightPrices } from "../../src/lib/price-refresh.server";

export default async () => {
  const debut = Date.now();
  try {
    const etat = await refreshFlightPrices("cron", { priorite: true });
    console.log(
      `[rafraichir-prix-top] ${etat.priceCount ?? 0} prix · ${Math.round((Date.now() - debut) / 1000)}s`,
    );
    return new Response(JSON.stringify(etat), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Une tâche qui échoue doit le dire dans les journaux Netlify, pas mourir
    // en silence : c'est la seule chose qui distingue « rien à faire » de
    // « cassé depuis trois jours ».
    console.error("[rafraichir-prix-top] échec", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "échec" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const config = {
  name: "rafraichir-prix-top",
  // Décalé de 22 min par rapport à `rafraichir-prix` (7 * * * *) : les deux
  // tâches sollicitent la même API, les faire partir ensemble n'apporterait
  // qu'un pic de requêtes simultanées.
  schedule: "29 */3 * * *",
};
