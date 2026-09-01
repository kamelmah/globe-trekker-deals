import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, n as booleanType, o as stringType, r as enumType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-log.functions-DQ1Bw9hx.js
/**
* Lecture du journal technique, protégée par le jeton d'administration
* `ADMIN_LOGS_TOKEN` (jamais exposé au navigateur).
*/
var fetchOpsLogs_createServerFn_handler = createServerRpc({
	id: "d7f88933f6c7450eb087ea64f7864c555e78fbac8cc4335fbef9a0c83c6f04e3",
	name: "fetchOpsLogs",
	filename: "src/lib/ops-log.functions.ts"
}, (opts) => fetchOpsLogs.__executeServer(opts));
var fetchOpsLogs = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	token: stringType().trim().min(8).max(200),
	kind: enumType([
		"tous",
		"travelpayouts",
		"alerte"
	]).optional(),
	onlyProblems: booleanType().optional()
}).parse(data)).handler(fetchOpsLogs_createServerFn_handler, async ({ data }) => {
	const expected = process.env["ADMIN_LOGS_TOKEN"];
	if (!expected) return {
		ok: false,
		message: "Jeton d'administration non configuré côté serveur."
	};
	if (data.token !== expected) return {
		ok: false,
		message: "Jeton invalide."
	};
	const { readOpsLogs } = await import("./ops-log.server-rlNyfr2_.mjs").then((n) => n.n).then((n) => n.n);
	const { readPriceRefreshState } = await import("./price-refresh.server-ZHSo4V_j.mjs");
	try {
		const [{ rows, stats }, refresh] = await Promise.all([readOpsLogs({
			kind: data.kind ?? "tous",
			onlyProblems: data.onlyProblems ?? false,
			limit: 200
		}), readPriceRefreshState()]);
		return {
			ok: true,
			rows,
			stats,
			refresh
		};
	} catch (error) {
		console.error("Lecture du journal impossible", error);
		return {
			ok: false,
			message: "Lecture du journal impossible pour le moment."
		};
	}
});
//#endregion
export { fetchOpsLogs_createServerFn_handler };
