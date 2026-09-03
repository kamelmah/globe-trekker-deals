/**
 * Variation du prix d'une route entre les deux derniers relevés.
 *
 * `price_observations` est en ajout seul : une ligne par route, par mois de
 * départ et par jour de relevé. Deux jours de relevé successifs donnent donc
 * deux photographies comparables de la même route.
 *
 * Fonction pure, séparée de la lecture en base pour être vérifiable sans
 * Supabase.
 */

/** Une ligne de `price_observations`, réduite à ce qui sert ici. */
export type ObservationRow = {
  /** Mois de départ, AAAA-MM. */
  month: string;
  priceEur: number;
  /** Jour du relevé, AAAA-MM-JJ. */
  observedOn: string;
};

export type PriceTrend = {
  /** Plancher du relevé le plus récent, sur les mois comparés. */
  currentEur: number;
  /** Plancher du relevé précédent, sur les mêmes mois. */
  previousEur: number;
  /** Écart en euros, négatif quand le prix baisse. */
  deltaEur: number;
  /** Écart en pourcentage du relevé précédent, négatif à la baisse. */
  deltaPct: number;
  direction: "baisse" | "hausse";
  observedOn: string;
  previousObservedOn: string;
  /** Nombre de mois de départ présents dans les deux relevés. */
  monthsCompared: number;
};

/**
 * Compare les deux derniers jours de relevé d'une route.
 *
 * SUR LES MÊMES MOIS DE DÉPART, et c'est le point délicat. Chaque passage relève
 * les douze mois à venir : la fenêtre glisse. Comparer le minimum brut d'un
 * relevé de septembre à celui d'un relevé d'août ferait apparaître une hausse
 * dès que le mois le moins cher sort de la fenêtre — une variation qui ne vient
 * pas des prix mais du calendrier. L'intersection des mois supprime cet
 * artefact.
 *
 * Null s'il n'existe qu'un jour de relevé, ou si les deux ne partagent aucun
 * mois : sans comparaison possible, rien ne s'affiche.
 */
export function computePriceTrend(rows: ObservationRow[]): PriceTrend | null {
  const parJour = new Map<string, Map<string, number>>();
  for (const row of rows) {
    if (!Number.isFinite(row.priceEur) || row.priceEur <= 0) continue;
    if (!/^\d{4}-\d{2}$/.test(row.month) || !/^\d{4}-\d{2}-\d{2}$/.test(row.observedOn)) continue;
    const jour = parJour.get(row.observedOn) ?? new Map<string, number>();
    const connu = jour.get(row.month);
    // Deux lignes pour le même mois le même jour ne devraient pas exister
    // (contrainte d'unicité) ; si elles arrivent, la plus basse fait foi.
    if (connu === undefined || row.priceEur < connu) jour.set(row.month, row.priceEur);
    parJour.set(row.observedOn, jour);
  }

  const jours = [...parJour.keys()].sort().reverse();
  const dernier = jours[0];
  const precedent = jours[1];
  if (!dernier || !precedent) return null;

  const moisDernier = parJour.get(dernier)!;
  const moisPrecedent = parJour.get(precedent)!;
  const communs = [...moisDernier.keys()].filter((m) => moisPrecedent.has(m));
  if (communs.length === 0) return null;

  const currentEur = Math.round(Math.min(...communs.map((m) => moisDernier.get(m)!)));
  const previousEur = Math.round(Math.min(...communs.map((m) => moisPrecedent.get(m)!)));
  const deltaEur = currentEur - previousEur;
  if (deltaEur === 0) return null;

  return {
    currentEur,
    previousEur,
    deltaEur,
    deltaPct: Math.round((deltaEur / previousEur) * 100),
    direction: deltaEur < 0 ? "baisse" : "hausse",
    observedOn: dernier,
    previousObservedOn: precedent,
    monthsCompared: communs.length,
  };
}
