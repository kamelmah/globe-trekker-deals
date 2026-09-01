import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/published-guides.functions-BYp3PJI5.js
/**
* Guides destinations générés depuis /destinations-proposes puis publiés
* manuellement. Ils sont stockés en base (table guide_requests) et rendus par
* les mêmes pages que les guides écrits en dur.
*/
/** Reconstruit un CityGuide depuis une ligne publiée (jamais de contenu inventé). */
var listPublishedGuides = createServerFn({ method: "GET" }).handler(createSsrRpc("e52e0578e4b0486023efa052f1f9c5ba5ef9dabdb27c7e08da98cc13292658b9"));
var publishedGuide = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().trim().min(1).max(80) }).parse(data)).handler(createSsrRpc("d1e15af7c06e089ec9dd237a4f6ac3a6a035163eb0101ffe3766bea8792a86e2"));
//#endregion
export { publishedGuide as n, listPublishedGuides as t };
