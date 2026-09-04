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

/**
 * Un palier de poids vendu par la compagnie, avec ses deux prix.
 *
 * Les compagnies ne vendent pas « un bagage en soute » mais une grille : chez
 * Transavia, 15 kg à 29,99 € en ligne et 70 € à l'aéroport. Une fourchette
 * min–max écrasait cette grille et laissait croire que le même bagage variait
 * du simple au double selon la route, alors que ce sont des poids différents.
 *
 * Un prix absent est un prix que la compagnie ne publie pas pour ce palier :
 * Transavia vend 10 kg à l'aéroport sans équivalent en ligne, easyJet publie
 * ses formats (15, 23 et 32 kg) sans leurs tarifs.
 */
export type BaggageTier = {
  weightKg: number;
  /** Tarif à l'achat en ligne, au moment de la réservation. */
  onlineEur?: number;
  /** Tarif à l'aéroport ou à l'enregistrement, toujours bien plus élevé. */
  airportEur?: number;
};

/** Ce que le tarif de base prévoit pour un type de bagage donné. */
export type BaggageAllowance =
  /** Compris dans le tarif de base, sans supplément. */
  | { kind: "inclus"; weightKg?: number; dimensionsCm?: string }
  /**
   * Payant. `minEur` est le PLANCHER : le moins cher des paliers publiés en
   * ligne, ce que `priceWithBaggage` ajoute au billet.
   *
   * `maxEur` est optionnel et ne sert plus qu'aux entrées sans grille : une
   * compagnie qui publie ses paliers porte `tiers`, et un « max » y désignerait
   * un bagage plus lourd, pas le même bagage plus cher.
   */
  | {
      kind: "payant";
      minEur: number;
      maxEur?: number;
      weightKg?: number;
      dimensionsCm?: string;
      /** Prix sur place pour la formule la moins chère (comptoir, enregistrement). */
      atAirportEur?: number;
      /** Prix à la porte d'embarquement, quand il diffère du comptoir. */
      atGateEur?: number;
      /** Grille complète des paliers publiés. */
      tiers?: BaggageTier[];
      /** Excédent de poids, par kilo au-delà du palier acheté. */
      excessPerKgEur?: number;
    }
  /**
   * Non documenté chez nous : à ne jamais présenter comme gratuit ni comme
   * payant. `tiers` peut néanmoins porter les formats VENDUS quand la compagnie
   * les publie sans leurs prix (easyJet).
   */
  | { kind: "inconnu"; tiers?: BaggageTier[] };

/** D'où vient un chiffre, et quand nous l'avons vérifié. */
export type BaggageSource = { url: string; officielle: boolean; verifiedAt: string };

export type AirlineBaggagePolicy = {
  /** Code IATA tel que renvoyé par la source tarifaire. */
  airline: string;
  name: string;
  /** Segment d'URL de sa page /bagages/<slug>. */
  slug: string;
  /** Petit sac sous le siège. */
  personalItem: BaggageAllowance;
  /** Bagage cabine à placer dans le coffre. */
  cabinBag: BaggageAllowance;
  /** Bagage en soute. */
  checkedBag: BaggageAllowance;
  /** D'où vient l'information, sauf champ disposant de sa propre source. */
  source: string;
  /**
   * Le lien de `source` est-il la page officielle de la compagnie ?
   *
   * Affiché tel quel sur /bagages/<compagnie> : un chiffre repris d'un
   * comparateur tiers n'a pas la même valeur qu'un tarif publié par le
   * transporteur, et le lecteur doit pouvoir en juger. Aujourd'hui, une seule
   * des sept sources est officielle — les six autres sont à remplacer.
   */
  sourceOfficielle: boolean;
  /** Date à laquelle nous l'avons vérifiée. */
  verifiedAt: string;
  /**
   * Sources par champ, quand elles diffèrent de `source`.
   *
   * Existe parce qu'une entrée peut être corrigée champ par champ : la cabine
   * de Volotea vient de volotea.com, sa soute est restée sur une source
   * secondaire. Prétendre que toute l'entrée est officielle serait faux, et la
   * ramener entièrement au secondaire effacerait une vérification réelle.
   */
  sources?: Partial<Record<"personalItem" | "cabinBag" | "checkedBag", BaggageSource>>;
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
    slug: "ryanair",
    name: "Ryanair",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "payant", minEur: 6, maxEur: 36 },
    checkedBag: { kind: "payant", minEur: 19, maxEur: 60, weightKg: 20, atAirportEur: 60 },
    source: "https://olyneia.com/blogs/infos/frais-bagage-ryanair-2026-comment-les-eviter",
    sourceOfficielle: false,
    verifiedAt: VERIFIED,
    note: "Seul un petit sac sous le siège est compris. Le bagage cabine dans le coffre est payant.",
  },
  {
    airline: "TO",
    slug: "transavia",
    name: "Transavia",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    /*
     * Grille officielle relevée le 2026-09-03. L'ancienne donnée — « 20 kg de
     * 31 € à 45 € en ligne, 70 € au comptoir » — était fausse sur les deux
     * chiffres : le palier 20 kg est à 36,99 € en ligne et 80 € à l'aéroport.
     *
     * `minEur` vaut 29,99 € : le moins cher des paliers vendus en ligne (15 kg).
     * Pas de `maxEur` — les 89,99 € du haut de grille achètent 50 kg, pas le
     * même bagage sur une route plus chère.
     */
    checkedBag: {
      kind: "payant",
      minEur: 29.99,
      weightKg: 15,
      atAirportEur: 60,
      excessPerKgEur: 15,
      tiers: [
        { weightKg: 10, airportEur: 60 },
        { weightKg: 15, onlineEur: 29.99, airportEur: 70 },
        { weightKg: 20, onlineEur: 36.99, airportEur: 80 },
        { weightKg: 25, onlineEur: 41.99, airportEur: 90 },
        { weightKg: 30, onlineEur: 51.99, airportEur: 100 },
        { weightKg: 40, onlineEur: 64.99, airportEur: 120 },
        { weightKg: 50, onlineEur: 89.99, airportEur: 180 },
      ],
    },
    source: "https://www.transavia.com/aide/fr-fr/bagages/bagages-en-soute/tarifs-bagages-soute",
    sourceOfficielle: true,
    verifiedAt: "2026-09-03",
    sources: {
      // La page officielle relevée ne couvre que la soute : la franchise cabine
      // reste sur la source secondaire tant que la page cabine n'est pas relevée.
      personalItem: {
        url: "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
        officielle: false,
        verifiedAt: VERIFIED,
      },
      cabinBag: {
        url: "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
        officielle: false,
        verifiedAt: VERIFIED,
      },
    },
    note: "Les tarifs soute dépendent de la destination, du vol et du moment de la réservation : les montants affichés ici sont des planchers. Le bagage cabine ne peut plus être acheté à l'aéroport ; seule une franchise soute de 10 kg à 60 € y est proposée. Excédent de poids à l'aéroport : à partir de 15 € par kilo.",
  },
  {
    airline: "V7",
    slug: "volotea",
    name: "Volotea",
    personalItem: { kind: "inclus", dimensionsCm: "40 × 30 × 20 cm" },
    /*
     * CORRIGÉ le 2026-09-03. Le barème annonçait « bagage cabine de 10 kg
     * compris », ce qui était FAUX : le tarif standard ne comprend que le sac
     * sous le siège. Le bagage cabine 10 kg passe par l'embarquement
     * prioritaire (à partir de 9 €) ou un abonnement Megavolotea, et coûte 65 €
     * par pièce et par trajet présenté à la porte sans l'un des deux.
     *
     * L'erreur ne touchait pas que les pages bagages : `priceWithBaggage`
     * alimente le prix affiché ET le tri des résultats de recherche. Une offre
     * Volotea comparée « bagage cabine » sortait au prix nu, donc devant des
     * concurrentes qui, elles, comprennent la cabine.
     */
    cabinBag: {
      kind: "payant",
      minEur: 9,
      weightKg: 10,
      dimensionsCm: "55 × 40 × 25 cm",
      atGateEur: 65,
    },
    /*
     * Grille officielle relevée le 2026-09-03. L'ancienne donnée — « 20 kg de
     * 15 € à 34 € » — était fausse : le palier 20 kg est à 14 € en ligne, et
     * le plancher réel est le palier 10 kg à 9 €.
     */
    checkedBag: {
      kind: "payant",
      minEur: 9,
      weightKg: 10,
      atAirportEur: 45,
      atGateEur: 65,
      excessPerKgEur: 12,
      tiers: [
        { weightKg: 10, onlineEur: 9, airportEur: 45 },
        { weightKg: 20, onlineEur: 14, airportEur: 75 },
        { weightKg: 25, onlineEur: 19, airportEur: 75 },
      ],
    },
    source: "https://www.volotea.com/fr/bagage",
    sourceOfficielle: true,
    verifiedAt: "2026-09-03",
    note: "Le tarif standard ne comprend que le sac sous le siège. Le bagage cabine de 10 kg exige l'embarquement prioritaire, à partir de 9 €, ou un abonnement Megavolotea ; présenté à la porte sans l'un des deux, il est facturé 65 € par pièce et par trajet. Excédent de poids : 12 € par kilo jusqu'à 32 kg. Maximum 5 bagages et 50 kg par passager ; bagage spécial 60 €, 32 kg maximum. Les prix varient selon l'origine, la destination et la saison.",
  },
  {
    airline: "AH",
    slug: "air-algerie",
    name: "Air Algérie",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "inclus", weightKg: 23 },
    source:
      "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
    sourceOfficielle: false,
    verifiedAt: VERIFIED,
    note: "Soute comprise dans le tarif de base, ce qui compense souvent un billet plus cher au départ.",
  },
  {
    airline: "TU",
    slug: "tunisair",
    name: "Tunisair",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "inclus", weightKg: 23 },
    source: "https://www.tunisair.com/en/guide-utilisateur/prepare-your-luggage",
    sourceOfficielle: true,
    verifiedAt: VERIFIED,
    note: "23 kg sur la plupart des lignes ; jusqu'à 32 kg selon la destination et la cabine.",
  },
  {
    airline: "BJ",
    slug: "nouvelair",
    name: "Nouvelair",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "inclus", weightKg: 10 },
    checkedBag: { kind: "inclus", weightKg: 25 },
    source: "https://www.marhba.com/voyages/tout-savoir-sur-la-franchise-bagage-de-nouvelair",
    sourceOfficielle: false,
    verifiedAt: VERIFIED,
    note: "Offre Pack Easy : 10 kg en cabine et 25 kg en soute compris.",
  },
  {
    airline: "U2",
    slug: "easyjet",
    name: "easyJet",
    personalItem: { kind: "inclus" },
    cabinBag: { kind: "payant", minEur: 6, maxEur: 33 },
    /*
     * La page officielle relevée le 2026-09-03 donne les FORMATS vendus — 15,
     * 23 et 32 kg — sans leurs tarifs. Le prix reste donc « inconnu » : les
     * poids sont affichés, aucun montant n'est deviné. C'est aussi ce qui
     * corrige l'ancienne mention « tranches de 3 kg », qui venait d'une source
     * secondaire et ne figure pas sur la page de la compagnie.
     */
    checkedBag: {
      kind: "inconnu",
      tiers: [{ weightKg: 15 }, { weightKg: 23 }, { weightKg: 32 }],
    },
    source: "https://www.easyjet.com/fr/aide/bagage/bagage-en-soute",
    sourceOfficielle: true,
    verifiedAt: "2026-09-03",
    sources: {
      // La page officielle relevée ne couvre que la soute.
      personalItem: {
        url: "https://easyscape.eu/blog/regles-bagages-compagnies-low-cost-2026",
        officielle: false,
        verifiedAt: VERIFIED,
      },
      cabinBag: {
        url: "https://easyscape.eu/blog/regles-bagages-compagnies-low-cost-2026",
        officielle: false,
        verifiedAt: VERIFIED,
      },
    },
    note: "La soute est vendue en trois formats : 15 kg, 23 kg (standard) et 32 kg. Leurs tarifs ne figurent pas sur la page relevée : nous ne les affichons pas plutôt que de les estimer.",
  },
];

/**
 * Un tarif bagage tel que la compagnie l'affiche.
 *
 * Les centimes sont conservés quand ils existent : Transavia publie 29,99 €, et
 * l'arrondir à 30 € sur une page qui prétend citer un tarif officiel serait
 * faux. Les montants ronds restent sans décimales.
 */
export function formatBaggageFee(amountEur: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: Number.isInteger(amountEur) ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amountEur);
}

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
  /** Supplément à partir de `minEur`. `maxEur` absent = plafond non publié. */
  | { kind: "payant"; minEur: number; maxEur?: number; weightKg?: number; atAirportEur?: number }
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
    ...(allowance.maxEur === undefined ? {} : { maxEur: allowance.maxEur }),
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
