import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/published-guides.functions-BCSOdeDJ.js
/**
* Guides destinations générés depuis /destinations-proposes puis publiés
* manuellement. Ils sont stockés en base (table guide_requests) et rendus par
* les mêmes pages que les guides écrits en dur.
*/
/** Reconstruit un CityGuide depuis une ligne publiée (jamais de contenu inventé). */
function toGuide(row) {
	const draft = row.draft;
	if (!draft?.intro || !Array.isArray(draft.sections) || !draft.practical) return null;
	return {
		slug: row.slug,
		city: row.city,
		country: row.country,
		routeSlug: row.route_slug,
		origin: row.origin,
		destination: row.destination,
		originCity: draft.originCity ?? "Paris",
		title: draft.title ?? `Que faire à ${row.city}`,
		metaTitle: draft.metaTitle ?? `Que faire à ${row.city} : guide voyage | TrouveMonVol`,
		description: draft.description ?? "",
		intro: draft.intro,
		readingMinutes: draft.readingMinutes ?? 6,
		updated: draft.updated ?? (/* @__PURE__ */ new Date()).toISOString().slice(0, 10),
		practical: draft.practical,
		sections: draft.sections
	};
}
var SELECT = "slug,city,country,origin,destination,route_slug,draft";
var listPublishedGuides_createServerFn_handler = createServerRpc({
	id: "e52e0578e4b0486023efa052f1f9c5ba5ef9dabdb27c7e08da98cc13292658b9",
	name: "listPublishedGuides",
	filename: "src/lib/published-guides.functions.ts"
}, (opts) => listPublishedGuides.__executeServer(opts));
var listPublishedGuides = createServerFn({ method: "GET" }).handler(listPublishedGuides_createServerFn_handler, async () => {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data, error } = await supabaseAdmin.from("guide_requests").select(SELECT).eq("status", "publie").order("published_at", { ascending: false });
		if (error) throw error;
		return { guides: (data ?? []).map((row) => toGuide(row)).filter((guide) => guide !== null) };
	} catch (error) {
		console.error("Lecture des guides publiés impossible", error);
		return { guides: [] };
	}
});
var publishedGuide_createServerFn_handler = createServerRpc({
	id: "d1e15af7c06e089ec9dd237a4f6ac3a6a035163eb0101ffe3766bea8792a86e2",
	name: "publishedGuide",
	filename: "src/lib/published-guides.functions.ts"
}, (opts) => publishedGuide.__executeServer(opts));
var publishedGuide = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().trim().min(1).max(80) }).parse(data)).handler(publishedGuide_createServerFn_handler, async ({ data }) => {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data: row, error } = await supabaseAdmin.from("guide_requests").select(SELECT).eq("slug", data.slug).eq("status", "publie").maybeSingle();
		if (error) throw error;
		return { guide: row ? toGuide(row) : null };
	} catch (error) {
		console.error("Lecture du guide publié impossible", error);
		return { guide: null };
	}
});
//#endregion
export { listPublishedGuides_createServerFn_handler, publishedGuide_createServerFn_handler };
