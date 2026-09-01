import { n as __exportAll } from "../_runtime.mjs";
import { t as __exportAll$1 } from "./rolldown-runtime-D7D4PA-g.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ops-log.server-rlNyfr2_.js
var ops_log_server_rlNyfr2__exports = /* @__PURE__ */ __exportAll({
	n: () => ops_log_server_exports,
	t: () => logOps
});
var ops_log_server_exports = /* @__PURE__ */ __exportAll$1({
	logOps: () => logOps,
	readOpsLogs: () => readOpsLogs
});
async function admin() {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	return supabaseAdmin;
}
/** Écrit une ligne de journal sans jamais bloquer ni faire échouer l'appel métier. */
function logOps(entry) {
	const row = {
		kind: entry.kind,
		label: entry.label.slice(0, 200),
		ok: entry.ok ?? true,
		status: entry.status ?? null,
		result_count: entry.resultCount ?? null,
		duration_ms: entry.durationMs ?? null,
		message: entry.message ? entry.message.slice(0, 500) : null,
		context: entry.context ?? {}
	};
	const prefix = row.ok ? "[ops]" : "[ops:échec]";
	console.log(`${prefix} ${row.kind} · ${row.label} · status=${row.status ?? "-"} · résultats=${row.result_count ?? "-"} · ${row.duration_ms ?? "-"}ms${row.message ? ` · ${row.message}` : ""}`);
	(async () => {
		try {
			const { error } = await (await admin()).from("ops_logs").insert(row);
			if (error) console.error("Journalisation impossible", error.message);
		} catch (error) {
			console.error("Journalisation impossible", error);
		}
	})();
}
async function readOpsLogs(params) {
	let query = (await admin()).from("ops_logs").select("*").order("created_at", { ascending: false }).limit(Math.min(params.limit ?? 100, 300));
	if (params.kind && params.kind !== "tous") query = query.eq("kind", params.kind);
	const { data, error } = await query;
	if (error) throw new Error(error.message);
	const raw = data ?? [];
	let rows = raw.map((row) => ({
		...row,
		context: row.context ? JSON.stringify(row.context) : null
	}));
	if (params.onlyProblems) rows = rows.filter((row) => !row.ok || row.result_count === 0);
	const byKind = /* @__PURE__ */ new Map();
	for (const row of raw) {
		const stat = byKind.get(row.kind) ?? {
			kind: row.kind,
			total: 0,
			failures: 0,
			emptyResults: 0
		};
		stat.total += 1;
		if (!row.ok) stat.failures += 1;
		if (row.result_count === 0) stat.emptyResults += 1;
		byKind.set(row.kind, stat);
	}
	return {
		rows,
		stats: [...byKind.values()]
	};
}
//#endregion
export { ops_log_server_rlNyfr2__exports as n, logOps as t };
