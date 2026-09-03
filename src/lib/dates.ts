/**
 * Formatage des dates en français lisible — point d'entrée UNIQUE de l'app.
 *
 * Une date ISO affichée telle quelle (« 2026-11-12 ») est un format machine :
 * personne ne lit une date comme ça, et ça donne l'impression d'une donnée non
 * traitée. Tout affichage de date passe désormais par ce module.
 *
 * Deux familles, à ne pas confondre :
 *
 * - Les dates SANS heure (`2026-11-12`) : date de départ, de retour, jour d'un
 *   calendrier. Elles sont formatées en UTC, volontairement. Parsées puis
 *   formatées dans le fuseau du lecteur, elles basculeraient au 11 novembre pour
 *   tout visiteur à l'ouest de Greenwich — un décalage d'un jour sur une date de
 *   vol n'est pas un détail cosmétique.
 *
 * - Les INSTANTS (ISO complet avec heure) : heure de décollage, horodatage d'un
 *   relevé de prix. Ils sont formatés à l'heure de Paris, qui est l'heure de
 *   référence du site et de son public.
 */

const PARIS = "Europe/Paris";

/** Une date nue (AAAA-MM-JJ) devient un instant à midi UTC, jamais décalé d'un jour. */
function parseDateOnly(iso: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
  const date = new Date(`${iso}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function parseInstant(iso: string): Date | null {
  const date = new Date(iso);
  return Number.isNaN(date.getTime()) ? null : date;
}

/* -------------------------------------------------------------------------- */
/* Dates sans heure                                                            */
/* -------------------------------------------------------------------------- */

/** « jeudi 12 novembre 2026 » — forme de référence, la plus lisible. */
export function formatDateLong(iso: string | null | undefined): string {
  const date = iso ? parseDateOnly(iso) : null;
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** « 12 novembre 2026 » — sans le jour de la semaine, pour les phrases denses. */
export function formatDateMedium(iso: string | null | undefined): string {
  const date = iso ? parseDateOnly(iso) : null;
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** « jeu. 12 nov. » — pour les pastilles et boutons, où la place manque. */
export function formatDateCompact(iso: string | null | undefined): string {
  const date = iso ? parseDateOnly(iso) : null;
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

/**
 * « 2 → 9 oct. » — une plage de dates en une seule mention.
 *
 * Le mois n'est répété que s'il change (« 28 sept. → 3 oct. ») : dans une ligne
 * de rappel déjà dense, écrire deux fois le même mois n'apprend rien. Sans date
 * de fin, seule la date de début est rendue.
 */
export function formatDateRangeShort(
  debut: string | null | undefined,
  fin: string | null | undefined,
): string {
  const from = debut ? parseDateOnly(debut) : null;
  if (!from) return "";
  const to = fin ? parseDateOnly(fin) : null;
  const jourMois = new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  });
  if (!to || !fin) return jourMois.format(from);
  const memeMois = debut!.slice(0, 7) === fin.slice(0, 7);
  const gauche = memeMois
    ? new Intl.DateTimeFormat("fr-FR", { day: "numeric", timeZone: "UTC" }).format(from)
    : jourMois.format(from);
  return `${gauche} → ${jourMois.format(to)}`;
}

/** « novembre 2026 » à partir d'un mois AAAA-MM. */
export function formatMonthLong(month: string | null | undefined): string {
  if (!month || !/^\d{4}-\d{2}$/.test(month)) return "";
  const date = new Date(`${month}-01T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

/** « nov. 26 » — axe d'un graphique, où chaque pixel compte. */
export function formatMonthCompact(month: string | null | undefined): string {
  if (!month) return "";
  const date = new Date(`${month}-01T00:00:00Z`);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    month: "short",
    year: "2-digit",
    timeZone: "UTC",
  }).format(date);
}

/* -------------------------------------------------------------------------- */
/* Instants (heure de Paris)                                                   */
/* -------------------------------------------------------------------------- */

/** « jeu. 12 nov. 2026, 13:00 » — heure de décollage, dans une carte de résultat. */
export function formatDateTimeCompact(iso: string | null | undefined): string {
  const date = iso ? parseInstant(iso) : null;
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: PARIS,
  }).format(date);
}

/** « 12 novembre 2026 à 13:00 » — horodatage d'un relevé, en toutes lettres. */
export function formatDateTimeLong(iso: string | null | undefined): string {
  const date = iso ? parseInstant(iso) : null;
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: PARIS,
  }).format(date);
}

/** « 12 nov. 2026, 13:00 » — compact, sans jour de la semaine. */
export function formatDateTimeShort(iso: string | null | undefined): string {
  const date = iso ? parseInstant(iso) : null;
  if (!date) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: PARIS,
  }).format(date);
}

/**
 * « 07:15 » — heure seule d'un instant, à l'heure de Paris.
 *
 * Sert aux horaires d'une carte de résultat, où la date est portée à côté et
 * où répéter le jour à chaque ligne n'apprend rien.
 */
export function formatTimeOfDay(iso: string | null | undefined): string {
  const date = iso ? parseInstant(iso) : null;
  if (!date) return "";
  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: PARIS,
  }).format(date);
}

/**
 * Jour (AAAA-MM-JJ) auquel appartient un instant, à l'heure de Paris.
 *
 * Comparer deux de ces clés est la seule façon juste de dire « arrivée le
 * lendemain » : soustraire des horodatages fait basculer le résultat d'une
 * journée dès qu'un changement d'heure ou un fuseau s'en mêle.
 */
export function parisDayKey(iso: string | null | undefined): string {
  const date = iso ? parseInstant(iso) : null;
  if (!date) return "";
  // en-CA produit AAAA-MM-JJ, le seul format comparable tel quel.
  return new Intl.DateTimeFormat("en-CA", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: PARIS,
  }).format(date);
}
