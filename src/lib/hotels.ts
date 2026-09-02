/**
 * Liens d'affiliation Hotels.com (programme Hotels.com EMEA / Expedia, via CJ).
 *
 * Contrairement aux compléments Travelpayouts (voir affiliate-partners.ts),
 * CJ fonctionne en « deep link » : on prend n'importe quelle URL de
 * fr.hotels.com et on l'enveloppe dans le lien de tracking du compte.
 * Aucun script ni pixel n'est nécessaire côté site.
 *
 * Commissions par défaut : hôtels 4 %, locations de vacances 2 %, voitures 1,5 %.
 * Toujours afficher ces liens avec rel="sponsored nofollow" (règle Google).
 */

/** Identifiant du site TrouveMonVol.fr dans le compte CJ. */
const CJ_PID = "101873890";
/** Lien texte profond Hotels.com France (5275603) utilisé comme support. */
const CJ_LINK_ID = "14061559";

const CJ_BASE = `https://www.anrdoezrs.net/click-${CJ_PID}-${CJ_LINK_ID}`;

/**
 * Transforme une URL fr.hotels.com en lien affilié suivi par CJ.
 * @param urlHotelsCom URL complète d'une page fr.hotels.com (ville, hôtel, recherche…)
 * @param sid Identifiant libre (facultatif) pour retrouver l'origine du clic
 *            dans les rapports CJ, ex. "guide-oran" ou "vols-marseille-alger".
 */
export function lienHotels(urlHotelsCom: string, sid?: string): string {
  const url = `${CJ_BASE}?url=${encodeURIComponent(urlHotelsCom)}`;
  return sid ? `${url}&sid=${encodeURIComponent(sid)}` : url;
}

/**
 * URL de recherche Hotels.com pour une ville, à passer ensuite à lienHotels().
 *
 * Paramètres vérifiés en direct sur fr.hotels.com : `destination`, `startDate`,
 * `endDate` et `adults` sont bien pris en compte (la page confirme la ville, la
 * plage de dates et le nombre de voyageurs).
 *
 * Les dates ne partent QUE par paire. Envoyer `startDate` seul ne donne pas une
 * recherche ouverte : Hotels.com ignore alors les deux dates et retombe
 * silencieusement sur son séjour par défaut (la nuit prochaine), ce qui
 * afficherait des prix sans rapport avec le séjour annoncé sur notre page.
 * Mieux vaut aucune date, et laisser le visiteur choisir chez eux.
 */
export function rechercheHotelsCom(
  ville: string,
  options: { arrivee?: string; depart?: string; voyageurs?: number } = {},
): string {
  const params = new URLSearchParams({ destination: ville });
  if (options.arrivee && options.depart) {
    params.set("startDate", options.arrivee);
    params.set("endDate", options.depart);
  }
  if (options.voyageurs && options.voyageurs > 0) {
    params.set("adults", String(Math.round(options.voyageurs)));
  }
  return `https://fr.hotels.com/Hotel-Search?${params.toString()}`;
}

/** Raccourci : lien affilié vers la recherche d'hôtels d'une ville. */
export function lienHotelsVille(
  ville: string,
  options: { arrivee?: string; depart?: string; voyageurs?: number; sid?: string } = {},
): string {
  const { sid, ...recherche } = options;
  return lienHotels(rechercheHotelsCom(ville, recherche), sid);
}
