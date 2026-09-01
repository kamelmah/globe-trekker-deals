import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/places.functions-C0GOGXUu.js
var ENDPOINT = "https://autocomplete.travelpayouts.com/places2";
var CACHE_TTL_MS = 216e5;
var CACHE_MAX = 500;
var cache = /* @__PURE__ */ new Map();
function readCache(key) {
	const hit = cache.get(key);
	if (!hit) return null;
	if (Date.now() - hit.at > CACHE_TTL_MS) {
		cache.delete(key);
		return null;
	}
	cache.delete(key);
	cache.set(key, hit);
	return hit.places;
}
function writeCache(key, places) {
	cache.set(key, {
		at: Date.now(),
		places
	});
	while (cache.size > CACHE_MAX) {
		const oldest = cache.keys().next().value;
		if (oldest === void 0) break;
		cache.delete(oldest);
	}
}
function normalize(raw) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const item of raw) {
		const code = typeof item.code === "string" ? item.code.toUpperCase() : "";
		if (code.length !== 3 || seen.has(code)) continue;
		const type = item.type === "airport" ? "airport" : "city";
		const name = (item.name ?? "").trim();
		if (!name) continue;
		seen.add(code);
		out.push({
			code,
			name,
			city: (item.city_name ?? (type === "city" ? name : "")).trim(),
			country: (item.country_name ?? "").trim(),
			type
		});
	}
	return out;
}
var PlacesError = class extends Error {};
/** Recherche des villes et aéroports du monde entier pour un terme saisi. */
async function fetchPlaces(term) {
	const key = term.trim().toLowerCase();
	if (key.length < 2) return [];
	const cached = readCache(key);
	if (cached) return cached;
	const url = `${ENDPOINT}?term=${encodeURIComponent(key)}&locale=fr&types[]=city&types[]=airport`;
	let response;
	try {
		response = await fetch(url, { headers: { Accept: "application/json" } });
	} catch (error) {
		console.error("Autocomplete Travelpayouts injoignable", error);
		throw new PlacesError("Impossible de contacter le service de villes. Réessayez dans un instant.");
	}
	if (!response.ok) throw new PlacesError("Le service de villes est momentanément indisponible.");
	const body = await response.json();
	if (!Array.isArray(body)) return [];
	const places = normalize(body).slice(0, 12);
	writeCache(key, places);
	return places;
}
/**
* Résout un texte libre (« Marrakech », « rak ») en un lieu unique.
* Retourne null si aucune correspondance crédible n'est trouvée.
*/
async function resolveBestPlace(term) {
	const cleaned = term.trim();
	if (cleaned.length < 2) return null;
	const places = await fetchPlaces(cleaned);
	if (places.length === 0) return null;
	const upper = cleaned.toUpperCase();
	const lower = cleaned.toLowerCase();
	const byCode = places.find((p) => p.code === upper);
	if (byCode) return byCode;
	const exactName = places.find((p) => p.name.toLowerCase() === lower || p.city.toLowerCase() === lower);
	if (exactName) return exactName;
	const startsWith = places.find((p) => p.name.toLowerCase().startsWith(lower) || p.city.toLowerCase().startsWith(lower));
	if (startsWith) return startsWith;
	return places.find((p) => p.type === "city") ?? places[0] ?? null;
}
var searchPlaces_createServerFn_handler = createServerRpc({
	id: "86a553360b1d2d5d6c994785348fb63757e6915e3db78e09d21670073a7e667b",
	name: "searchPlaces",
	filename: "src/lib/places.functions.ts"
}, (opts) => searchPlaces.__executeServer(opts));
var searchPlaces = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ term: stringType().trim().max(80) }).parse(data)).handler(searchPlaces_createServerFn_handler, async ({ data }) => {
	if (data.term.length < 2) return {
		places: [],
		error: null
	};
	try {
		return {
			places: await fetchPlaces(data.term),
			error: null
		};
	} catch (error) {
		const message = error instanceof PlacesError ? error.message : "Une erreur est survenue lors de la recherche de villes.";
		if (!(error instanceof PlacesError)) console.error("Erreur autocomplete", error);
		return {
			places: [],
			error: message
		};
	}
});
var resolvePlace_createServerFn_handler = createServerRpc({
	id: "c342fb1b797e5992fd0e8420175833624eb4de00876d487df985a4e006a759bc",
	name: "resolvePlace",
	filename: "src/lib/places.functions.ts"
}, (opts) => resolvePlace.__executeServer(opts));
var resolvePlace = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ term: stringType().trim().max(80) }).parse(data)).handler(resolvePlace_createServerFn_handler, async ({ data }) => {
	try {
		return {
			place: await resolveBestPlace(data.term),
			error: null
		};
	} catch (error) {
		const message = error instanceof PlacesError ? error.message : "Une erreur est survenue lors de la recherche de villes.";
		if (!(error instanceof PlacesError)) console.error("Erreur résolution ville", error);
		return {
			place: null,
			error: message
		};
	}
});
//#endregion
export { resolvePlace_createServerFn_handler, searchPlaces_createServerFn_handler };
