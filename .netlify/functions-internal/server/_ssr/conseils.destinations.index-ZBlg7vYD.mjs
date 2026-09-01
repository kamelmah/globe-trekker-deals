import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as CITY_GUIDES } from "./city-guides-B563V5AS.mjs";
import { n as PRUNED_GUIDE_SLUGS, s as withoutPruned } from "./pruned-pages-CLTc2P-L.mjs";
import { r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
import { t as listPublishedGuides } from "./published-guides.functions-BYp3PJI5.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.destinations.index-ZBlg7vYD.js
var $$splitComponentImporter = () => import("./conseils.destinations.index-Dnde5RLC.mjs");
var TITLE = "Guides destinations : que faire dans chaque ville | TrouveMonVol";
var DESCRIPTION = "Nos guides voyage par destination : meilleure période, quartiers à voir, budget sur place, transports et formalités pour les voyageurs français.";
var PAGE_URL = `${SITE_URL}/conseils/destinations`;
var Route = createFileRoute("/conseils/destinations/")({
	loader: async () => {
		const { guides } = await listPublishedGuides();
		const known = new Set(CITY_GUIDES.map((guide) => guide.slug));
		const extra = guides.filter((guide) => !known.has(guide.slug));
		return { guides: [...withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS), ...extra] };
	},
	head: () => ({
		meta: [
			{ title: TITLE },
			{
				name: "description",
				content: DESCRIPTION
			},
			{
				property: "og:title",
				content: TITLE
			},
			{
				property: "og:description",
				content: DESCRIPTION
			},
			{
				property: "og:url",
				content: PAGE_URL
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
			href: PAGE_URL
		}],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "ItemList",
				name: TITLE,
				url: PAGE_URL,
				itemListElement: withoutPruned(CITY_GUIDES, PRUNED_GUIDE_SLUGS).map((guide, index) => ({
					"@type": "ListItem",
					position: index + 1,
					name: guide.title,
					url: `${PAGE_URL}/${guide.slug}`
				}))
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
