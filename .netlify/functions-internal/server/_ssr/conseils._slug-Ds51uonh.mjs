import { I as notFound, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
import { n as getPost } from "./posts-Cx690dcB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils._slug-Ds51uonh.js
var $$splitComponentImporter = () => import("./conseils._slug-p4DNzxuW.mjs");
var Route = createFileRoute("/conseils/$slug")({
	loader: ({ params }) => {
		const post = getPost(params.slug);
		if (!post) throw notFound();
		return { post };
	},
	head: ({ loaderData }) => {
		if (!loaderData) return { meta: [{ title: "Article introuvable | TrouveMonVol" }, {
			name: "robots",
			content: "noindex"
		}] };
		const { post } = loaderData;
		const pageUrl = `${SITE_URL}/conseils/${post.slug}`;
		return {
			meta: [
				{ title: post.metaTitle },
				{
					name: "description",
					content: post.description
				},
				{
					property: "og:title",
					content: post.metaTitle
				},
				{
					property: "og:description",
					content: post.description
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
					headline: post.metaTitle,
					description: post.description,
					inLanguage: "fr-FR",
					mainEntityOfPage: pageUrl,
					image: DEFAULT_OG_IMAGE,
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
							name: post.metaTitle,
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
