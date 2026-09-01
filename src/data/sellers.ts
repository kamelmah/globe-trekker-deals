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

type AgenceEntry = {
  name: string;
  /**
   * Groupe propriétaire, quand plusieurs marques du même propriétaire
   * apparaissent dans nos résultats. Sans cette mention, quatre lignes Gotogate,
   * Mytrip, Flightnetwork et SuperSaver donnent l'illusion de quatre options
   * concurrentes alors que c'est le même opérateur, avec le même tunnel de
   * paiement et les mêmes frais de service.
   */
  group?: string;
  /**
   * Domaine du vendeur, utilisé pour construire le lien vers ses avis publics.
   * Aucune note n'est récupérée : les CGU de Trustpilot interdisent le
   * moissonnage, un lien sortant suffit et laisse le lecteur juger sur pièces.
   */
  domain?: string;
};

/**
 * Agences en ligne rencontrées dans les résultats. Cette liste ne change pas la
 * nature attribuée — une agence inconnue est traitée pareil — mais elle porte
 * le groupe propriétaire et le domaine, et sert de garde-fou : un nom qui n'y
 * figure pas mérite d'être vérifié avant d'être ajouté aux compagnies.
 */
const AGENCES: readonly AgenceEntry[] = [
  { name: "Aviasales", domain: "aviasales.com" },
  { name: "Trip.com", group: "Trip.com Group", domain: "trip.com" },
  { name: "Vayama", group: "Trip.com Group", domain: "vayama.com" },
  { name: "Gotogate", group: "Etraveli Group", domain: "gotogate.com" },
  { name: "Mytrip", group: "Etraveli Group", domain: "mytrip.com" },
  { name: "Mytrip.com", group: "Etraveli Group", domain: "mytrip.com" },
  { name: "Flightnetwork", group: "Etraveli Group", domain: "flightnetwork.com" },
  { name: "SuperSaver", group: "Etraveli Group", domain: "supersaver.com" },
  { name: "Kupi.com", domain: "kupi.com" },
  { name: "Aviakassa", domain: "aviakassa.com" },
  { name: "Clickavia", domain: "clickavia.ru" },
  { name: "Kiwi.com", domain: "kiwi.com" },
  { name: "Farera", domain: "farera.com" },
  { name: "City.Travel", domain: "city.travel" },
  { name: "Tickets", domain: "tickets.ua" },
  { name: "Biletix", domain: "biletix.com" },
  { name: "Lucky2Go", domain: "lucky2go.com" },
  { name: "Wingie", domain: "wingie.com" },
  { name: "SuperKassa", domain: "superkassa.ru" },
  { name: "Jetradar", domain: "jetradar.com" },
  { name: "Kupibilet", domain: "kupibilet.ru" },
  { name: "Biletik.aero", domain: "biletik.aero" },
  { name: "OneTwoTrip", domain: "onetwotrip.com" },
  { name: "Multibilet", domain: "multibilet.ru" },
  { name: "Cheap.travel", domain: "cheap.travel" },
];

const COMPAGNIES_NORM = new Set(COMPAGNIES.map(normalize));
const AGENCES_PAR_NOM = new Map(AGENCES.map((a) => [normalize(a.name), a]));

export type SellerNature = {
  kind: SellerKind;
  /** Le vendeur figure-t-il dans l'une de nos listes, ou est-ce le repli ? */
  known: boolean;
  /** Groupe propriétaire, quand nous le connaissons. */
  group?: string;
  /**
   * Nom à afficher : « Gotogate (groupe Etraveli) » plutôt que « Gotogate »,
   * pour que quatre marques du même propriétaire ne passent pas pour quatre
   * options distinctes.
   */
  label: string;
  /** Lien vers les avis publics du vendeur, ou null si le domaine est inconnu. */
  reviewsUrl: string | null;
};

/** Groupe affiché sans son suffixe « Group », qui alourdit sans rien apporter. */
function groupLabel(group: string): string {
  return group.replace(/\s+Group$/i, "");
}

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
  const nom = seller?.trim() ?? "";
  const inconnu: SellerNature = {
    kind: "agence",
    known: false,
    label: nom || "vendeur non communiqué",
    reviewsUrl: null,
  };
  if (!nom) return inconnu;
  const vendeur = normalize(nom);
  if (!vendeur) return inconnu;

  if (COMPAGNIES_NORM.has(vendeur) || (airline && normalize(airline) === vendeur)) {
    return { kind: "compagnie", known: true, label: nom, reviewsUrl: null };
  }

  const agence = AGENCES_PAR_NOM.get(vendeur);
  if (!agence) return inconnu;

  // « Trip.com (groupe Trip.com) » n'apprend rien : le suffixe n'a de sens que
  // lorsque la marque et le groupe portent des noms différents.
  const suffixeUtile =
    agence.group !== undefined && normalize(agence.name) !== normalize(groupLabel(agence.group));

  return {
    kind: "agence",
    known: true,
    ...(agence.group ? { group: agence.group } : {}),
    label:
      suffixeUtile && agence.group
        ? `${agence.name} (groupe ${groupLabel(agence.group)})`
        : agence.name,
    reviewsUrl: agence.domain ? `https://fr.trustpilot.com/review/${agence.domain}` : null,
  };
}
