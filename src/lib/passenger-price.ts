/**
 * Estimation du prix total pour plusieurs voyageurs.
 *
 * Vérifié en direct sur l'API Travelpayouts (`/aviasales/v3/prices_for_dates`) :
 * le prix renvoyé est strictement identique que l'on demande `adults=1` ou
 * `adults=4` sur la même offre — ce paramètre ne change pas le prix retourné
 * par cette source (donnée en cache, pas une cotation en temps réel). Le
 * `price` reçu est donc une référence par voyageur payant, jamais un vrai
 * total multi-passagers.
 *
 * On multiplie nous-mêmes par le nombre de voyageurs payants (adultes +
 * enfants, tarif plein par simplification faute de grille tarifaire réelle)
 * pour éviter d'afficher un prix figé sur 1 passager quel que soit le nombre
 * réellement demandé. Les bébés ne sont volontairement pas comptés : leur
 * tarif (souvent une taxe fixe ou gratuit) n'est pas fiable à estimer sans
 * donnée réelle par compagnie, et l'inclure au tarif plein exagérerait le prix.
 *
 * Cette multiplication ne doit jamais être appliquée avant l'écriture d'un
 * cache partagé entre recherches (price_cache, world-scan) : ces caches
 * doivent toujours contenir le prix de référence par voyageur, jamais un
 * total déjà multiplié pour un nombre de passagers propre à une recherche.
 */

export type PassengerCounts = { adults: number; children: number; infants: number };

export function payingTravelers(passengers: PassengerCounts): number {
  return Math.max(1, passengers.adults + passengers.children);
}

/** Applique la multiplication au prix de référence (par voyageur payant) d'une offre. */
export function totalPriceForPassengers(
  referencePriceEur: number,
  passengers: PassengerCounts,
): number {
  return Math.round(referencePriceEur * payingTravelers(passengers));
}
