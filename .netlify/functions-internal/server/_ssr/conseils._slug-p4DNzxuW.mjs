import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as formatDateMedium } from "./dates-DNk5GF2y.mjs";
import { r as PRUNED_ROUTE_SLUGS, s as withoutPruned } from "./pruned-pages-CLTc2P-L.mjs";
import { r as DESTINATIONS } from "./route-whitelist-w8ea1sr9.mjs";
import { t as Route } from "./conseils._slug-Ds51uonh.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils._slug-p4DNzxuW.js
var import_jsx_runtime = require_jsx_runtime();
function PostPage() {
	const { post } = Route.useLoaderData();
	const indexable = withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS);
	const related = post.relatedSlugs ? post.relatedSlugs.map((slug) => indexable.find((d) => d.slug === slug)).filter((d) => d !== void 0) : indexable.slice(0, 4);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "container-page py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "text-xs text-muted-foreground",
				"aria-label": "Fil d'ariane",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/conseils",
						className: "hover:text-foreground",
						children: "Conseils"
					}),
					" ",
					"/ ",
					post.title
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 max-w-3xl font-display",
				children: post.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					post.readingMinutes,
					" min de lecture · mis à jour le ",
					formatDateMedium(post.updated)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 max-w-3xl",
				children: post.body.map((block, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "mt-8 first:mt-0",
					children: [block.heading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: block.heading
					}), block.paragraphs.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: paragraph
					}, paragraph.slice(0, 40)))]
				}, block.heading ?? index))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "mt-12 max-w-3xl rounded-xl border border-border bg-secondary/40 p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-semibold",
					children: "Appliquer ces conseils maintenant"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "mt-3 space-y-2 text-sm text-muted-foreground",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/mode-budget",
						search: {
							origin: "PAR",
							budget: 400,
							month: "",
							adultes: 1,
							enfants: 0,
							bebes: 0
						},
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "Voir où partir avec mon budget"
					}) }), related.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/vols/$slug",
						params: { slug: d.slug },
						className: "hover:text-foreground",
						children: [
							"Vols pas chers ",
							d.originCity,
							" — ",
							d.destinationCity
						]
					}) }, d.slug))]
				})]
			})
		]
	});
}
//#endregion
export { PostPage as component };
