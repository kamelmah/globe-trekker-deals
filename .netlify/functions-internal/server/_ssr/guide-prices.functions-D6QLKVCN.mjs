import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/guide-prices.functions-D6QLKVCN.js
var iata = stringType().trim().toUpperCase().regex(/^[A-Z]{3}$/);
/**
* Relit le prix le plus bas déjà observé pour un trajet (table price_history,
* alimentée par les appels Travelpayouts). Aucun appel API n'est fait ici :
* les robots et les visiteurs ne consomment jamais le quota, et aucun prix
* n'est estimé — sans relevé, on renvoie null.
*/
var guidePriceSnapshot = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata
}).parse(data)).handler(createSsrRpc("a3a4d595305e50e6e730b2da38c7493dc54e18f61387f19ef93111e6df963628"));
//#endregion
export { guidePriceSnapshot as t };
