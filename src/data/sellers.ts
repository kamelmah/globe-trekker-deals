/**
 * Nature du vendeur d'un billet : la compagnie elle-même, ou une agence en ligne.
 *
 * POURQUOI C'EST NÉCESSAIRE
 *
 * Nommer le vendeur ne suffit pas : « Vendu par Kiwi.com » ou « Vendu par
 * Clickavia » ne dit rien à un voyageur qui ne connaît pas ces noms. Or ce sont
 * des intermédiaires, et plusieurs d'entre eux ajoutent des frais de service au
 * moment du paiement. Annoncer « aucune surprise » puis envoyer là-bas sans
 * prévenir serait se contredire.
 *
 * CE QUE MONTRE LA MESURE
 *
 * Sur 234 offres relevées le 2026-09-01 (10 trajets, 3 mois), 18 vendeurs
 * distincts apparaissent : 17 sont des agences en ligne, une seule est une
 * compagnie vendant en direct. La vente directe est donc l'exception, pas la
 * règle — le badge « agence » sera de loin le plus fréquent, et c'est une
 * information en soi.
 *
 * MAINTENANCE
 *
 * Ajouter un vendeur = une ligne dans l'une des deux listes ci-dessous. Un
 * vendeur inconnu est traité comme une agence : c'est le cas le plus probable,
 * et le plus prudent — on prévient d'un risque de frais qui n'existe peut-être
 * pas, plutôt que de taire un risque réel.
 */

export type SellerKind = "compagnie" | "agence";

/** Normalise un nom de vendeur pour la comparaison : casse, accents, ponctuation. */
function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

/**
 * Vendeurs qui SONT la compagnie aérienne. Un billet acheté là revient à
 * acheter au guichet du transporteur : pas d'intermédiaire, donc pas de frais
 * de service d'agence, et le service après-vente est celui de la compagnie.
 */
const COMPAGNIES = [
  "Frenchbee",
  "French Bee",
  "Ryanair",
  "easyJet",
  "Transavia",
  "Vueling",
  "Volotea",
  "Air France",
  "Wizz Air",
  "Pegasus",
  "Air Algérie",
  "Tunisair",
  "Nouvelair",
  "Royal Air Maroc",
  "Air Arabia",
  "Turkish Airlines",
  "Iberia",
  "British Airways",
  "Lufthansa",
  "KLM",
  "Air Corsica",
  "Aegean Airlines",
  "ITA Airways",
  "TAP Air Portugal",
  "Emirates",
  "Qatar Airways",
  "EgyptAir",
];

/**
 * Agences en ligne rencontrées dans les résultats. Cette liste ne change pas le
 * comportement — une agence inconnue est traitée pareil — mais elle documente
 * ce que la source tarifaire renvoie réellement, et sert de garde-fou : un nom
 * qui n'y figure pas mérite d'être vérifié avant d'être ajouté aux compagnies.
 */
const AGENCES = [
  "Aviasales",
  "Trip.com",
  "Kupi.com",
  "Aviakassa",
  "Clickavia",
  "Kiwi.com",
  "Farera",
  "City.Travel",
  "Tickets",
  "Mytrip.com",
  "Flightnetwork",
  "Biletix",
  "Lucky2Go",
  "Wingie",
  "Vayama",
  "Gotogate",
  "SuperKassa",
  "Jetradar",
  "Kupibilet",
  "Biletik.aero",
  "OneTwoTrip",
  "Multibilet",
  "Cheap.travel",
];

const COMPAGNIES_NORM = new Set(COMPAGNIES.map(normalize));
const AGENCES_NORM = new Set(AGENCES.map(normalize));

export type SellerNature = {
  kind: SellerKind;
  /** Le vendeur figure-t-il dans l'une de nos listes, ou est-ce le repli ? */
  known: boolean;
};

/**
 * Nature d'un vendeur.
 *
 * `airline` est le nom de la compagnie qui opère le vol : quand le vendeur
 * porte ce nom, c'est une vente directe même si la compagnie n'est pas encore
 * listée. Sans ce rapprochement, toute nouvelle compagnie vendant en direct
 * serait étiquetée « agence », ce qui serait faux.
 */
export function sellerNature(
  seller: string | null | undefined,
  airline?: string | null,
): SellerNature {
  if (!seller) return { kind: "agence", known: false };
  const vendeur = normalize(seller);
  if (!vendeur) return { kind: "agence", known: false };

  if (COMPAGNIES_NORM.has(vendeur)) return { kind: "compagnie", known: true };
  if (airline && normalize(airline) === vendeur) return { kind: "compagnie", known: true };
  if (AGENCES_NORM.has(vendeur)) return { kind: "agence", known: true };

  // Repli : le cas de loin le plus fréquent, et le plus prudent.
  return { kind: "agence", known: false };
}
