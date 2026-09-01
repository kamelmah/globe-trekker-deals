/**
 * Frais de bagages publiés par compagnie.
 *
 * POURQUOI CE FICHIER EXISTE
 *
 * Notre source tarifaire ne renvoie AUCUNE donnée bagage : ni champ, ni famille
 * tarifaire, ni second prix. Vérifié endpoint par endpoint (`prices_for_dates`,
 * `grouped_prices`, `prices/latest`, `city-directions`, `month-matrix`) — le
 * seul champ approchant est `trip_class`, qui est la classe de voyage. L'API de
 * recherche temps réel, la seule qui exposerait le détail des tarifs, répond
 * 403 sur notre compte.
 *
 * Ce barème est donc tenu à la main, à partir des tarifs publiés par les
 * compagnies. Chaque entrée porte sa source et sa date de vérification, et
 * l'interface les affiche : un chiffre non sourcé n'a rien à faire ici.
 *
 * CE QUE CES MONTANTS SONT, ET NE SONT PAS
 *
 * Ce sont les frais PUBLIÉS par la compagnie, pas un prix négocié pour un vol
 * précis. Ils varient selon la ligne, la saison, le poids et surtout le moment
 * de l'achat — un bagage acheté au comptoir coûte souvent le double ou le triple
 * de son prix en ligne. D'où des fourchettes, jamais un chiffre unique : le
 * total affiché sur une carte de résultat est une ESTIMATION BASSE, jamais un
 * prix ferme.
 *
 * Une compagnie absente de ce fichier n'est pas une compagnie sans bagages :
 * c'est une compagnie que nous n'avons pas documentée. L'interface le dit
 * explicitement plutôt que de laisser deviner.
 *
 * À revérifier tous les six mois, comme la liste blanche des routes.
 */

/** Ce que le tarif de base prévoit pour un type de bagage donné. */
export type BaggageAllowance =
  /** Compris dans le tarif de base, sans supplément. */
  | { kind: "inclus"; weightKg?: number }
  /**
   * Payant, avec la fourchette des tarifs publiés en ligne. `maxEur` couvre les
   * lignes et périodes les plus chères ; `atAirportEur` est le tarif au comptoir
   * quand la compagnie le publie, systématiquement bien plus élevé.
   */
  | { kind: "payant"; minEur: number; maxEur: number; weightKg?: number; atAirportEur?: number }
  /** Non documenté chez nous : à ne jamais présenter comme gratuit ni comme payant. */
  | { kind: "inconnu" };

export type AirlineBaggagePolicy = {
  /** Code IATA tel que renvoyé par la source tarifaire. */
  airline: string;
  name: string;
  /** Petit sac sous le siège. */
  personalItem: BaggageAllowance;
  /** Bagage cabine à placer dans le coffre. */
  cabinBag: BaggageAllowance;
  /** Bagage en soute. */
  checkedBag: BaggageAllowance;
  /** D'où vient l'information. */
  source: string;
  /** Date à laquelle nous l'avons vérifiée. */
  verifiedAt: string;
  note?: string;
};

const VERIFIED = "2026-09-01";

/**
 * Les compagnies présentes sur les routes de la liste blanche, par ordre de
 * couverture. Les six documentées ici représentent environ deux tiers des
 * occurrences ; les autres affichent la mention « information non fournie ».
 */
export const AIRLINE_BAGGAGE: readonly AirlineBaggagePolicy[] = [
  {
    airline: "FR",
    name: "Ryanair",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "payant", minEur: 6, maxEur: 36 },
    checkedBag: { kind: "payant", minEur: 19, maxEur: 60, weightKg: 20, atAirportEur: 60 },
    source: "https://olyneia.com/blogs/infos/frais-bagage-ryanair-2026-comment-les-eviter",
    verifiedAt: VERIFIED,
    note: "Seul un petit sac sous le siège est compris. Le bagage cabine dans le coffre est payant.",
  },
  {
    airline: "TO",
    name: "Transavia",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "payant", minEur: 31, maxEur: 45, weightKg: 20, atAirportEur: 70 },
    source:
      "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
    verifiedAt: VERIFIED,
  },
  {
    airline: "V7",
    name: "Volotea",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "payant", minEur: 15, maxEur: 34, weightKg: 20, atAirportEur: 65 },
    source:
      "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
    verifiedAt: VERIFIED,
    note: "Le tarif du bagage en soute varie selon la saison.",
  },
  {
    airline: "AH",
    name: "Air Algérie",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "inclus", weightKg: 23 },
    source:
      "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
    verifiedAt: VERIFIED,
    note: "Soute comprise dans le tarif de base, ce qui compense souvent un billet plus cher au départ.",
  },
  {
    airline: "TU",
    name: "Tunisair",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "inclus", weightKg: 23 },
    source: "https://www.tunisair.com/en/guide-utilisateur/prepare-your-luggage",
    verifiedAt: VERIFIED,
    note: "23 kg sur la plupart des lignes ; jusqu'à 32 kg selon la destination et la cabine.",
  },
  {
    airline: "BJ",
    name: "Nouvelair",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "inclus", weightKg: 25 },
    source: "https://www.marhba.com/voyages/tout-savoir-sur-la-franchise-bagage-de-nouvelair",
    verifiedAt: VERIFIED,
    note: "Offre Pack Easy : 10 kg en cabine et 25 kg en soute compris.",
  },
  {
    airline: "U2",
    name: "easyJet",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "payant", minEur: 6, maxEur: 33 },
    // easyJet vend la soute par tranches de 3 kg : il n'existe pas de tarif
    // unique pour 20 kg, on préfère ne rien afficher plutôt qu'approximer.
    checkedBag: { kind: "inconnu" },
    source: "https://easyscape.eu/blog/regles-bagages-compagnies-low-cost-2026",
    verifiedAt: VERIFIED,
    note: "La soute se paie par tranches de 3 kg jusqu'à 32 kg : pas de tarif unique pour 20 kg.",
  },
];

const PAR_CODE = new Map(AIRLINE_BAGGAGE.map((p) => [p.airline, p]));

/** Politique bagages d'une compagnie, ou null si nous ne l'avons pas documentée. */
export function baggagePolicy(airline: string | null | undefined): AirlineBaggagePolicy | null {
  if (!airline) return null;
  return PAR_CODE.get(airline.toUpperCase()) ?? null;
}

/** Les trois niveaux entre lesquels un voyageur arbitre réellement. */
export type BaggageLevel = "personnel" | "cabine" | "soute";

export const BAGGAGE_LEVELS: readonly { value: BaggageLevel; label: string; short: string }[] = [
  { value: "personnel", label: "Objet personnel seul", short: "Sac sous le siège" },
  { value: "cabine", label: "Bagage cabine", short: "Cabine" },
  { value: "soute", label: "Bagage en soute", short: "Soute" },
];

function allowanceFor(policy: AirlineBaggagePolicy, level: BaggageLevel): BaggageAllowance {
  if (level === "personnel") return policy.personalItem;
  if (level === "cabine") return policy.cabinBag;
  return policy.checkedBag;
}

export type BaggageSupplement =
  /** Aucun supplément : ce niveau est compris dans le tarif. */
  | { kind: "inclus"; weightKg?: number }
  /** Supplément à partir de `minEur` (fourchette publiée `minEur`–`maxEur`). */
  | { kind: "payant"; minEur: number; maxEur: number; weightKg?: number; atAirportEur?: number }
  /** Compagnie non documentée, ou niveau non documenté chez cette compagnie. */
  | { kind: "inconnu" };

/**
 * Supplément à ajouter au prix du billet pour voyager avec ce niveau de bagage.
 *
 * Les trois niveaux sont ALTERNATIFS, pas cumulatifs. Prendre une soute chez
 * Ryanair n'oblige pas à payer aussi le bagage cabine : on garde l'objet
 * personnel compris et on ajoute la soute. Additionner les deux gonflerait le
 * prix annoncé — l'inverse exact de ce que ce comparateur prétend faire.
 */
export function baggageSupplement(
  airline: string | null | undefined,
  level: BaggageLevel,
): BaggageSupplement {
  const policy = baggagePolicy(airline);
  if (!policy) return { kind: "inconnu" };

  const allowance = allowanceFor(policy, level);
  if (allowance.kind === "inconnu") return { kind: "inconnu" };
  if (allowance.kind === "inclus") {
    return allowance.weightKg === undefined
      ? { kind: "inclus" }
      : { kind: "inclus", weightKg: allowance.weightKg };
  }
  return {
    kind: "payant",
    minEur: allowance.minEur,
    maxEur: allowance.maxEur,
    ...(allowance.weightKg === undefined ? {} : { weightKg: allowance.weightKg }),
    ...(allowance.atAirportEur === undefined ? {} : { atAirportEur: allowance.atAirportEur }),
  };
}

/**
 * Prix du billet pour un niveau de bagage donné, ou null si nous ne savons pas.
 * Toujours une estimation BASSE : on additionne le tarif publié le moins cher.
 */
export function priceWithBaggage(
  priceEur: number,
  airline: string | null | undefined,
  level: BaggageLevel,
): number | null {
  const supplement = baggageSupplement(airline, level);
  if (supplement.kind === "inconnu") return null;
  return supplement.kind === "inclus" ? priceEur : priceEur + supplement.minEur;
}
