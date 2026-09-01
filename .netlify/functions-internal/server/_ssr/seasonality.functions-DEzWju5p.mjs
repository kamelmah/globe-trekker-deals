import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seasonality.functions-DEzWju5p.js
var iata = stringType().trim().toUpperCase().regex(/^[A-Z]{3}$/);
/**
* Saisonnalité d'un trajet, lue en base uniquement.
*
* Aucun appel à la source tarifaire n'est fait ici : les relevés sont produits
* hors ligne par la tâche planifiée. Une page vue par un robot ne consomme donc
* rien.
*/
var routeSeasonality_createServerFn_handler = createServerRpc({
	id: "ed6bda4a4be70c1f41d2de80ce65067c235c938d61b601b90f312e791ec887b3",
	name: "routeSeasonality",
	filename: "src/lib/seasonality.functions.ts"
}, (opts) => routeSeasonality.__executeServer(opts));
var routeSeasonality = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata
}).parse(data)).handler(routeSeasonality_createServerFn_handler, async ({ data }) => {
	const { fetchSeasonalityPoints } = await import("./seasonality.server-Ced8rKxp.mjs");
	return { points: await fetchSeasonalityPoints(data) };
});
//#endregion
export { routeSeasonality_createServerFn_handler };
