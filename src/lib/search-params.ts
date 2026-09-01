/** Helpers de validation des paramètres d'URL (sans dépendance d'adaptateur). */

function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function asNumber(value: unknown, fallback: number): number {
  const n = typeof value === "number" ? value : Number(value);
  return Number.isFinite(n) ? n : fallback;
}

const IATA = /^[A-Z]{3}$/;
const DATE = /^\d{4}-\d{2}-\d{2}$/;
const MONTH = /^\d{4}-\d{2}$/;

export function iataOr(value: unknown, fallback: string): string {
  const code = asString(value).toUpperCase();
  return IATA.test(code) ? code : fallback;
}

export function dateOr(value: unknown, fallback: string): string {
  const date = asString(value);
  return DATE.test(date) ? date : fallback;
}

export function monthOr(value: unknown, fallback: string): string {
  const month = asString(value);
  return MONTH.test(month) ? month : fallback;
}

export function numberOr(value: unknown, fallback: number): number {
  return asNumber(value, fallback);
}

/**
 * Date du jour décalée de `days`, au format AAAA-MM-JJ.
 *
 * `toISOString()` convertissait en UTC : entre minuit et 2 h du matin heure de
 * Paris, le 1er septembre local est encore le 31 août à Greenwich, et toutes
 * les dates par défaut du site reculaient d'un jour. Le défaut ne se voyait
 * qu'à ces heures-là, ce qui explique qu'il ait survécu si longtemps.
 *
 * On lit donc les composantes LOCALES, sans jamais repasser par UTC.
 */
export function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return isoLocal(d);
}

/** Mois courant, au format AAAA-MM. Même raison qu'au-dessus. */
export function currentMonth(): string {
  return isoLocal(new Date()).slice(0, 7);
}

/** Composantes locales d'une date, jamais son instant UTC. */
function isoLocal(d: Date): string {
  const deuxChiffres = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${deuxChiffres(d.getMonth() + 1)}-${deuxChiffres(d.getDate())}`;
}
