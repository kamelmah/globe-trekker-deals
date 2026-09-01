import { I as notFound, N as redirect, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { c as formatMonthLong } from "./dates-DNk5GF2y.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { a as objectType, i as numberType, o as stringType } from "../_libs/zod.mjs";
import { r as monthlyHistory } from "./flights.functions-2XDL4V6N.mjs";
import { o as isRoutePruned } from "./pruned-pages-CLTc2P-L.mjs";
import { n as getDestinationImage } from "./destination-images-C1720lZ9.mjs";
import { d as isIndexableRoute, r as DESTINATIONS, u as getDestination } from "./route-whitelist-w8ea1sr9.mjs";
import { a as destinationOgImage, i as absoluteUrl, r as SITE_URL } from "./site-wHW1AJjJ.mjs";
import { t as hreflangLinks } from "./hreflang-Bl9HBMS6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vols._slug-C1lg0DY2.js
/**
* Anciennes URL de pages de liaison, redirigées en 301 vers leur URL actuelle.
*
* Ce fichier est un registre HISTORIQUE, pas une donnée dérivée : il ne doit
* jamais être régénéré ni vidé quand la liste blanche change. Une URL qui a été
* servie un jour doit continuer à mener quelque part.
*
* Les slugs de départ venaient du référentiel géographique de Travelpayouts,
* qui renvoie des libellés administratifs plutôt que le nom d'usage : « Ville de
* Madrid » pour MAD, « Buda » pour BUD, « Palma de Mallorca » pour PMI.
*
* Seules les routes CONSERVÉES sont listées. Les liaisons écartées de la liste
* blanche ne sont pas redirigées : elles passent en `noindex` et restent
* servies telles quelles tant que l'indexation n'est pas stabilisée.
*/
var LEGACY_ROUTE_REDIRECTS = {
	"marseille-ville-de-madrid": "marseille-madrid",
	"marseille-palma-de-mallorca": "marseille-palma",
	"marseille-buda": "marseille-budapest"
};
/** URL de destination pour un ancien slug, ou null s'il n'a pas changé. */
function legacyRedirectTarget(slug) {
	return LEGACY_ROUTE_REDIRECTS[slug] ?? null;
}
/**
* Gabarit UNIQUE du titre des pages de liaison /vols/<origine>-<destination>.
*
* Les titres étaient écrits à deux endroits — à la main pour les 38 pages
* éditoriales, par le générateur pour les autres — et avaient divergé :
* « Vol Marseille Agadir pas cher » d'un côté, « Vol pas cher Paris Porto :
* prix, compagnies, questions » de l'autre. Sur un site dont toutes les pages
* répondent à la même intention de recherche, ces titres doivent suivre une
* seule forme.
*
* Aucun prix dans le titre : il change tous les jours alors que Google ne
* recrawle pas la page à ce rythme, ce qui garantit un titre périmé en SERP.
* Le prix a sa place dans la page, pas dans la balise.
*/
/**
* Le modèle de balise title. Un seul endroit à modifier pour changer le titre
* de toutes les pages de liaison du site.
*/
function routeMetaTitle(originCity, destinationCity) {
	return `Vol pas cher ${originCity} ${destinationCity} : prix et meilleure période`;
}
/**
* Le modèle de H1, pour les mêmes raisons.
*
* Sans prix non plus. Un H1 « relevé dès 91 € » annonce un chiffre que la page
* elle-même détaille juste en dessous, avec sa date de relevé et son contexte —
* le sortir de ce contexte le transforme en promesse commerciale invérifiable.
*/
function routeHeading(originCity, destinationCity) {
	return `Vol pas cher ${originCity} ${destinationCity}`;
}
function median(values) {
	const sorted = [...values].sort((a, b) => a - b);
	const middle = Math.floor(sorted.length / 2);
	const value = sorted.length % 2 === 0 ? ((sorted[middle - 1] ?? 0) + (sorted[middle] ?? 0)) / 2 : sorted[middle] ?? 0;
	return Math.round(value);
}
var euros = (value) => `${Math.round(value)} €`;
/** « janvier », « août » — jamais un mois au format machine. */
function monthName(month) {
	return formatMonthLong(month) || month;
}
/**
* Liste à la française : « janvier et février », « janvier, février et mars ».
*/
function enumerate(parts) {
	if (parts.length <= 1) return parts[0] ?? "";
	return `${parts.slice(0, -1).join(", ")} et ${parts[parts.length - 1]}`;
}
/**
* Phrase de saisonnalité, construite à partir des chiffres relevés.
*
* Elle remplace la constante « Hors vacances scolaires et week-ends de départs »,
* qui était identique sur les 89 pages générées et constituait à elle seule le
* plus gros signal de duplication du site.
*
* Sa forme suit l'ampleur réelle de l'écart, pas un gabarit unique : sur un
* trajet où le mois de départ ne change presque rien, l'annoncer comme un levier
* serait faux. Trois formes, choisies par la donnée.
*/
function buildSentence(params) {
	const { cheapest, alsoCheapest, dearest, medianEur, spreadPct, points } = params;
	const moisBas = enumerate([cheapest, ...alsoCheapest].map((p) => monthName(p.month)));
	const moisHaut = monthName(dearest.month);
	const couverture = `${points.length} mois de départ relevés`;
	if (spreadPct < 15) return `Sur ce trajet, le mois de départ ne change pas grand-chose : ${spreadPct} % séparent ${moisBas} (${euros(cheapest.priceEur)}) de ${moisHaut} (${euros(dearest.priceEur)}). Le prix médian s'établit à ${euros(medianEur)} sur ${couverture}. Mieux vaut donc arbitrer sur les dates précises que sur la saison.`;
	if (spreadPct >= 40) return `Le mois de départ pèse lourd ici : ${euros(cheapest.priceEur)} en ${moisBas}, contre ${euros(dearest.priceEur)} en ${moisHaut}, soit ${spreadPct} % d'écart. Le prix médian est de ${euros(medianEur)} sur ${couverture}. Décaler le voyage d'un mois vaut souvent plus que n'importe quelle astuce de réservation.`;
	return `Partir en ${moisBas} plutôt qu'en ${moisHaut} fait passer le billet de ${euros(cheapest.priceEur)} à ${euros(dearest.priceEur)}, soit ${spreadPct} % d'écart. Le prix médian relevé est de ${euros(medianEur)} sur ${couverture}.`;
}
/**
* Saisonnalité d'un trajet, ou null si les relevés sont trop peu nombreux pour
* qu'elle veuille dire quelque chose. Aucune valeur n'est extrapolée : les mois
* sans relevé restent absents plutôt que comblés.
*/
function computeSeasonality(points, route) {
	const valid = points.filter((p) => Number.isFinite(p.priceEur) && p.priceEur > 0 && /^\d{4}-\d{2}$/.test(p.month)).sort((a, b) => a.month.localeCompare(b.month));
	if (valid.length < 3) return null;
	const prixBas = Math.min(...valid.map((p) => p.priceEur));
	const prixHaut = Math.max(...valid.map((p) => p.priceEur));
	const auPrixBas = valid.filter((p) => p.priceEur === prixBas);
	const cheapest = auPrixBas[0];
	const dearest = valid.find((p) => p.priceEur === prixHaut);
	if (!cheapest || !dearest) return null;
	const medianEur = median(valid.map((p) => p.priceEur));
	const spreadPct = Math.round((prixHaut - prixBas) / prixBas * 100);
	const latestObservedAt = valid.map((p) => p.observedAt).filter((v) => Boolean(v)).sort().at(-1) ?? null;
	const alsoCheapest = auPrixBas.slice(1, 3);
	return {
		points: valid,
		cheapest,
		dearest,
		alsoCheapest,
		medianEur,
		spreadPct,
		latestObservedAt,
		sentence: buildSentence({
			...route,
			cheapest,
			alsoCheapest,
			dearest,
			medianEur,
			spreadPct,
			points: valid
		})
	};
}
var iata = stringType().trim().toUpperCase().regex(/^[A-Z]{3}$/);
/**
* Saisonnalité d'un trajet, lue en base uniquement.
*
* Aucun appel à la source tarifaire n'est fait ici : les relevés sont produits
* hors ligne par la tâche planifiée. Une page vue par un robot ne consomme donc
* rien.
*/
var routeSeasonality = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata
}).parse(data)).handler(createSsrRpc("ed6bda4a4be70c1f41d2de80ce65067c235c938d61b601b90f312e791ec887b3"));
var OG_ROUTE_SLUGS = /* @__PURE__ */ new Set([
	"lyon-tunis",
	"marseille-agadir",
	"marseille-ajaccio",
	"marseille-alger",
	"marseille-alicante",
	"marseille-amsterdam",
	"marseille-annaba",
	"marseille-antalya",
	"marseille-athenes",
	"marseille-barcelone",
	"marseille-bastia",
	"marseille-bejaia",
	"marseille-berlin",
	"marseille-brest",
	"marseille-bruxelles",
	"marseille-bucarest",
	"marseille-budapest",
	"marseille-calvi",
	"marseille-casablanca",
	"marseille-catane",
	"marseille-charm-el-cheikh",
	"marseille-constantine",
	"marseille-corfou",
	"marseille-cracovie",
	"marseille-djeddah",
	"marseille-djerba",
	"marseille-dubai",
	"marseille-dubrovnik",
	"marseille-faro",
	"marseille-fes",
	"marseille-figari",
	"marseille-francfort",
	"marseille-hurghada",
	"marseille-ibiza",
	"marseille-istanbul",
	"marseille-le-caire",
	"marseille-lille",
	"marseille-lisbonne",
	"marseille-londres",
	"marseille-madrid",
	"marseille-malaga",
	"marseille-malte",
	"marseille-marrakech",
	"marseille-milan",
	"marseille-munich",
	"marseille-nantes",
	"marseille-naples",
	"marseille-olbia",
	"marseille-oran",
	"marseille-palerme",
	"marseille-palma",
	"marseille-paris",
	"marseille-porto",
	"marseille-prague",
	"marseille-rome",
	"marseille-setif",
	"marseille-seville",
	"marseille-split",
	"marseille-strasbourg",
	"marseille-tanger",
	"marseille-tlemcen",
	"marseille-tunis",
	"marseille-venise",
	"marseille-vienne",
	"marseille-zurich",
	"montpellier-alger",
	"montpellier-casablanca",
	"montpellier-fes",
	"montpellier-marrakech",
	"montpellier-paris",
	"nice-alger",
	"nice-casablanca",
	"nice-constantine",
	"nice-djerba",
	"nice-istanbul",
	"nice-londres",
	"nice-marrakech",
	"nice-monastir",
	"nice-paris",
	"nice-tunis",
	"paris-alger",
	"paris-amsterdam",
	"paris-athenes",
	"paris-bali",
	"paris-bangkok",
	"paris-barcelone",
	"paris-berlin",
	"paris-birmingham",
	"paris-budapest",
	"paris-casablanca",
	"paris-copenhague",
	"paris-dakar",
	"paris-doha",
	"paris-dubai",
	"paris-dublin",
	"paris-gdansk",
	"paris-hong-kong",
	"paris-istanbul",
	"paris-le-caire",
	"paris-lisbonne",
	"paris-londres",
	"paris-los-angeles",
	"paris-madrid",
	"paris-marrakech",
	"paris-marseille",
	"paris-mexico",
	"paris-miami",
	"paris-milan",
	"paris-montreal",
	"paris-munich",
	"paris-new-york",
	"paris-porto",
	"paris-prague",
	"paris-reykjavik",
	"paris-rome",
	"paris-seoul",
	"paris-seville",
	"paris-stockholm",
	"paris-tokyo",
	"paris-trieste",
	"paris-vienne",
	"toulouse-alger",
	"toulouse-casablanca",
	"toulouse-djerba",
	"toulouse-fes",
	"toulouse-marrakech",
	"toulouse-oran",
	"toulouse-paris",
	"toulouse-tanger",
	"toulouse-tunis"
]);
/**
* Carte Open Graph d'un trajet : villes, prix d'appel relevé et date de ce
* relevé, sur fond de marque. Générée hors ligne par
* scripts/generate-og-images.mjs, qui écrit aussi la liste des slugs couverts.
*
* Le test d'appartenance n'est pas défensif : il évite d'annoncer une image que
* le serveur n'a pas, ce qui laisserait la vignette vide au partage.
*
* Module séparé de site.ts à dessein : la liste pèse une centaine d'entrées et
* n'a de raison d'être que sur les pages /vols/*, alors que site.ts est importé
* presque partout.
*/
function routeOgImage(slug) {
	return OG_ROUTE_SLUGS.has(slug) ? absoluteUrl(`/og/routes/${slug}.png`) : null;
}
var dynamicRoutePage = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ slug: stringType().trim().min(3).max(80) }).parse(data)).handler(createSsrRpc("428ea841da75328ded9e913fe46845d98d60742035fc3c0dab5fe607fc0f9b6c"));
var relatedRoutePages = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: stringType().trim().min(3).max(3),
	originCity: stringType().trim().min(1).max(80),
	exclude: stringType().trim().max(3).optional(),
	limit: numberType().int().min(1).max(24).optional()
}).parse(data)).handler(createSsrRpc("2495021265795268fc89eef4f68ccc69d9d32b0c872d73a91056b6709d3d6009"));
var $$splitComponentImporter = () => import("./vols._slug-d7C6uQFJ.mjs");
var Route = createFileRoute("/vols/$slug")({
	loader: async ({ params }) => {
		const renamed = legacyRedirectTarget(params.slug);
		if (renamed) throw redirect({
			to: "/vols/$slug",
			params: { slug: renamed },
			statusCode: 301
		});
		const route = getDestination(params.slug) ?? (await dynamicRoutePage({ data: { slug: params.slug } })).route;
		if (!route) throw notFound();
		const history = await monthlyHistory({ data: {
			origin: route.origin,
			destination: route.destination
		} });
		const historyLowest = history.months.length ? Math.min(...history.months.map((m) => m.priceEur)) : null;
		const lowestObserved = route.simulatedLowestPrice ?? route.observedLowestPrice ?? historyLowest;
		const lowestObservedAt = route.simulatedLowestPrice ? null : route.observedPriceAt ?? history.months.find((m) => m.priceEur === historyLowest)?.updatedAt ?? null;
		const { related } = await relatedRoutePages({ data: {
			origin: route.origin,
			originCity: route.originCity,
			exclude: route.destination,
			limit: 12
		} });
		const indexable = !isRoutePruned(route.slug) && isIndexableRoute(route.slug, DESTINATIONS);
		let saison = null;
		try {
			const { points } = await routeSeasonality({ data: {
				origin: route.origin,
				destination: route.destination
			} });
			saison = computeSeasonality(points, {
				originCity: route.originCity,
				destinationCity: route.destinationCity
			});
		} catch (error) {
			console.error("Saisonnalité indisponible", error);
		}
		return {
			route,
			months: history.months,
			lowestObserved,
			lowestObservedAt,
			related,
			indexable,
			saison
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Destination introuvable | TrouveMonVol" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { route, lowestObserved, indexable } = loaderData;
		const pageUrl = `${SITE_URL}/vols/${route.slug}`;
		const metaTitle = routeMetaTitle(route.originCity, route.destinationCity);
		const ogImage = routeOgImage(route.slug) ?? (getDestination(route.slug) ? destinationOgImage(route.slug) : absoluteUrl(getDestinationImage(route.destination, route.destinationCity, route.country).src));
		return {
			meta: [
				{ title: metaTitle },
				{
					name: "description",
					content: route.metaDescription
				},
				...indexable ? [] : [{
					name: "robots",
					content: "noindex, follow"
				}],
				{
					property: "og:title",
					content: metaTitle
				},
				{
					property: "og:description",
					content: route.metaDescription
				},
				{
					property: "og:type",
					content: "article"
				},
				{
					property: "og:url",
					content: pageUrl
				},
				{
					property: "og:image",
					content: ogImage
				},
				{
					property: "og:image:type",
					content: ogImage.endsWith(".png") ? "image/png" : "image/jpeg"
				},
				{
					property: "og:image:width",
					content: "1200"
				},
				{
					property: "og:image:height",
					content: "630"
				},
				{
					property: "og:image:alt",
					content: `Vols pas chers ${route.originCity} — ${route.destinationCity}`
				},
				{
					name: "twitter:image",
					content: ogImage
				}
			],
			links: [{
				rel: "canonical",
				href: pageUrl
			}, ...hreflangLinks(pageUrl)],
			scripts: [
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "FAQPage",
						name: metaTitle,
						url: pageUrl,
						inLanguage: "fr-FR",
						mainEntity: route.faq.map((item) => ({
							"@type": "Question",
							name: item.question,
							acceptedAnswer: {
								"@type": "Answer",
								text: item.answer
							}
						}))
					})
				},
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "BreadcrumbList",
						itemListElement: [{
							"@type": "ListItem",
							position: 1,
							name: "Accueil",
							item: `${SITE_URL}/`
						}, {
							"@type": "ListItem",
							position: 2,
							name: `Vols ${route.originCity} — ${route.destinationCity}`,
							item: pageUrl
						}]
					})
				},
				{
					type: "application/ld+json",
					children: JSON.stringify({
						"@context": "https://schema.org",
						"@type": "Flight",
						name: `Vol ${route.originCity} — ${route.destinationCity}`,
						description: route.metaDescription,
						url: pageUrl,
						image: ogImage,
						departureAirport: {
							"@type": "Airport",
							iataCode: route.origin,
							name: route.originCity
						},
						arrivalAirport: {
							"@type": "Airport",
							iataCode: route.destination,
							name: route.destinationCity
						},
						...route.observedDepartureAt ? { departureTime: new Date(route.observedDepartureAt).toISOString() } : {},
						...route.observedAirline ? { airline: {
							"@type": "Airline",
							name: route.observedAirline,
							.../^[A-Z0-9]{2}$/.test(route.observedAirline) ? { iataCode: route.observedAirline } : {}
						} } : {},
						...lowestObserved ? { offers: {
							"@type": "Offer",
							priceCurrency: "EUR",
							price: lowestObserved,
							url: pageUrl,
							availability: "https://schema.org/InStock"
						} } : {}
					})
				}
			]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { routeHeading as n, Route as t };
