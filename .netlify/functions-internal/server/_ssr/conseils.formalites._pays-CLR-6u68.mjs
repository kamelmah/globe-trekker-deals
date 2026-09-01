import { I as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
import { r as getTravelDocument } from "./travel-documents-CkbhbaWQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.formalites._pays-CLR-6u68.js
var $$splitComponentImporter = () => import("./conseils.formalites._pays-B415vEg_.mjs");
var Route = createFileRoute("/conseils/formalites/$pays")({
	loader: ({ params }) => {
		const doc = getTravelDocument(params.pays);
		if (!doc) throw notFound();
		return { doc };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Formalités introuvables | TrouveMonVol" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { doc } = loaderData;
		const pageUrl = `${SITE_URL}/conseils/formalites/${doc.slug}`;
		return {
			meta: [
				{ title: doc.metaTitle },
				{
					name: "description",
					content: doc.metaDescription
				},
				{
					property: "og:title",
					content: doc.metaTitle
				},
				{
					property: "og:description",
					content: doc.metaDescription
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
					headline: doc.metaTitle,
					description: doc.metaDescription,
					inLanguage: "fr-FR",
					mainEntityOfPage: pageUrl,
					dateModified: doc.updated,
					about: {
						"@type": "Country",
						name: doc.country
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
							name: "Formalités",
							item: `${SITE_URL}/conseils/formalites`
						},
						{
							"@type": "ListItem",
							position: 4,
							name: doc.country,
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
