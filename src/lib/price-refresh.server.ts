import {
  fetchCheapestDestinations,
  recordDestinationHistory,
} from "@/lib/travelpayouts.server";
import { logOps } from "@/lib/ops-log.server";
import {
  REFRESH_DESTINATION_CODES,
  REFRESH_ORIGINS,
  nextRefreshAt,
  type PriceRefreshState,
} from "@/lib/price-refresh.shared";

const STATE_KEY = "meta:price-refresh";
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

/** Lit la dernière mise à jour réellement effectuée (jamais de date inventée). */
export async function readPriceRefreshState(): Promise<PriceRefreshState> {
  try {
    const db = await admin();
    const { data } = await db
      .from("price_cache")
      .select("payload")
      .eq("cache_key", STATE_KEY)
      .maybeSingle();
    const payload = data?.payload as StoredState | null;
    if (!payload?.lastAt) return EMPTY_STATE;
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

async function writeState(state: StoredState): Promise<void> {
  try {
    const db = await admin();
    await db.from("price_cache").upsert(
      {
        cache_key: STATE_KEY,
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
): Promise<PriceRefreshState> {
  const startedAt = Date.now();
  let priceCount = 0;
  const failures: string[] = [];

  for (const origin of REFRESH_ORIGINS) {
    try {
      const { prices } = await fetchCheapestDestinations({
        origin,
        destinations: REFRESH_DESTINATION_CODES,
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

  const ok = failures.length < REFRESH_ORIGINS.length && priceCount > 0;
  const message = failures.length ? failures.join(" · ").slice(0, 400) : null;
  const lastAt = new Date().toISOString();

  logOps({
    kind: "travelpayouts",
    label:
      trigger === "cron"
        ? "mise à jour horaire des prix"
        : "mise à jour manuelle des prix",
    ok,
    resultCount: priceCount,
    durationMs: Date.now() - startedAt,
    message,
    context: { origins: REFRESH_ORIGINS, destinations: REFRESH_DESTINATION_CODES.length, trigger },
  });

  const state: StoredState = { lastAt, priceCount, trigger, ok, message };
  await writeState(state);

  return {
    lastAt,
    nextAt: nextRefreshAt(lastAt),
    priceCount,
    trigger,
    ok,
    message,
  };
}
