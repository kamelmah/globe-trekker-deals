//#region node_modules/.nitro/vite/services/ssr/assets/french-grammar-AJb2OW9K.js
/** Contraction correcte de "à"/"de" devant un nom de ville avec article (Le Caire, Les Sables…). */
function withPreposition(preposition, city) {
	if (city.startsWith("Le ")) return `${preposition === "à" ? "au" : "du"} ${city.slice(3)}`;
	if (city.startsWith("Les ")) return `${preposition === "à" ? "aux" : "des"} ${city.slice(4)}`;
	return `${preposition} ${city}`;
}
//#endregion
export { withPreposition as t };
