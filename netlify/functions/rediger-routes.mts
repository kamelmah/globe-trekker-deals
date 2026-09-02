/**
 * Rédaction des textes de pages de liaison — tâche planifiée Netlify.
 *
 * Chaque passage fait rédiger quelques trajets, en partant de ceux qui n'ont
 * aucun texte, puis des plus anciens. Une fois toutes les routes couvertes, les
 * passages ne font plus que rafraîchir les textes de plus de quatre-vingt-dix
 * jours, pour qu'ils suivent l'évolution des prix relevés.
 *
 * DIMENSIONNEMENT. Un appel à Sonnet 5 pour un texte de cette longueur dure cinq
 * à quinze secondes. Trois trajets par passage tiennent donc dans les trente
 * secondes accordées à une fonction planifiée, avec de la marge — la latence du
 * modèle n'est pas garantie, et un passage coupé au milieu ne produirait rien.
 *
 * HORAIRE. h+23, entre le rafraîchissement des prix (h+07) et la vérification
 * des alertes (h+37) : les trois tâches ne se chevauchent pas.
 *
 * REPRISE. Comme pour la saisonnalité, aucun curseur n'est tenu : l'ordre se
 * déduit de l'état de la base. Un passage interrompu ne laisse rien à réparer.
 */
import { redigerRoutes } from "../../src/lib/route-editorial.server";

/** Un appel dure 5 à 15 s ; trois tiennent dans le budget de 30 s. */
const ROUTES_PAR_PASSAGE = 3;

export default async () => {
  const debut = Date.now();
  try {
    const rapport = await redigerRoutes({ routes: ROUTES_PAR_PASSAGE });
    console.log(
      `[rediger-routes] ${rapport.traitees} routes · ${rapport.echecs} échecs · ` +
        `${rapport.restantes} restantes · ${rapport.tokens.toLocaleString("fr-FR")} tokens · ` +
        `${Math.round((Date.now() - debut) / 1000)}s`,
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
