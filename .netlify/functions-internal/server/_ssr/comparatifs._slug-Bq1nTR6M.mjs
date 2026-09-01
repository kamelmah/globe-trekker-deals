import { I as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getCityGuide } from "./city-guides-B563V5AS.mjs";
import { i as isComparisonPruned } from "./pruned-pages-CLTc2P-L.mjs";
import { u as getDestination } from "./route-whitelist-w8ea1sr9.mjs";
import { r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
import { n as getComparison } from "./comparisons-DzbgatmQ.mjs";
import { t as guidePriceSnapshot } from "./guide-prices.functions-D6QLKVCN.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/comparatifs._slug-Bq1nTR6M.js
var $$splitComponentImporter = () => import("./comparatifs._slug-1jJK8_Bm.mjs");
var Route = createFileRoute("/comparatifs/$slug")({
	loader: async ({ params }) => {
		const comparison = getComparison(params.slug);
		if (!comparison) throw notFound();
		const guideA = getCityGuide(comparison.cityA.guideSlug);
		const guideB = getCityGuide(comparison.cityB.guideSlug);
		const destA = getDestination(comparison.cityA.destinationSlug);
		const destB = getDestination(comparison.cityB.destinationSlug);
		if (!guideA || !guideB || !destA || !destB) throw notFound();
		const [priceA, priceB] = await Promise.all([guidePriceSnapshot({ data: {
			origin: destA.origin,
			destination: destA.destination
		} }), guidePriceSnapshot({ data: {
			origin: destB.origin,
			destination: destB.destination
		} })]);
		return {
			comparison,
			guideA,
			guideB,
			destA,
			destB,
			priceA,
			priceB
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Comparatif introuvable | TrouveMonVol" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { comparison, guideA, guideB } = loaderData;
		const pageUrl = `${SITE_URL}/comparatifs/${comparison.slug}`;
		return {
			meta: [
				{ title: comparison.metaTitle },
				{
					name: "description",
					content: comparison.metaDescription
				},
				...isComparisonPruned(comparison.slug) ? [{
					name: "robots",
					content: "noindex, follow"
				}] : [],
				{
					property: "og:title",
					content: comparison.metaTitle
				},
				{
					property: "og:description",
					content: comparison.metaDescription
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
					content: DEFAULT_OG_IMAGE
				},
				{
					name: "twitter:image",
					content: DEFAULT_OG_IMAGE
				}
			],
			links: [{
				rel: "canonical",
				href: pageUrl
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Article",
					headline: comparison.title,
					description: comparison.metaDescription,
					inLanguage: "fr-FR",
					mainEntityOfPage: pageUrl,
					dateModified: comparison.updated,
					about: [{
						"@type": "Place",
						name: `${guideA.city}, ${guideA.country}`
					}, {
						"@type": "Place",
						name: `${guideB.city}, ${guideB.country}`
					}],
					author: {
						"@type": "Organization",
						name: "TrouveMonVol",
						url: SITE_URL
					},
					publisher: {
						"@type": "Organization",
						name: "TrouveMonVol",
						logo: {
							"@type": "ImageObject",
							url: `${SITE_URL}/icons/icon-512.png`
						}
					}
				})
			}, {
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "BreadcrumbList",
					itemListElement: [
						{
							"@type": "ListItem",
							position: 1,
							name: "Accueil",
							item: `${SITE_URL}/`
						},
						{
							"@type": "ListItem",
							position: 2,
							name: "Conseils",
							item: `${SITE_URL}/conseils`
						},
						{
							"@type": "ListItem",
							position: 3,
							name: "Comparatifs",
							item: `${SITE_URL}/comparatifs`
						},
						{
							"@type": "ListItem",
							position: 4,
							name: comparison.title,
							item: pageUrl
						}
					]
				})
			}]
		};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
