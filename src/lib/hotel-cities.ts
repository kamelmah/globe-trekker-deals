/**
 * Villes couvertes par les pages hébergement.
 *
 * Rien n'est saisi deux fois : le nom d'usage et le pays viennent de la liste
 * blanche des liaisons, seule source de vérité des villes du site. Une ville
 * qui n'y figure pas n'a pas de page hébergement — sans quoi nous publierions
 * des pages pour des destinations que nous ne desservons pas.
 */

import { CITY_GUIDES } from "@/data/city-guides";
import { PRUNED_GUIDE_SLUGS, withoutPruned } from "@/data/pruned-pages";
import { ROUTE_WHITELIST } from "@/data/route-whitelist";
import { dateOr, numberOr } from "@/lib/search-params";
import { slugify } from "@/lib/slug";

export type VilleHotel = {
  /** Code IATA de la ville, pour retrouver son visuel et ses relevés de prix. */
  code: string;
  ville: string;
  pays: string;
  slug: string;
};

/** Index code IATA → ville/pays, construit une fois depuis la liste blanche. */
const PAR_CODE = new Map<string, { ville: string; pays: string }>();
for (const route of ROUTE_WHITELIST) {
  if (!PAR_CODE.has(route.destination)) {
    PAR_CODE.set(route.destination, { ville: route.destinationCity, pays: route.country });
  }
}

function villeDe(code: string): VilleHotel | null {
  const connue = PAR_CODE.get(code);
  if (!connue) return null;
  return { code, ville: connue.ville, pays: connue.pays, slug: slugify(connue.ville) };
}

/**
 * Les six villes mises en avant sur /hebergement : celles que nos visiteurs
 * cherchent le plus, Maghreb en tête.
 */
export const FEATURED_HOTEL_CITY_CODES = ["ALG", "ORN", "LIS", "TUN", "RAK", "IST"] as const;

export const FEATURED_HOTEL_CITIES: VilleHotel[] = FEATURED_HOTEL_CITY_CODES.map(villeDe).filter(
  (ville): ville is VilleHotel => ville !== null,
);

/**
 * Villes ayant leur propre page /hebergement/<ville> : les six mises en avant,
 * plus toute ville de la liste blanche qui a déjà un guide destination publié —
 * là, nous avons de quoi écrire autre chose qu'une carte, et le maillage
 * interne guide ↔ hébergement a un sens.
 */
export const HOTEL_CITIES: VilleHotel[] = (() => {
  const villes = new Map<string, VilleHotel>();
  for (const ville of FEATURED_HOTEL_CITIES) villes.set(ville.slug, ville);
  for (const guide of withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS)) {
    const ville = villeDe(guide.destination);
    if (ville && !villes.has(ville.slug)) villes.set(ville.slug, ville);
  }
  return [...villes.values()].sort((a, b) => a.ville.localeCompare(b.ville, "fr"));
})();

export function findHotelCity(slug: string): VilleHotel | null {
  const cherche = slugify(slug);
  return HOTEL_CITIES.find((ville) => ville.slug === cherche) ?? null;
}

/** Paramètres d'URL partagés par /hebergement et /hebergement/<ville>. */
export type HebergementSearch = {
  ville?: string;
  arrivee?: string;
  depart?: string;
  voyageurs?: number;
};

/**
 * Lecture des `?ville=&arrivee=&depart=&voyageurs=` posés par les pages de vol
 * et de résultats. Une seule implémentation pour les deux routes : elles
 * doivent comprendre exactement les mêmes liens.
 *
 * Chaque clé est FACULTATIVE et n'est émise que si elle est réellement dans
 * l'URL. Renvoyer les quatre à chaque fois ferait réécrire l'URL par le
 * routeur — `/hebergement` répondrait 307 vers
 * `/hebergement?ville=&arrivee=&depart=&voyageurs=1` — et une 307 ne se met pas
 * en cache en edge : la page perdrait tout cache CDN, comme l'accueil l'avait
 * perdu pour la même raison.
 */
export function validateHebergementSearch(search: Record<string, unknown>): HebergementSearch {
  const brut = typeof search["ville"] === "string" ? search["ville"] : "";
  // Un nom de ville, pas un code : on borne la longueur sans rien réécrire.
  const ville = brut.trim().slice(0, 80);
  const arrivee = dateOr(search["arrivee"], "");
  const depart = dateOr(search["depart"], "");
  const voyageurs =
    search["voyageurs"] === undefined
      ? 0
      : Math.min(9, Math.max(1, Math.round(numberOr(search["voyageurs"], 1))));
  return {
    ...(ville ? { ville } : {}),
    ...(arrivee ? { arrivee } : {}),
    ...(depart ? { depart } : {}),
    ...(voyageurs ? { voyageurs } : {}),
  };
}
