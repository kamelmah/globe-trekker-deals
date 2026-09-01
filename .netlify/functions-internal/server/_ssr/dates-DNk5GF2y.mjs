//#region node_modules/.nitro/vite/services/ssr/assets/dates-DNk5GF2y.js
/**
* Formatage des dates en français lisible — point d'entrée UNIQUE de l'app.
*
* Une date ISO affichée telle quelle (« 2026-11-12 ») est un format machine :
* personne ne lit une date comme ça, et ça donne l'impression d'une donnée non
* traitée. Tout affichage de date passe désormais par ce module.
*
* Deux familles, à ne pas confondre :
*
* - Les dates SANS heure (`2026-11-12`) : date de départ, de retour, jour d'un
*   calendrier. Elles sont formatées en UTC, volontairement. Parsées puis
*   formatées dans le fuseau du lecteur, elles basculeraient au 11 novembre pour
*   tout visiteur à l'ouest de Greenwich — un décalage d'un jour sur une date de
*   vol n'est pas un détail cosmétique.
*
* - Les INSTANTS (ISO complet avec heure) : heure de décollage, horodatage d'un
*   relevé de prix. Ils sont formatés à l'heure de Paris, qui est l'heure de
*   référence du site et de son public.
*/
var PARIS = "Europe/Paris";
/** Une date nue (AAAA-MM-JJ) devient un instant à midi UTC, jamais décalé d'un jour. */
function parseDateOnly(iso) {
	if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return null;
	const date = /* @__PURE__ */ new Date(`${iso}T00:00:00Z`);
	return Number.isNaN(date.getTime()) ? null : date;
}
function parseInstant(iso) {
	const date = new Date(iso);
	return Number.isNaN(date.getTime()) ? null : date;
}
/** « jeudi 12 novembre 2026 » — forme de référence, la plus lisible. */
function formatDateLong(iso) {
	const date = iso ? parseDateOnly(iso) : null;
	if (!date) return "";
	return new Intl.DateTimeFormat("fr-FR", {
		weekday: "long",
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(date);
}
/** « 12 novembre 2026 » — sans le jour de la semaine, pour les phrases denses. */
function formatDateMedium(iso) {
	const date = iso ? parseDateOnly(iso) : null;
	if (!date) return "";
	return new Intl.DateTimeFormat("fr-FR", {
		day: "numeric",
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(date);
}
/** « jeu. 12 nov. » — pour les pastilles et boutons, où la place manque. */
function formatDateCompact(iso) {
	const date = iso ? parseDateOnly(iso) : null;
	if (!date) return "";
	return new Intl.DateTimeFormat("fr-FR", {
		weekday: "short",
		day: "numeric",
		month: "short",
		timeZone: "UTC"
	}).format(date);
}
/** « novembre 2026 » à partir d'un mois AAAA-MM. */
function formatMonthLong(month) {
	if (!month || !/^\d{4}-\d{2}$/.test(month)) return "";
	const date = /* @__PURE__ */ new Date(`${month}-01T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("fr-FR", {
		month: "long",
		year: "numeric",
		timeZone: "UTC"
	}).format(date);
}
/** « nov. 26 » — axe d'un graphique, où chaque pixel compte. */
function formatMonthCompact(month) {
	if (!month) return "";
	const date = /* @__PURE__ */ new Date(`${month}-01T00:00:00Z`);
	if (Number.isNaN(date.getTime())) return "";
	return new Intl.DateTimeFormat("fr-FR", {
		month: "short",
		year: "2-digit",
		timeZone: "UTC"
	}).format(date);
}
/** « jeu. 12 nov. 2026, 13:00 » — heure de décollage, dans une carte de résultat. */
function formatDateTimeCompact(iso) {
	const date = iso ? parseInstant(iso) : null;
	if (!date) return "";
	return new Intl.DateTimeFormat("fr-FR", {
		weekday: "short",
		day: "numeric",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		timeZone: PARIS
	}).format(date);
}
/** « 12 novembre 2026 à 13:00 » — horodatage d'un relevé, en toutes lettres. */
function formatDateTimeLong(iso) {
	const date = iso ? parseInstant(iso) : null;
	if (!date) return "—";
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "long",
		timeStyle: "short",
		timeZone: PARIS
	}).format(date);
}
/** « 12 nov. 2026, 13:00 » — compact, sans jour de la semaine. */
function formatDateTimeShort(iso) {
	const date = iso ? parseInstant(iso) : null;
	if (!date) return "—";
	return new Intl.DateTimeFormat("fr-FR", {
		dateStyle: "medium",
		timeStyle: "short",
		timeZone: PARIS
	}).format(date);
}
//#endregion
export { formatDateTimeLong as a, formatMonthLong as c, formatDateTimeCompact as i, formatDateLong as n, formatDateTimeShort as o, formatDateMedium as r, formatMonthCompact as s, formatDateCompact as t };
