/**
 * Rédaction des textes de pages de liaison — tâche planifiée Netlify.
 *
 * Chaque passage fait rédiger quelques trajets, en partant de ceux qui n'ont
 * aucun texte, puis des plus anciens. Une fois toutes les routes couvertes, les
 * passages ne font plus que rafraîchir les textes de plus de quatre-vingt-dix
 * jours, pour qu'ils suivent l'évolution des prix relevés.
 *
 * DIMENSIONNEMENT, mesuré et non estimé. Au premier passage, marseille-alger a
 * demandé 27,6 s et marseille-oran a été tronqué à max_tokens après 30,6 s : la
 * fonction a été tuée à 60 s. Le temps de génération est proportionnel à la
 * longueur du texte demandé, et le format d'alors était trop généreux.
 *
 * Le format a donc été resserré (2 sections de 2 paragraphes, 200 à 400
 * caractères chacun), ce qui devrait ramener une génération autour de dix
 * secondes. En attendant de le vérifier sur des passages réels, un seul trajet
 * par passage : à une route par heure, les quatre-vingt-huit trajets sont
 * couverts en moins de quatre jours, ce qui ne justifie pas de risquer un
 * passage tué. La durée de chaque génération est journalisée pour trancher.
 *
 * HORAIRE. h+23, entre le rafraîchissement des prix (h+07) et la vérification
 * des alertes (h+37) : les trois tâches ne se chevauchent pas.
 *
 * REPRISE. Comme pour la saisonnalité, aucun curseur n'est tenu : l'ordre se
 * déduit de l'état de la base. Un passage interrompu ne laisse rien à réparer.
 */
import { redigerRoutes } from "../../src/lib/route-editorial.server";

/**
 * Un seul trajet par passage tant que la durée réelle n'est pas confirmée.
 * À remonter à 2 dès que le journal montre des générations sous 12 s.
 */
const ROUTES_PAR_PASSAGE = 1;

export default async () => {
  const debut = Date.now();
  try {
    const rapport = await redigerRoutes({ routes: ROUTES_PAR_PASSAGE });
    // La durée par texte est la mesure qui décide de ROUTES_PAR_PASSAGE : elle
    // figure au journal pour ne pas avoir à la deviner.
    const parTexte = rapport.dureesMs.map((ms) => `${(ms / 1000).toFixed(1)} s`).join(", ");
    console.log(
      `[rediger-routes] ${rapport.traitees} routes · ${rapport.echecs} échecs · ` +
        `${rapport.restantes} restantes · ${rapport.tokens.toLocaleString("fr-FR")} tokens · ` +
        `${parTexte || "aucun texte"} par texte · ${Math.round((Date.now() - debut) / 1000)}s`,
    );
    return new Response(JSON.stringify(rapport), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("[rediger-routes] échec", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "échec",
        // Aucun état à réparer : le passage suivant reprend les plus anciennes.
        reprenable: true,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } },
    );
  }
};

export const config = {
  name: "rediger-routes",
  schedule: "23 * * * *",
};
