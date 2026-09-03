/**
 * Rafraîchissement horaire des prix COURANTS — tâche planifiée Netlify.
 *
 * Ne traite que les liaisons non prioritaires. Les prioritaires ont leur propre
 * tâche, `rafraichir-prix-top`, à une cadence plus serrée. Aucune liaison n'est
 * traitée par les deux : `priorite` les partage exactement en deux.
 *
 * Remplace l'endpoint POST /api/public/rafraichir-prix et le secret qui le
 * protégeait. Une fonction planifiée n'est pas appelable par URL : elle
 * s'exécute dans le projet et lit les variables d'environnement directement.
 * Il n'y a donc plus de secret à faire transiter, et plus de surface exposée —
 * c'est le trou de sécurité de la clé publiable qui disparaît avec la
 * plateforme, pas seulement qui est colmaté.
 *
 * À savoir : les fonctions planifiées ne s'exécutent QUE sur le déploiement
 * publié en production. Elles ne tournent pas sur une préversion.
 */
import { refreshFlightPrices } from "../../src/lib/price-refresh.server";

export default async () => {
  const debut = Date.now();
  try {
    const etat = await refreshFlightPrices("cron", { priorite: false });
    console.log(
      `[rafraichir-prix] ${etat.priceCount ?? 0} prix · ${Math.round((Date.now() - debut) / 1000)}s`,
    );
    return new Response(JSON.stringify(etat), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    // Une tâche qui échoue doit le dire dans les journaux Netlify, pas mourir
    // en silence : c'est la seule chose qui distingue « rien à faire » de
    // « cassé depuis trois jours ».
    console.error("[rafraichir-prix] échec", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "échec" }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const config = {
  name: "rafraichir-prix",
  schedule: "7 * * * *",
};
