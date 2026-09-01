import { t as logOps } from "./ops-log.server-rlNyfr2_.mjs";
import { fetchCheapestDestinations, recordDestinationHistory } from "./travelpayouts.server-Dj_hGfma.mjs";
import { a as REFRESH_ORIGINS, o as nextRefreshAt, r as REFRESH_DESTINATION_CODES } from "./price-refresh.shared-2Es62p8D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/price-refresh.server-ZHSo4V_j.js
var STATE_KEY = "meta:price-refresh";
/** L'état de mise à jour n'expire pas : on garde toujours la dernière trace réelle. */
var STATE_TTL_MS = 31536e6;
async function admin() {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	return supabaseAdmin;
}
var EMPTY_STATE = {
	lastAt: null,
	nextAt: null,
	priceCount: 0,
	trigger: null,
	ok: true,
	message: null
};
/** Lit la dernière mise à jour réellement effectuée (jamais de date inventée). */
async function readPriceRefreshState() {
	try {
		const { data } = await (await admin()).from("price_cache").select("payload").eq("cache_key", STATE_KEY).maybeSingle();
		const payload = data?.payload;
		if (!payload?.lastAt) return EMPTY_STATE;
		return {
			lastAt: payload.lastAt,
			nextAt: nextRefreshAt(payload.lastAt),
			priceCount: payload.priceCount ?? 0,
			trigger: payload.trigger ?? null,
			ok: payload.ok ?? true,
			message: payload.message ?? null
		};
	} catch (error) {
		console.error("Lecture de l'état de mise à jour des prix impossible", error);
		return EMPTY_STATE;
	}
}
async function writeState(state) {
	try {
		await (await admin()).from("price_cache").upsert({
			cache_key: STATE_KEY,
			payload: state,
			expires_at: new Date(Date.now() + STATE_TTL_MS).toISOString()
		}, { onConflict: "cache_key" });
	} catch (error) {
		console.error("Écriture de l'état de mise à jour des prix impossible", error);
	}
}
/**
* Rappelle Travelpayouts pour chaque ville de départ suivie et réécrit le cache
* de prix. Aucune estimation : si l'API ne répond pas, l'échec est journalisé.
*/
async function refreshFlightPrices(trigger) {
	const startedAt = Date.now();
	let priceCount = 0;
	const failures = [];
	for (const origin of REFRESH_ORIGINS) try {
		const { prices } = await fetchCheapestDestinations({
			origin,
			destinations: REFRESH_DESTINATION_CODES,
			forceRefresh: true
		});
		priceCount += prices.length;
		await recordDestinationHistory(origin, prices);
	} catch (error) {
		const message = error instanceof Error ? error.message : "erreur inconnue";
		failures.push(`${origin}: ${message}`);
	}
	const ok = failures.length < REFRESH_ORIGINS.length && priceCount > 0;
	const message = failures.length ? failures.join(" · ").slice(0, 400) : null;
	const lastAt = (/* @__PURE__ */ new Date()).toISOString();
	logOps({
		kind: "travelpayouts",
		label: trigger === "cron" ? "mise à jour horaire des prix" : "mise à jour manuelle des prix",
		ok,
		resultCount: priceCount,
		durationMs: Date.now() - startedAt,
		message,
		context: {
			origins: REFRESH_ORIGINS,
			destinations: REFRESH_DESTINATION_CODES.length,
			trigger
		}
	});
	await writeState({
		lastAt,
		priceCount,
		trigger,
		ok,
		message
	});
	return {
		lastAt,
		nextAt: nextRefreshAt(lastAt),
		priceCount,
		trigger,
		ok,
		message
	};
}
//#endregion
export { readPriceRefreshState, refreshFlightPrices };
