/**
 * Paramètres partagés (client + serveur) du rafraîchissement automatique des
 * prix Travelpayouts. Aucun prix n'est inventé ici : ce module ne décrit que la
 * cadence et le périmètre des appels réels à l'API.
 */

/** Destinations mises en avant sur la page d'accueil. */
export const HOME_DESTINATION_CODES = [
  "RAK",
  "LIS",
  "BCN",
  "IST",
  "ROM",
  "ATH",
  "MAD",
  "PRG",
  "BUD",
  "OPO",
  "CMN",
  "NYC",
];

/** Villes de départ rafraîchies automatiquement chaque heure. */
export const REFRESH_ORIGINS = ["PAR", "LYS", "MRS", "NCE", "TLS"];

/** Cadence du rafraîchissement automatique. */
export const REFRESH_INTERVAL_MS = 60 * 60 * 1000;

/** Délai minimum entre deux rafraîchissements manuels (anti-abus, quota API). */
export const MANUAL_REFRESH_COOLDOWN_MS = 10 * 60 * 1000;

export type PriceRefreshState = {
  /** ISO de la dernière mise à jour réellement effectuée, null si jamais. */
  lastAt: string | null;
  /** ISO de la prochaine mise à jour automatique attendue. */
  nextAt: string | null;
  /** Nombre de prix réels récupérés lors de la dernière mise à jour. */
  priceCount: number;
  /** "cron" (automatique) ou "manuel" (bouton). */
  trigger: "cron" | "manuel" | null;
  ok: boolean;
  message: string | null;
};

export function nextRefreshAt(lastAt: string | null): string | null {
  if (!lastAt) return null;
  const time = Date.parse(lastAt);
  if (Number.isNaN(time)) return null;
  return new Date(time + REFRESH_INTERVAL_MS).toISOString();
}

export function formatParisDateTime(iso: string | null): string {
  if (!iso) return "—";
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return "—";
  return new Intl.DateTimeFormat("fr-FR", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "Europe/Paris",
  }).format(new Date(time));
}
