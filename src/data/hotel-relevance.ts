/**
 * L'hébergement est-il une question pertinente sur cette destination ?
 *
 * Sur les liaisons du Maghreb, la réponse est massivement non : ces vols sont
 * très majoritairement des visites à la famille, où l'on est logé. Mettre un
 * encart hôtel en tête de page y occupe la meilleure place de l'écran avec une
 * offre qui ne concerne presque personne.
 *
 * Le bloc n'est JAMAIS supprimé — une minorité de voyageurs cherche bien un
 * hôtel à Alger, et le leur retirer serait aussi faux que de le mettre en
 * avant. Il descend simplement en bas de page.
 *
 * EN DUR ET DANS UN FICHIER À PART, pas dans `route-whitelist.ts` : celui-ci
 * est généré, tout ajout à la main y serait écrasé au prochain
 * `refresh-route-whitelist`.
 */

import { normalizeCountry } from "@/data/country-zones";

/**
 * Pays dont toutes les destinations sont concernées.
 *
 * Algérie et Tunisie : ce sont les liaisons de visite familiale du site.
 */
const PAYS_SANS_HOTEL = new Set(["algerie", "tunisie"]);

/**
 * Destinations nommément désignées, hors des pays ci-dessus.
 *
 * Casablanca seule pour le Maroc. Marrakech, Fès, Tanger et Agadir gardent
 * l'encart en tête : ce sont des destinations de séjour, où la question de
 * l'hôtel se pose vraiment.
 */
const DESTINATIONS_SANS_HOTEL = new Set(["CMN"]);

/**
 * `true` par défaut : une destination inconnue de ces listes garde l'encart
 * hôtel en tête. Le doute profite à l'affichage habituel, pas à sa relégation.
 */
export function hotelPertinent(
  destination: string | null | undefined,
  country: string | null | undefined,
): boolean {
  if (destination && DESTINATIONS_SANS_HOTEL.has(destination.toUpperCase())) return false;
  if (country && PAYS_SANS_HOTEL.has(normalizeCountry(country))) return false;
  return true;
}
