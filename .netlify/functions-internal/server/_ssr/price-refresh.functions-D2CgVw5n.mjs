import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
import { i as REFRESH_INTERVAL_MS, n as MANUAL_REFRESH_COOLDOWN_MS } from "./price-refresh.shared-2Es62p8D.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/price-refresh.functions-D2CgVw5n.js
/** État public de la mise à jour des prix (dernière et prochaine échéance). */
var priceRefreshState_createServerFn_handler = createServerRpc({
	id: "4ab1ada93fa9eab2e277e023e04b661265bdc4774e82066a3330cf29227538f3",
	name: "priceRefreshState",
	filename: "src/lib/price-refresh.functions.ts"
}, (opts) => priceRefreshState.__executeServer(opts));
var priceRefreshState = createServerFn({ method: "GET" }).handler(priceRefreshState_createServerFn_handler, async () => {
	const { readPriceRefreshState } = await import("./price-refresh.server-ZHSo4V_j.mjs");
	return {
		state: await readPriceRefreshState(),
		intervalMs: REFRESH_INTERVAL_MS
	};
});
var refreshPricesNow_createServerFn_handler = createServerRpc({
	id: "9e36ca9ee8b5cd8f3c07b1a3a3f79c82a669c1540cf6ea2dd098fe684bf9e02a",
	name: "refreshPricesNow",
	filename: "src/lib/price-refresh.functions.ts"
}, (opts) => refreshPricesNow.__executeServer(opts));
var refreshPricesNow = createServerFn({ method: "POST" }).handler(refreshPricesNow_createServerFn_handler, async () => {
	const { readPriceRefreshState, refreshFlightPrices } = await import("./price-refresh.server-ZHSo4V_j.mjs");
	const current = await readPriceRefreshState();
	const last = current.lastAt ? Date.parse(current.lastAt) : 0;
	if (last && Date.now() - last < 6e5) return {
		state: current,
		refreshed: false,
		message: `Les prix viennent d'être mis à jour. Nouvelle actualisation possible dans ${Math.ceil((MANUAL_REFRESH_COOLDOWN_MS - (Date.now() - last)) / 6e4)} min.`
	};
	const state = await refreshFlightPrices("manuel");
	return {
		state,
		refreshed: true,
		message: state.ok ? `Prix mis à jour depuis Travelpayouts : ${state.priceCount} tarifs relevés.` : "La source de prix n'a rien renvoyé pour le moment. Réessayez dans quelques minutes."
	};
});
//#endregion
export { priceRefreshState_createServerFn_handler, refreshPricesNow_createServerFn_handler };
