import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as getDestinationImage, t as ResponsivePicture } from "./destination-images-C1720lZ9.mjs";
import { t as Route } from "./conseils.destinations.index-ZBlg7vYD.mjs";
import { t as withPreposition } from "./french-grammar-AJb2OW9K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.destinations.index-Dnde5RLC.js
var import_jsx_runtime = require_jsx_runtime();
function CityGuidesIndex() {
	const { guides } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
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
					"/ Guides destinations"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display",
				children: "Guides destinations"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm text-muted-foreground",
				children: "Pour chaque ville desservie sur le site, un guide pratique : quand partir, quels quartiers voir, quel budget prévoir sur place, comment se déplacer et quelles formalités anticiper."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-4 md:grid-cols-2",
				children: guides.map((guide) => {
					const image = getDestinationImage(guide.destination, guide.city);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "flex h-full flex-col rounded-xl border border-border bg-card p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/conseils/destinations/$city",
							params: { city: guide.slug },
							className: "flex gap-4 rounded-lg transition-colors hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
								src: image.thumb,
								webp: image.thumbWebp,
								alt: image.alt,
								loading: "lazy",
								width: 128,
								height: 96,
								className: "size-20 shrink-0 rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "block font-display text-base font-semibold",
										children: ["Que faire ", withPreposition("à", guide.city)]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-1 block text-xs text-muted-foreground",
										children: guide.country
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "mt-2 block text-sm text-muted-foreground",
										children: guide.description
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vols/$slug",
							params: { slug: guide.routeSlug },
							className: "mt-3 text-sm font-medium text-primary underline-offset-2 hover:underline",
							children: [
								"Voir les vols pas chers ",
								guide.originCity,
								" — ",
								guide.city
							]
						})]
					}, guide.slug);
				})
			})
		]
	});
}
//#endregion
export { CityGuidesIndex as component };
