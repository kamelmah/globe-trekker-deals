/**
 * Choix des « autres destinations » listées en bas d'une page
 * /vols/<origine>-<destination>.
 *
 * Le bloc affichait les mêmes douze liaisons sur les 128 pages : ~360 mots
 * rigoureusement identiques d'une page à l'autre, et le premier facteur de
 * duplication entre elles. La sélection dépend maintenant de la page où l'on
 * se trouve.
 *
 * Trois priorités, dans cet ordre :
 *   1. même pays que la destination affichée, PLAFONNÉE à quatre liens ;
 *   2. pays limitrophe ou de la même zone de voyage ;
 *   3. le reste, du moins cher au plus cher.
 *
 * Les priorités 1 et 2 retiennent les villes les PLUS PROCHES de la destination
 * affichée, et les affichent ensuite du moins cher au plus cher. La priorité 3
 * complète au prix le plus bas.
 *
 * Pourquoi la proximité et pas seulement le prix : deux pages d'un même pays
 * puisent dans le même vivier. Trié par prix, ce vivier rend la même liste sur
 * les deux pages — les sept pages algériennes au départ de Marseille
 * partageaient sept à huit liens sur huit, et plafonner la priorité 1 n'y
 * changeait rien (le plafond fige les quatre mêmes villes les moins chères du
 * pays). La distance à la destination affichée est le seul critère qui diffère
 * d'une page à l'autre : c'est lui qui rend les listes distinctes, et il vaut
 * aussi pour le lecteur — depuis la page d'Oran, Tlemcen et Fès sont plus utiles
 * qu'Annaba.
 *
 * Fonction pure : aucune lecture réseau ni base. Elle reçoit les liaisons
 * candidates avec leur prix déjà relevé et rend la liste ordonnée.
 */

import { distanceBetweenCities } from "@/data/city-coordinates";
import { areNeighbourCountries, countryWithArticle, normalizeCountry } from "@/data/country-zones";

/** Nombre de liaisons affichées. Douze diluaient ; huit tiennent en deux colonnes. */
export const RELATED_ROUTES_LIMIT = 8;

/**
 * Nombre maximum de liens vers le pays de la destination affichée.
 *
 * La moitié de la liste, pas davantage : le reste vient obligatoirement des
 * pays voisins puis des liaisons les moins chères. Le plafond n'est pas comblé
 * en sens inverse — si les priorités 2 et 3 sont vides, le bloc est plus court
 * plutôt que rempli de liaisons que la page voisine affiche déjà.
 */
export const COUNTRY_QUOTA = 4;

/**
 * À partir de quatre liaisons vers le pays de la destination affichée, le bloc
 * parle de ce pays. En dessous, la liste est trop mélangée pour l'annoncer.
 *
 * Égal à `COUNTRY_QUOTA` aujourd'hui, donc le titre nomme le pays exactement
 * quand le plafond est atteint. Les deux restent séparés parce qu'ils répondent
 * à deux questions : combien de liens on autorise, et à partir de quand la
 * liste mérite d'être annoncée comme celle d'un pays.
 */
export const COUNTRY_HEADING_THRESHOLD = 4;

export type RelatedCandidate = {
  slug: string;
  /** Code IATA de la ville d'arrivée : sert au visuel et à son alt. */
  destination: string;
  city: string;
  country: string;
  /** Plancher déjà relevé, ou null quand aucun relevé n'existe. */
  priceEur: number | null;
};

/** Priorité qui a fait entrer la liaison dans la liste. */
export type RelatedTier = 1 | 2 | 3;

export type RankedRelatedRoute = RelatedCandidate & { tier: RelatedTier };

function sameCountry(a: string, b: string): boolean {
  return normalizeCountry(a) === normalizeCountry(b);
}

/**
 * Prix croissant, puis ville par ordre alphabétique.
 *
 * Le second critère n'est pas cosmétique : sans relevé de prix, toutes les
 * liaisons valent `null` et l'ordre dépendrait alors de celui de la liste
 * blanche, donc changerait à chaque régénération de ce fichier.
 */
function byPriceThenCity(a: RelatedCandidate, b: RelatedCandidate): number {
  const priceA = a.priceEur ?? Number.POSITIVE_INFINITY;
  const priceB = b.priceEur ?? Number.POSITIVE_INFINITY;
  if (priceA !== priceB) return priceA - priceB;
  return a.city.localeCompare(b.city, "fr");
}

/**
 * Distance croissante à la destination affichée, puis prix.
 *
 * Une ville dont nous n'avons pas les coordonnées passe en fin de priorité
 * plutôt que d'être écartée : elle reste affichable, simplement moins
 * prioritaire que celles que nous savons situer.
 */
function byDistanceThenPrice(
  destinationCode: string | null,
): (a: RelatedCandidate, b: RelatedCandidate) => number {
  return (a, b) => {
    const distA = distanceBetweenCities(destinationCode, a.destination) ?? Number.POSITIVE_INFINITY;
    const distB = distanceBetweenCities(destinationCode, b.destination) ?? Number.POSITIVE_INFINITY;
    if (distA !== distB) return distA - distB;
    return byPriceThenCity(a, b);
  };
}

/**
 * Ordonne les liaisons candidates par priorité, et s'arrête à
 * `limit`. La liaison affichée doit avoir été retirée en amont (elle l'est par
 * code IATA, pas par nom de ville).
 */
export function rankRelatedRoutes(
  candidates: RelatedCandidate[],
  options: {
    destinationCountry?: string | null | undefined;
    /** Code IATA de la destination affichée : origine des distances. */
    destinationCode?: string | null | undefined;
    limit?: number | undefined;
  },
): RankedRelatedRoute[] {
  const country = options.destinationCountry ?? null;
  const code = options.destinationCode ?? null;
  const limit = options.limit ?? RELATED_ROUTES_LIMIT;

  const tiers: Record<RelatedTier, RelatedCandidate[]> = { 1: [], 2: [], 3: [] };
  for (const candidate of candidates) {
    const tier: RelatedTier = !country
      ? 3
      : sameCountry(candidate.country, country)
        ? 1
        : areNeighbourCountries(candidate.country, country)
          ? 2
          : 3;
    tiers[tier].push(candidate);
  }

  const ranked: RankedRelatedRoute[] = [];
  for (const tier of [1, 2, 3] as const) {
    if (ranked.length >= limit) break;
    // Seule la priorité 1 est plafonnée : c'est elle que deux pages d'un même
    // pays tirent du même vivier.
    const quota = tier === 1 ? Math.min(COUNTRY_QUOTA, limit) : limit;
    const room = Math.min(quota, limit - ranked.length);
    // Priorités 1 et 2 : on RETIENT les plus proches de la destination affichée
    // (seul critère propre à la page), on AFFICHE du moins cher au plus cher.
    // Priorité 3 : le complément, au prix le plus bas, comme annoncé au lecteur.
    const retenues =
      tier === 3
        ? tiers[tier].sort(byPriceThenCity).slice(0, room)
        : tiers[tier].sort(byDistanceThenPrice(code)).slice(0, room).sort(byPriceThenCity);
    for (const candidate of retenues) ranked.push({ ...candidate, tier });
  }
  return ranked;
}

/** Nombre de liaisons de priorité 1 réellement retenues. */
export function countryMatchCount(routes: RankedRelatedRoute[]): number {
  return routes.filter((route) => route.tier === 1).length;
}

/**
 * Titre du bloc, aligné sur ce qu'il contient réellement : il n'annonce le pays
 * que si la liste en est majoritairement faite.
 */
export function relatedRoutesHeading(params: {
  originCity: string;
  destinationCountry: string;
  routes: RankedRelatedRoute[];
}): string {
  if (countryMatchCount(params.routes) >= COUNTRY_HEADING_THRESHOLD) {
    return `Autres vols vers ${countryWithArticle(params.destinationCountry)} depuis ${params.originCity}`;
  }
  return `Autres destinations depuis ${params.originCity}`;
}

/** Phrase d'accroche du bloc, accordée elle aussi au contenu de la liste. */
export function relatedRoutesIntro(params: {
  originCity: string;
  destinationCountry: string;
  routes: RankedRelatedRoute[];
}): string {
  const scope =
    countryMatchCount(params.routes) >= COUNTRY_HEADING_THRESHOLD
      ? `vers ${countryWithArticle(params.destinationCountry)} depuis ${params.originCity}`
      : `depuis ${params.originCity}`;
  return `Prix les plus bas déjà relevés ${scope}, taxes incluses. Chaque lien mène à la fiche complète du trajet.`;
}
