//#region node_modules/.nitro/vite/services/ssr/assets/price-refresh.shared-2Es62p8D.js
/**
* Paramètres partagés (client + serveur) du rafraîchissement automatique des
* prix Travelpayouts. Aucun prix n'est inventé ici : ce module ne décrit que la
* cadence et le périmètre des appels réels à l'API.
*/
/** Destinations mises en avant sur la page d'accueil. */
var HOME_DESTINATION_CODES = [
	"RAK",
	"LIS",
	"BCN",
	"IST",
	"ROM",
	"ATH",
	"MAD",
	"PRG",
	"BUD",
	"OPO",
	"CMN",
	"NYC"
];
/**
* Destinations couvertes par les guides conseils (/conseils/destinations/…).
* Elles sont rafraîchies avec les mêmes appels Travelpayouts que l'accueil,
* pour que le prix affiché dans chaque fiche ville soit un relevé réel récent.
*/
var GUIDE_DESTINATION_CODES = [
	"LON",
	"AMS",
	"MIL",
	"BER",
	"VIE",
	"SVQ",
	"CPH",
	"TUN",
	"ALG",
	"DXB",
	"BKK",
	"TYO"
];
/** Ensemble des destinations rafraîchies à chaque passage (sans doublon). */
var REFRESH_DESTINATION_CODES = Array.from(/* @__PURE__ */ new Set([...HOME_DESTINATION_CODES, ...GUIDE_DESTINATION_CODES]));
/** Villes de départ rafraîchies automatiquement chaque heure. */
var REFRESH_ORIGINS = [
	"PAR",
	"LYS",
	"MRS",
	"NCE",
	"TLS"
];
/** Cadence du rafraîchissement automatique. */
var REFRESH_INTERVAL_MS = 36e5;
/** Délai minimum entre deux rafraîchissements manuels (anti-abus, quota API). */
var MANUAL_REFRESH_COOLDOWN_MS = 6e5;
function nextRefreshAt(lastAt) {
	if (!lastAt) return null;
	const time = Date.parse(lastAt);
	if (Number.isNaN(time)) return null;
	return new Date(time + REFRESH_INTERVAL_MS).toISOString();
}
//#endregion
export { REFRESH_ORIGINS as a, REFRESH_INTERVAL_MS as i, MANUAL_REFRESH_COOLDOWN_MS as n, nextRefreshAt as o, REFRESH_DESTINATION_CODES as r, HOME_DESTINATION_CODES as t };
