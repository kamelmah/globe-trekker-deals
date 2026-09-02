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
 * Paramètre de campagne (utm_source, utm_content) recopié depuis l'URL.
 *
 * Le contenu vient de l'extérieur — n'importe qui peut ouvrir une page de
 * campagne avec n'importe quel paramètre — et finit dans une colonne relue plus
 * tard à la main ou dans un export. On le réduit donc à ce qu'une campagne a
 * réellement besoin d'écrire : lettres, chiffres, tiret, souligné, point, 64
 * caractères au plus. Le reste est retiré plutôt que refusé, pour qu'une URL
 * mal formée laisse quand même créer l'alerte.
 */
export function utmOr(value: unknown, fallback: string): string {
  const propre = asString(value)
    .toLowerCase()
    .replace(/[^a-z0-9_.-]/g, "")
    .slice(0, 64);
  return propre || fallback;
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

/* -------------------------------------------------------------------------- */
/* Dernière recherche de vol                                                   */
/* -------------------------------------------------------------------------- */

/**
 * Dernière recherche de vol du visiteur, conservée dans SON navigateur.
 *
 * Sert à proposer, sur la page hébergement, la ville et les dates du vol qu'il
 * vient de chercher plutôt que de lui faire tout ressaisir. Rien n'est envoyé
 * au serveur : la donnée ne quitte jamais l'appareil, et elle ne contient que
 * des codes d'aéroport, des dates et un nombre de voyageurs — jamais d'adresse
 * e-mail ni d'identifiant.
 *
 * Volontairement sans consentement préalable : c'est un stockage strictement
 * fonctionnel, déclaré comme tel sur /cookies.
 */
export type DerniereRecherche = {
  origin: string;
  destination: string;
  depart: string;
  retour: string;
  adultes: number;
  enfants: number;
  bebes: number;
  /** Horodatage ISO de la recherche, pour ne pas ressortir un séjour oublié. */
  at: string;
};

const DERNIERE_RECHERCHE_KEY = "tmv-derniere-recherche";

/** Au-delà, la « dernière recherche » n'est plus une intention de voyage. */
const PEREMPTION_MS = 30 * 24 * 60 * 60 * 1000;

export function saveLastFlightSearch(
  search: Omit<DerniereRecherche, "at"> & { at?: string },
): void {
  if (typeof window === "undefined") return;
  // Une recherche sans destination ne dit pas où dormir : elle n'est pas gardée.
  if (!IATA.test(search.destination)) return;
  try {
    const payload: DerniereRecherche = {
      origin: search.origin,
      destination: search.destination,
      depart: search.depart,
      retour: search.retour,
      adultes: search.adultes,
      enfants: search.enfants,
      bebes: search.bebes,
      at: search.at ?? new Date().toISOString(),
    };
    window.localStorage.setItem(DERNIERE_RECHERCHE_KEY, JSON.stringify(payload));
  } catch {
    // Navigation privée, quota plein, stockage refusé : la fonctionnalité
    // disparaît, la page continue.
  }
}

export function readLastFlightSearch(): DerniereRecherche | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(DERNIERE_RECHERCHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<DerniereRecherche> | null;
    const destination = iataOr(parsed?.destination, "");
    const at = typeof parsed?.at === "string" ? parsed.at : "";
    if (!destination || !at) return null;
    const age = Date.now() - Date.parse(at);
    if (!Number.isFinite(age) || age < 0 || age > PEREMPTION_MS) return null;
    return {
      origin: iataOr(parsed?.origin, ""),
      destination,
      depart: dateOr(parsed?.depart, ""),
      retour: dateOr(parsed?.retour, ""),
      adultes: Math.min(9, Math.max(1, Math.round(numberOr(parsed?.adultes, 1)))),
      enfants: Math.min(8, Math.max(0, Math.round(numberOr(parsed?.enfants, 0)))),
      bebes: Math.min(8, Math.max(0, Math.round(numberOr(parsed?.bebes, 0)))),
      at,
    };
  } catch {
    return null;
  }
}
