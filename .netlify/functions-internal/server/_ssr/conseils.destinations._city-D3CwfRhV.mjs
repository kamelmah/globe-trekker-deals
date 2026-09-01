import { I as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as getCityGuide } from "./city-guides-B563V5AS.mjs";
import { a as isGuidePruned } from "./pruned-pages-CLTc2P-L.mjs";
import { r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
import { t as guidePriceSnapshot } from "./guide-prices.functions-D6QLKVCN.mjs";
import { n as publishedGuide } from "./published-guides.functions-BYp3PJI5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.destinations._city-D3CwfRhV.js
var $$splitComponentImporter = () => import("./conseils.destinations._city-BslGBi4K.mjs");
var Route = createFileRoute("/conseils/destinations/$city")({
	loader: async ({ params }) => {
		const guide = getCityGuide(params.city) ?? (await publishedGuide({ data: { slug: params.city } })).guide;
		if (!guide) throw notFound();
		return {
			guide,
			price: await guidePriceSnapshot({ data: {
				origin: guide.origin,
				destination: guide.destination
			} })
		};
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Guide introuvable | TrouveMonVol" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { guide } = loaderData;
		const pageUrl = `${SITE_URL}/conseils/destinations/${guide.slug}`;
		return {
			meta: [
				{ title: guide.metaTitle },
				{
					name: "description",
					content: guide.description
				},
				...isGuidePruned(guide.slug) ? [{
					name: "robots",
					content: "noindex, follow"
				}] : [],
				{
					property: "og:title",
					content: guide.metaTitle
				},
				{
					property: "og:description",
					content: guide.description
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
			}, {
				rel: "alternate",
				hrefLang: "fr-FR",
				href: pageUrl
			}],
			scripts: [{
				type: "application/ld+json",
				children: JSON.stringify({
					"@context": "https://schema.org",
					"@type": "Article",
					headline: guide.title,
					description: guide.description,
					inLanguage: "fr-FR",
					mainEntityOfPage: pageUrl,
					dateModified: guide.updated,
					about: {
						"@type": "Place",
						name: `${guide.city}, ${guide.country}`
					},
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
							name: "Guides destinations",
							item: `${SITE_URL}/conseils/destinations`
						},
						{
							"@type": "ListItem",
							position: 4,
							name: guide.title,
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
