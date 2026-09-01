//#region node_modules/.nitro/vite/services/ssr/assets/trip-duration-Dr4Tuig8.js
var CURRENCIES = [
	{
		code: "EUR",
		label: "Euro",
		symbol: "€"
	},
	{
		code: "USD",
		label: "Dollar US",
		symbol: "$"
	},
	{
		code: "GBP",
		label: "Livre sterling",
		symbol: "£"
	},
	{
		code: "CHF",
		label: "Franc suisse",
		symbol: "CHF"
	},
	{
		code: "CAD",
		label: "Dollar canadien",
		symbol: "C$"
	}
];
/** Taux indicatifs par rapport à l'euro, utilisés pour l'affichage uniquement. */
var RATES_FROM_EUR = {
	EUR: 1,
	USD: 1.09,
	GBP: .85,
	CHF: .95,
	CAD: 1.47
};
function convertFromEur(amountEur, currency) {
	return amountEur * RATES_FROM_EUR[currency];
}
function formatPrice(amountEur, currency = "EUR") {
	const value = convertFromEur(amountEur, currency);
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(value);
}
function isCurrencyCode(value) {
	return CURRENCIES.some((c) => c.code === value);
}
/**
* Formate un montant déjà exprimé dans la devise donnée (renvoyé tel quel par
* l'API Travelpayouts via son paramètre `currency`), sans aucune conversion.
*/
function formatAmount(amount, currency = "EUR") {
	return new Intl.NumberFormat("fr-FR", {
		style: "currency",
		currency,
		maximumFractionDigits: 0
	}).format(amount);
}
var TRIP_DURATIONS = [
	{
		days: 0,
		label: "Dates précises"
	},
	{
		days: 2,
		label: "Weekend"
	},
	{
		days: 4,
		label: "3-4 jours"
	},
	{
		days: 7,
		label: "1 semaine"
	},
	{
		days: 14,
		label: "2 semaines"
	}
];
function tripDurationLabel(days) {
	return TRIP_DURATIONS.find((d) => d.days === days)?.label ?? "Dates précises";
}
/** Ajoute un nombre de jours à une date ISO (YYYY-MM-DD). */
function addDaysIso(date, days) {
	if (!date) return "";
	const d = /* @__PURE__ */ new Date(`${date}T00:00:00Z`);
	d.setUTCDate(d.getUTCDate() + days);
	return d.toISOString().slice(0, 10);
}
/** Nombre de nuits entre deux dates ISO, ou 0 si l'une est absente. */
function nightsBetween(depart, retour) {
	if (!depart || !retour) return 0;
	const a = Date.parse(`${depart}T00:00:00Z`);
	const b = Date.parse(`${retour}T00:00:00Z`);
	if (Number.isNaN(a) || Number.isNaN(b)) return 0;
	return Math.max(0, Math.round((b - a) / 864e5));
}
//#endregion
export { formatPrice as a, tripDurationLabel as c, formatAmount as i, TRIP_DURATIONS as n, isCurrencyCode as o, addDaysIso as r, nightsBetween as s, CURRENCIES as t };
