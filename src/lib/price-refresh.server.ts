import { fetchCheapestDestinations, recordDestinationHistory } from "@/lib/travelpayouts.server";
import { logOps } from "@/lib/ops-log.server";
import {
  REFRESH_DESTINATION_CODES,
  REFRESH_ORIGINS,
  nextRefreshAt,
  refreshScope,
  type PriceRefreshState,
} from "@/lib/price-refresh.shared";

/**
 * Une clé d'état par groupe de priorité.
 *
 * Les deux tâches planifiées ne couvrent pas le même périmètre et ne tournent
 * pas à la même cadence : une clé unique les ferait s'écraser l'une l'autre, et
 * la page d'état afficherait l'heure du dernier passage prioritaire comme si
 * tout le périmètre venait d'être rafraîchi.
 *
 * La clé historique est conservée pour le passage complet (et le manuel), afin
 * que l'état déjà en base reste lisible.
 */
const STATE_KEYS = {
  complet: "meta:price-refresh",
  prioritaire: "meta:price-refresh:prioritaire",
  courant: "meta:price-refresh:courant",
} as const;

type RefreshGroupe = keyof typeof STATE_KEYS;

/** L'état de mise à jour n'expire pas : on garde toujours la dernière trace réelle. */
const STATE_TTL_MS = 365 * 24 * 60 * 60 * 1000;

type StoredState = {
  lastAt: string;
  priceCount: number;
  trigger: "cron" | "manuel";
  ok: boolean;
  message: string | null;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

const EMPTY_STATE: PriceRefreshState = {
  lastAt: null,
  nextAt: null,
  priceCount: 0,
  trigger: null,
  ok: true,
  message: null,
};

/**
 * Lit la dernière mise à jour réellement effectuée (jamais de date inventée).
 *
 * Renvoie le passage le PLUS ANCIEN parmi les groupes qui en ont un. Le site
 * n'est à jour que jusqu'à son maillon le plus faible : annoncer l'heure du
 * dernier passage prioritaire laisserait croire que les liaisons de la cadence
 * normale viennent d'être relevées elles aussi.
 */
export async function readPriceRefreshState(): Promise<PriceRefreshState> {
  try {
    const db = await admin();
    const { data } = await db
      .from("price_cache")
      .select("payload")
      .in("cache_key", Object.values(STATE_KEYS));
    const etats = (data ?? [])
      .map((row) => row.payload as StoredState | null)
      .filter((p): p is StoredState => Boolean(p?.lastAt))
      .sort((a, b) => a.lastAt.localeCompare(b.lastAt));
    const payload = etats[0];
    if (!payload) return EMPTY_STATE;
    return {
      lastAt: payload.lastAt,
      nextAt: nextRefreshAt(payload.lastAt),
      priceCount: payload.priceCount ?? 0,
      trigger: payload.trigger ?? null,
      ok: payload.ok ?? true,
      message: payload.message ?? null,
    };
  } catch (error) {
    console.error("Lecture de l'état de mise à jour des prix impossible", error);
    return EMPTY_STATE;
  }
}

async function writeState(groupe: RefreshGroupe, state: StoredState): Promise<void> {
  try {
    const db = await admin();
    await db.from("price_cache").upsert(
      {
        cache_key: STATE_KEYS[groupe],
        payload: state as never,
        expires_at: new Date(Date.now() + STATE_TTL_MS).toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch (error) {
    console.error("Écriture de l'état de mise à jour des prix impossible", error);
  }
}

/**
 * Rappelle Travelpayouts pour chaque ville de départ suivie et réécrit le cache
 * de prix. Aucune estimation : si l'API ne répond pas, l'échec est journalisé.
 */
export async function refreshFlightPrices(
  trigger: "cron" | "manuel",
  options?: {
    /**
     * Restreint le passage à un groupe de priorité. Omis : tout le périmètre,
     * ce qui reste le comportement du rafraîchissement manuel.
     */
    priorite?: boolean | undefined;
  },
): Promise<PriceRefreshState> {
  const startedAt = Date.now();
  let priceCount = 0;
  const failures: string[] = [];

  const scope =
    options?.priorite === undefined
      ? REFRESH_ORIGINS.map((origin) => ({
          origin,
          destinations: [...REFRESH_DESTINATION_CODES],
        }))
      : refreshScope(options.priorite);

  for (const { origin, destinations } of scope) {
    try {
      const { prices } = await fetchCheapestDestinations({
        origin,
        destinations,
        forceRefresh: true,
      });
      priceCount += prices.length;
      // Trace les relevés pour les guides destinations (prix + date affichés
      // dans chaque fiche ville).
      await recordDestinationHistory(origin, prices);
    } catch (error) {
      const message = error instanceof Error ? error.message : "erreur inconnue";
      failures.push(`${origin}: ${message}`);
    }
  }

  const ok = failures.length < scope.length && priceCount > 0;
  const message = failures.length ? failures.join(" · ").slice(0, 400) : null;
  const lastAt = new Date().toISOString();

  const groupe: RefreshGroupe =
    options?.priorite === undefined ? "complet" : options.priorite ? "prioritaire" : "courant";

  logOps({
    kind: "travelpayouts",
    label:
      trigger === "cron"
        ? `mise à jour planifiée des prix (${groupe})`
        : "mise à jour manuelle des prix",
    ok,
    resultCount: priceCount,
    durationMs: Date.now() - startedAt,
    message,
    context: {
      groupe,
      origins: scope.map((s) => s.origin),
      destinations: scope.reduce((n, s) => n + s.destinations.length, 0),
      trigger,
    },
  });

  const state: StoredState = { lastAt, priceCount, trigger, ok, message };
  await writeState(groupe, state);

  return {
    lastAt,
    nextAt: nextRefreshAt(lastAt),
    priceCount,
    trigger,
    ok,
    message,
  };
}
