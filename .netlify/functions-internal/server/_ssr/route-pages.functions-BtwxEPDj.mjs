import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/route-pages.functions-BtwxEPDj.js
var dynamicRoutePage_createServerFn_handler = createServerRpc({
	id: "428ea841da75328ded9e913fe46845d98d60742035fc3c0dab5fe607fc0f9b6c",
	name: "dynamicRoutePage",
	filename: "src/lib/route-pages.functions.ts"
}, (opts) => dynamicRoutePage.__executeServer(opts));
var dynamicRoutePage = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().trim().min(3).max(80) }).parse(data)).handler(dynamicRoutePage_createServerFn_handler, async ({ data }) => {
	const { buildDynamicRoutePage } = await import("./route-pages.server-BaHoOUQB.mjs");
	return { route: await buildDynamicRoutePage(data.slug) };
});
var relatedRoutePages_createServerFn_handler = createServerRpc({
	id: "2495021265795268fc89eef4f68ccc69d9d32b0c872d73a91056b6709d3d6009",
	name: "relatedRoutePages",
	filename: "src/lib/route-pages.functions.ts"
}, (opts) => relatedRoutePages.__executeServer(opts));
var relatedRoutePages = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: stringType().trim().min(3).max(3),
	originCity: stringType().trim().min(1).max(80),
	exclude: stringType().trim().max(3).optional(),
	limit: numberType().int().min(1).max(24).optional()
}).parse(data)).handler(relatedRoutePages_createServerFn_handler, async ({ data }) => {
	const { listRelatedRoutes } = await import("./route-pages.server-BaHoOUQB.mjs");
	return { related: await listRelatedRoutes(data) };
});
//#endregion
export { dynamicRoutePage_createServerFn_handler, relatedRoutePages_createServerFn_handler };
