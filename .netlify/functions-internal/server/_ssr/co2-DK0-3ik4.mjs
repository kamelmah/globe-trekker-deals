import { a as distanceKm } from "./airports-DEvng4YS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/co2-DK0-3ik4.js
/**
* Estimation simplifiée des émissions de CO2 par passager, en kg.
* Méthode : distance à vol d'oiseau × facteur d'émission par km, majoré pour
* les vols courts (phases de décollage plus coûteuses) et pour chaque escale
* (kilomètres supplémentaires + un décollage de plus).
*/
function estimateCo2Kg(origin, destination, stops = 0) {
	const km = distanceKm(origin, destination);
	const factor = km < 1500 ? .158 : km < 4e3 ? .13 : .114;
	const detour = 1 + stops * .12;
	const takeoffPenalty = stops * 12;
	return Math.round(km * factor * detour + takeoffPenalty);
}
function co2Label(kg) {
	return `${new Intl.NumberFormat("fr-FR").format(kg)} kg CO₂e`;
}
//#endregion
export { estimateCo2Kg as n, co2Label as t };
