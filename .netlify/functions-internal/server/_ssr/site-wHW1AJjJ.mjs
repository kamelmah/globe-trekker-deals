//#region node_modules/.nitro/vite/services/ssr/assets/site-wHW1AJjJ.js
var SITE_URL = "https://trouvemonvol.fr";
var SITE_NAME = "TrouveMonVol";
function absoluteUrl(path) {
	return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
var DEFAULT_OG_IMAGE = absoluteUrl("/og/default.jpg");
function destinationOgImage(slug) {
	return absoluteUrl(`/og/${slug}.jpg`);
}
//#endregion
export { destinationOgImage as a, absoluteUrl as i, SITE_NAME as n, SITE_URL as r, DEFAULT_OG_IMAGE as t };
