/**
 * Choix des « autres destinations » listées en bas d'une page
 * /vols/<origine>-<destination>.
 *
 * Le bloc affichait les mêmes douze liaisons sur les 128 pages : ~360 mots
 * rigoureusement identiques d'une page à l'autre, et le premier facteur de
 * duplication entre elles. La sélection dépend maintenant de la page où l'on
 * se trouve.
 *
 * Trois priorités, dans cet ordre, chacune triée par prix croissant :
 *   1. même pays que la destination affichée ;
 *   2. pays limitrophe ou de la même zone de voyage ;
 *   3. le reste, du moins cher au plus cher.
 *
 * Fonction pure : aucune lecture réseau ni base. Elle reçoit les liaisons
 * candidates avec leur prix déjà relevé et rend la liste ordonnée.
 */

import { areNeighbourCountries, countryWithArticle, normalizeCountry } from "@/data/country-zones";

/** Nombre de liaisons affichées. Douze diluaient ; huit tiennent en deux colonnes. */
export const RELATED_ROUTES_LIMIT = 8;

/**
 * À partir de quatre liaisons vers le pays de la destination affichée, le bloc
 * parle de ce pays. En dessous, la liste est trop mélangée pour l'annoncer.
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
 * Ordonne les liaisons candidates par priorité puis par prix, et s'arrête à
 * `limit`. La liaison affichée doit avoir été retirée en amont (elle l'est par
 * code IATA, pas par nom de ville).
 */
export function rankRelatedRoutes(
  candidates: RelatedCandidate[],
  options: { destinationCountry?: string | null | undefined; limit?: number | undefined },
): RankedRelatedRoute[] {
  const country = options.destinationCountry ?? null;
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
    for (const candidate of tiers[tier].sort(byPriceThenCity)) {
      if (ranked.length >= limit) return ranked;
      ranked.push({ ...candidate, tier });
    }
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
