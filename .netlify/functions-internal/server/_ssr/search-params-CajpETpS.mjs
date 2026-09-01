//#region node_modules/.nitro/vite/services/ssr/assets/search-params-CajpETpS.js
/** Helpers de validation des paramètres d'URL (sans dépendance d'adaptateur). */
function asString(value, fallback = "") {
	return typeof value === "string" ? value : fallback;
}
function asNumber(value, fallback) {
	const n = typeof value === "number" ? value : Number(value);
	return Number.isFinite(n) ? n : fallback;
}
var IATA = /^[A-Z]{3}$/;
var DATE = /^\d{4}-\d{2}-\d{2}$/;
var MONTH = /^\d{4}-\d{2}$/;
function iataOr(value, fallback) {
	const code = asString(value).toUpperCase();
	return IATA.test(code) ? code : fallback;
}
function dateOr(value, fallback) {
	const date = asString(value);
	return DATE.test(date) ? date : fallback;
}
function monthOr(value, fallback) {
	const month = asString(value);
	return MONTH.test(month) ? month : fallback;
}
function numberOr(value, fallback) {
	return asNumber(value, fallback);
}
function todayPlus(days) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + days);
	return d.toISOString().slice(0, 10);
}
//#endregion
export { todayPlus as a, numberOr as i, iataOr as n, monthOr as r, dateOr as t };
