/**
 * Ville de départ proposée par défaut, déduite d'où arrive la requête.
 *
 * L'accueil affichait deux origines à la fois : « Les moins chers depuis
 * Marseille » sous un formulaire pré-rempli « Paris ». Aucun visiteur n'est
 * concerné par les deux, et rien à l'écran n'expliquait l'écart.
 *
 * La détection est faite CÔTÉ SERVEUR, à partir de l'en-tête `x-nf-geo` que
 * Netlify ajoute à chaque requête : le HTML servi porte déjà la bonne origine,
 * il n'y a donc rien qui change sous les yeux du lecteur après affichage.
 *
 * Fonctions pures, testables sans requête.
 */

import { cityCoordinates, haversineKm } from "@/data/city-coordinates";
import { DESTINATIONS } from "@/data/destinations";
import { ROUTE_WHITELIST } from "@/data/route-whitelist";

/**
 * Origine retenue quand la géolocalisation est absente, illisible ou lointaine.
 *
 * Paris : c'est le départ le plus cherché en France, et celui qui a le plus de
 * pages après Marseille.
 */
export const FALLBACK_ORIGIN = "PAR";

/**
 * Les origines proposables.
 *
 * Volontairement PAS tous les aéroports : une origine n'entre ici que si le
 * site a de quoi remplir ce qu'il affichera ensuite — le bloc « les moins
 * chers » et les liens du mode budget partent de cette ville. Lyon en est
 * absent faute d'une seule page de liaison ; y envoyer un visiteur lyonnais lui
 * donnerait un bloc vide plutôt qu'un bloc marseillais utile.
 */
export const HOME_ORIGINS = ["MRS", "PAR", "NCE", "TLS", "MPL"] as const;

/** Au-delà, on considère que le visiteur n'est proche d'aucune de nos origines. */
const MAX_DISTANCE_KM = 700;

/**
 * Marge dans laquelle deux origines sont considérées comme également proches.
 *
 * Départage alors la COUVERTURE, pas les kilomètres. Sans cette marge, un
 * visiteur lyonnais partait sur Montpellier (5 liaisons) plutôt que Marseille
 * (64), pour 25 km de moins — un bloc trois fois plus pauvre au nom d'un écart
 * que personne ne ressent.
 */
const EX_AEQUO_KM = 100;

/**
 * Nombre de pages de liaison par origine, liste blanche et éditoriales
 * confondues. Calculé une fois, sur les données du site.
 */
const COUVERTURE: ReadonlyMap<string, number> = (() => {
  const parOrigine = new Map<string, number>();
  for (const route of [...ROUTE_WHITELIST, ...DESTINATIONS]) {
    const code = route.origin.toUpperCase();
    parOrigine.set(code, (parOrigine.get(code) ?? 0) + 1);
  }
  return parOrigine;
})();

export type GeoPoint = { lat: number; lng: number };

/**
 * Décode l'en-tête `x-nf-geo` de Netlify : du JSON encodé en base64, portant
 * entre autres `latitude` et `longitude`.
 *
 * Renvoie null à la moindre anomalie — en-tête absent, base64 invalide, JSON
 * cassé, coordonnées manquantes ou hors bornes. Une géolocalisation douteuse
 * doit retomber sur l'origine par défaut, jamais produire un point au hasard.
 */
export function parseNetlifyGeo(header: string | null | undefined): GeoPoint | null {
  if (!header) return null;
  try {
    const json = JSON.parse(
      typeof atob === "function" ? atob(header) : Buffer.from(header, "base64").toString("utf8"),
    ) as { latitude?: unknown; longitude?: unknown };
    const lat = Number(json.latitude);
    const lng = Number(json.longitude);
    if (!Number.isFinite(lat) || !Number.isFinite(lng)) return null;
    if (Math.abs(lat) > 90 || Math.abs(lng) > 180) return null;
    return { lat, lng };
  } catch {
    return null;
  }
}

/**
 * L'origine proposable la plus proche d'un point, ou le repli au-delà de
 * `MAX_DISTANCE_KM`.
 *
 * Le plafond existe pour ne pas envoyer un visiteur de Berlin ou de Dakar sur
 * « les moins chers depuis Nice » au seul motif que Nice est la moins lointaine
 * de nos cinq villes : à cette distance, la proximité ne veut plus rien dire.
 */
export function nearestHomeOrigin(point: GeoPoint | null): string {
  if (!point) return FALLBACK_ORIGIN;

  const distances: { code: string; km: number }[] = [];
  for (const code of HOME_ORIGINS) {
    const coords = cityCoordinates(code);
    if (!coords) continue;
    distances.push({ code, km: haversineKm(point, coords) });
  }
  if (distances.length === 0) return FALLBACK_ORIGIN;

  const plusProche = distances.reduce((a, b) => (b.km < a.km ? b : a));
  if (plusProche.km > MAX_DISTANCE_KM) return FALLBACK_ORIGIN;

  // Entre origines également proches, celle qui a le plus de pages : c'est ce
  // qui remplira le bloc et la carte du mode budget.
  return distances
    .filter((d) => d.km <= plusProche.km + EX_AEQUO_KM)
    .reduce((a, b) => ((COUVERTURE.get(b.code) ?? 0) > (COUVERTURE.get(a.code) ?? 0) ? b : a)).code;
}

/** Raccourci : de l'en-tête brut à l'origine retenue. */
export function originFromGeoHeader(header: string | null | undefined): string {
  return nearestHomeOrigin(parseNetlifyGeo(header));
}
