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

export function todayPlus(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function currentMonth(): string {
  return new Date().toISOString().slice(0, 7);
}
