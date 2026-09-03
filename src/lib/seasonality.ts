import { formatMonthLong } from "@/lib/dates";

/** Un mois de départ et le prix le plus bas qui y a été relevé. */
export type SeasonPoint = {
  /** Mois de départ, au format AAAA-MM. */
  month: string;
  priceEur: number;
  /** Date du relevé. Absente quand elle n'a pas été enregistrée. */
  observedAt?: string;
};

export type Seasonality = {
  points: SeasonPoint[];
  cheapest: SeasonPoint;
  dearest: SeasonPoint;
  /** Autres mois au même prix que le moins cher, s'il y en a. */
  alsoCheapest: SeasonPoint[];
  medianEur: number;
  /** Écart entre le pire et le meilleur mois, en % du meilleur. */
  spreadPct: number;
  /** Date du relevé le plus récent, pour dater la section. */
  latestObservedAt: string | null;
  sentence: string;
};

/**
 * En dessous de trois mois relevés, on ne peut rien dire d'une saisonnalité :
 * deux points font une droite, pas une saison. Même seuil que le graphique,
 * puisque c'est désormais la même section.
 */
export const SEASON_MINIMUM_POINTS = 3;

/**
 * Deux mois suffisent en revanche à désigner le moins cher des deux.
 *
 * Ce n'est pas une saisonnalité, c'est une comparaison — d'où un seuil plus bas
 * que `SEASON_MINIMUM_POINTS` pour la ligne affichée sous le titre.
 */
export const CHEAPEST_MONTH_MINIMUM_POINTS = 2;

/**
 * Le socle chiffré des relevés d'une route : mois extrêmes, médiane, écart.
 *
 * Extrait de `computeSeasonality` pour que la ligne « le moins cher en … »
 * affichée sous le titre reparte du MÊME calcul, au lieu d'en refaire un second
 * qui divergerait au premier changement.
 */
export type SeasonExtremes = {
  points: SeasonPoint[];
  cheapest: SeasonPoint;
  dearest: SeasonPoint;
  alsoCheapest: SeasonPoint[];
  medianEur: number;
  spreadPct: number;
  latestObservedAt: string | null;
};

export function seasonExtremes(
  points: SeasonPoint[],
  minimumPoints: number = SEASON_MINIMUM_POINTS,
): SeasonExtremes | null {
  const valid = points
    .filter((p) => Number.isFinite(p.priceEur) && p.priceEur > 0 && /^\d{4}-\d{2}$/.test(p.month))
    .sort((a, b) => a.month.localeCompare(b.month));
  if (valid.length < minimumPoints) return null;

  const prixBas = Math.min(...valid.map((p) => p.priceEur));
  const prixHaut = Math.max(...valid.map((p) => p.priceEur));
  const auPrixBas = valid.filter((p) => p.priceEur === prixBas);
  const cheapest = auPrixBas[0];
  const dearest = valid.find((p) => p.priceEur === prixHaut);
  if (!cheapest || !dearest) return null;

  return {
    points: valid,
    cheapest,
    dearest,
    alsoCheapest: auPrixBas.slice(1, 3),
    medianEur: median(valid.map((p) => p.priceEur)),
    // Écart exprimé en % du mois le MOINS cher : « décembre coûte 233 % de plus
    // qu'octobre » quand on passe de 40 € à 133 €.
    spreadPct: Math.round(((prixHaut - prixBas) / prixBas) * 100),
    latestObservedAt:
      valid
        .map((p) => p.observedAt)
        .filter((v): v is string => Boolean(v))
        .sort()
        .at(-1) ?? null,
  };
}

function median(values: number[]): number {
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  const value =
    sorted.length % 2 === 0
      ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2
      : (sorted[middle] ?? 0);
  return Math.round(value);
}

const euros = (value: number) => `${Math.round(value)} €`;

/** « janvier », « août » — jamais un mois au format machine. */
function monthName(month: string): string {
  return formatMonthLong(month) || month;
}

/**
 * Liste à la française : « janvier et février », « janvier, février et mars ».
 */
function enumerate(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} et ${parts[parts.length - 1]}`;
}

/**
 * Phrase de saisonnalité, construite à partir des chiffres relevés.
 *
 * Elle remplace la constante « Hors vacances scolaires et week-ends de départs »,
 * qui était identique sur les 89 pages générées et constituait à elle seule le
 * plus gros signal de duplication du site.
 *
 * Sa forme suit l'ampleur réelle de l'écart, pas un gabarit unique : sur un
 * trajet où le mois de départ ne change presque rien, l'annoncer comme un levier
 * serait faux. Trois formes, choisies par la donnée.
 */
function buildSentence(params: {
  originCity: string;
  destinationCity: string;
  cheapest: SeasonPoint;
  alsoCheapest: SeasonPoint[];
  dearest: SeasonPoint;
  medianEur: number;
  spreadPct: number;
  points: SeasonPoint[];
}): string {
  const { cheapest, alsoCheapest, dearest, medianEur, spreadPct, points } = params;
  const moisBas = enumerate([cheapest, ...alsoCheapest].map((p) => monthName(p.month)));
  const moisHaut = monthName(dearest.month);
  const couverture = `${points.length} mois de départ relevés`;

  if (spreadPct < 15) {
    return (
      `Sur ce trajet, le mois de départ ne change pas grand-chose : ${spreadPct} % séparent ` +
      `${moisBas} (${euros(cheapest.priceEur)}) de ${moisHaut} (${euros(dearest.priceEur)}). ` +
      `Le prix médian s'établit à ${euros(medianEur)} sur ${couverture}. ` +
      `Mieux vaut donc arbitrer sur les dates précises que sur la saison.`
    );
  }

  if (spreadPct >= 40) {
    return (
      `Le mois de départ pèse lourd ici : ${euros(cheapest.priceEur)} en ${moisBas}, ` +
      `contre ${euros(dearest.priceEur)} en ${moisHaut}, soit ${spreadPct} % d'écart. ` +
      `Le prix médian est de ${euros(medianEur)} sur ${couverture}. ` +
      `Décaler le voyage d'un mois vaut souvent plus que n'importe quelle astuce de réservation.`
    );
  }

  return (
    `Partir en ${moisBas} plutôt qu'en ${moisHaut} fait passer le billet de ` +
    `${euros(cheapest.priceEur)} à ${euros(dearest.priceEur)}, soit ${spreadPct} % d'écart. ` +
    `Le prix médian relevé est de ${euros(medianEur)} sur ${couverture}.`
  );
}

/**
 * Saisonnalité d'un trajet, ou null si les relevés sont trop peu nombreux pour
 * qu'elle veuille dire quelque chose. Aucune valeur n'est extrapolée : les mois
 * sans relevé restent absents plutôt que comblés.
 */
export function computeSeasonality(
  points: SeasonPoint[],
  route: { originCity: string; destinationCity: string },
): Seasonality | null {
  const socle = seasonExtremes(points, SEASON_MINIMUM_POINTS);
  if (!socle) return null;

  return {
    ...socle,
    sentence: buildSentence({
      ...route,
      cheapest: socle.cheapest,
      alsoCheapest: socle.alsoCheapest,
      dearest: socle.dearest,
      medianEur: socle.medianEur,
      spreadPct: socle.spreadPct,
      points: socle.points,
    }),
  };
}

/**
 * À partir de quel écart le mois le plus cher mérite d'être cité.
 *
 * En dessous, l'écart n'est pas un levier de décision et l'annoncer donnerait à
 * la ligne un poids qu'elle n'a pas.
 */
export const CHEAPEST_MONTH_SPREAD_THRESHOLD = 30;

/**
 * Une ligne, sous le titre : le mois le moins cher relevé et son montant.
 *
 * L'écart n'est cité qu'au-delà de 30 %, et il est formulé « X % de plus » sur
 * le mois cher, pas « X % de moins » sur le mois bon marché : un prix ne peut
 * pas baisser de plus de 100 %, et passer de 40 € à 133 € fait bien +233 % dans
 * un sens, mais −70 % dans l'autre. Les deux chiffres sont vrais, un seul
 * s'écrit avec « de plus ».
 *
 * Null quand moins de deux mois sont relevés : sans comparaison possible, « le
 * moins cher » ne veut rien dire.
 */
export function cheapestMonthLine(points: SeasonPoint[]): string | null {
  const socle = seasonExtremes(points, CHEAPEST_MONTH_MINIMUM_POINTS);
  if (!socle) return null;

  const base = `Le moins cher en ${monthName(socle.cheapest.month)}, à ${euros(socle.cheapest.priceEur)}`;
  if (socle.spreadPct <= CHEAPEST_MONTH_SPREAD_THRESHOLD) return `${base}.`;
  return `${base} — ${monthName(socle.dearest.month)} coûte ${socle.spreadPct} % de plus.`;
}
