/** Durées de séjour proposées en raccourci sur le formulaire de recherche. */
export type TripDurationPreset = {
  /** Nombre de nuits entre l'aller et le retour. 0 = dates précises manuelles. */
  days: number;
  label: string;
};

export const TRIP_DURATIONS: TripDurationPreset[] = [
  { days: 0, label: "Dates précises" },
  { days: 2, label: "Weekend" },
  { days: 4, label: "3-4 jours" },
  { days: 7, label: "1 semaine" },
  { days: 14, label: "2 semaines" },
];

export function tripDurationLabel(days: number): string {
  return TRIP_DURATIONS.find((d) => d.days === days)?.label ?? "Dates précises";
}

/** Ajoute un nombre de jours à une date ISO (YYYY-MM-DD). */
export function addDaysIso(date: string, days: number): string {
  if (!date) return "";
  const d = new Date(`${date}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

/** Nombre de nuits entre deux dates ISO, ou 0 si l'une est absente. */
export function nightsBetween(depart: string, retour: string): number {
  if (!depart || !retour) return 0;
  const a = Date.parse(`${depart}T00:00:00Z`);
  const b = Date.parse(`${retour}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  return Math.max(0, Math.round((b - a) / 86400000));
}
