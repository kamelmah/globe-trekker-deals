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

/**
 * Destinations couvertes par les guides conseils (/conseils/destinations/…).
 * Elles sont rafraîchies avec les mêmes appels Travelpayouts que l'accueil,
 * pour que le prix affiché dans chaque fiche ville soit un relevé réel récent.
 */
export const GUIDE_DESTINATION_CODES = [
  "LON",
  "AMS",
  "MIL",
  "BER",
  "VIE",
  "SVQ",
  "CPH",
  "TUN",
  "ALG",
  "DXB",
  "BKK",
  "TYO",
];

/** Ensemble des destinations rafraîchies à chaque passage (sans doublon). */
export const REFRESH_DESTINATION_CODES = Array.from(
  new Set([...HOME_DESTINATION_CODES, ...GUIDE_DESTINATION_CODES]),
);

/** Villes de départ rafraîchies automatiquement chaque heure. */
export const REFRESH_ORIGINS = ["PAR", "LYS", "MRS", "NCE", "TLS"];

/**
 * Une liaison suivie par le rafraîchissement, et sa priorité.
 *
 * `priorite` sépare les deux tâches planifiées : `rafraichir-prix-top` toutes
 * les trois heures sur les liaisons prioritaires, `rafraichir-prix` chaque heure
 * sur les autres. Une liaison n'est jamais traitée par les deux.
 */
export type RefreshRoute = { origin: string; destination: string; priorite: boolean };

/**
 * Le périmètre suivi, liaison par liaison.
 *
 * Sont PRIORITAIRES les destinations mises en avant sur la page d'accueil :
 * c'est la surface où un prix périmé se voit le plus, et la seule dont le
 * contenu n'est pas déjà daté à côté du montant. Les destinations qui
 * n'alimentent que les guides restent sur la cadence normale.
 *
 * C'est un point de réglage, pas une vérité : basculer une liaison d'un groupe
 * à l'autre se fait en changeant `HOME_DESTINATION_CODES`, ou en écrivant la
 * liste à la main ici si les deux notions divergent un jour.
 */
export const REFRESH_ROUTES: readonly RefreshRoute[] = REFRESH_ORIGINS.flatMap((origin) =>
  REFRESH_DESTINATION_CODES.map((destination) => ({
    origin,
    destination,
    priorite: HOME_DESTINATION_CODES.includes(destination),
  })),
);

/**
 * Le périmètre d'une tâche, regroupé par ville de départ.
 *
 * Le regroupement n'est pas cosmétique : la source tarifaire ne sait interroger
 * qu'une VILLE DE DÉPART à la fois — `destinations` ne filtre que le résultat.
 * Une requête par origine, et non par liaison, est donc le minimum d'appels
 * possible pour un périmètre donné.
 */
export function refreshScope(priorite: boolean): { origin: string; destinations: string[] }[] {
  const parOrigine = new Map<string, string[]>();
  for (const route of REFRESH_ROUTES) {
    if (route.priorite !== priorite) continue;
    const liste = parOrigine.get(route.origin) ?? [];
    liste.push(route.destination);
    parOrigine.set(route.origin, liste);
  }
  return [...parOrigine].map(([origin, destinations]) => ({ origin, destinations }));
}

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

// Le formatage des dates vit désormais dans src/lib/dates.ts : un seul module
// pour toute l app. Utiliser `formatDateTimeShort` à la place.
