//#region node_modules/.nitro/vite/services/ssr/assets/geo.server-CRol7P84.js
var DATA_BASE = "https://api.travelpayouts.com/data/fr";
var citiesPromise = null;
async function loadJson(url) {
	const res = await fetch(url, {
		headers: { Accept: "application/json" },
		signal: AbortSignal.timeout(8e3)
	});
	if (!res.ok) throw new Error(`Référentiel indisponible (${res.status}) : ${url}`);
	return await res.json();
}
async function buildCityIndex() {
	const [cities, countries] = await Promise.all([loadJson(`${DATA_BASE}/cities.json`), loadJson(`${DATA_BASE}/countries.json`).catch(() => [])]);
	const countryNames = /* @__PURE__ */ new Map();
	for (const country of countries) if (country.code && country.name) countryNames.set(country.code.toUpperCase(), country.name);
	const index = /* @__PURE__ */ new Map();
	for (const city of cities) {
		const code = city.code?.toUpperCase();
		const lat = city.coordinates?.lat;
		const lng = city.coordinates?.lon;
		if (!code || typeof lat !== "number" || typeof lng !== "number") continue;
		const countryCode = (city.country_code ?? "").toUpperCase();
		index.set(code, {
			code,
			city: city.name ?? code,
			country: countryNames.get(countryCode) ?? countryCode,
			lat,
			lng
		});
	}
	return index;
}
/** Index mémorisé pour la durée de vie de l'instance serveur. */
function getCityIndex() {
	if (!citiesPromise) citiesPromise = buildCityIndex().catch((error) => {
		citiesPromise = null;
		throw error;
	});
	return citiesPromise;
}
//#endregion
export { getCityIndex };
