import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-prices.functions-abeYVhE4.js
var iata = stringType().trim().toUpperCase().regex(/^[A-Z]{3}$/);
var guidePriceSnapshot_createServerFn_handler = createServerRpc({
	id: "a3a4d595305e50e6e730b2da38c7493dc54e18f61387f19ef93111e6df963628",
	name: "guidePriceSnapshot",
	filename: "src/lib/guide-prices.functions.ts"
}, (opts) => guidePriceSnapshot.__executeServer(opts));
var guidePriceSnapshot = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata
}).parse(data)).handler(guidePriceSnapshot_createServerFn_handler, async ({ data }) => {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data: rows, error } = await supabaseAdmin.from("price_history").select("month,lowest_price,updated_at").eq("origin", data.origin).eq("destination", data.destination).order("lowest_price", { ascending: true }).limit(24);
		if (error) throw error;
		if (!rows?.length) return {
			lowestEur: null,
			month: null,
			updatedAt: null
		};
		const cheapest = rows[0];
		const updatedAt = rows.map((row) => row.updated_at).filter((value) => Boolean(value)).sort().at(-1);
		return {
			lowestEur: Math.round(Number(cheapest.lowest_price)),
			month: cheapest.month ? cheapest.month.slice(0, 7) : null,
			updatedAt: updatedAt ?? null
		};
	} catch (error) {
		console.error("Lecture du prix relevé impossible", error);
		return {
			lowestEur: null,
			month: null,
			updatedAt: null
		};
	}
});
//#endregion
export { guidePriceSnapshot_createServerFn_handler };
