import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as getCityGuide } from "./city-guides-B563V5AS.mjs";
import { s as withoutPruned, t as PRUNED_COMPARISON_SLUGS } from "./pruned-pages-CLTc2P-L.mjs";
import { n as getDestinationImage, t as ResponsivePicture } from "./destination-images-C1720lZ9.mjs";
import { t as COMPARISONS } from "./comparisons-DzbgatmQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/comparatifs.index-DExRwig1.js
var import_jsx_runtime = require_jsx_runtime();
function ComparisonsIndex() {
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
					"/ Comparatifs"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display",
				children: "Comparatifs de destinations"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm text-muted-foreground",
				children: "Deux villes, une seule place dans votre agenda : ces comparatifs mettent face à face prix des vols, budget sur place, climat et ambiance, pour vous aider à trancher avant de réserver."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: withoutPruned(COMPARISONS, PRUNED_COMPARISON_SLUGS).map((comparison) => {
					const guideA = getCityGuide(comparison.cityA.guideSlug);
					const guideB = getCityGuide(comparison.cityB.guideSlug);
					const imageA = guideA ? getDestinationImage(guideA.destination, guideA.city) : null;
					const imageB = guideB ? getDestinationImage(guideB.destination, guideB.city) : null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/comparatifs/$slug",
						params: { slug: comparison.slug },
						className: "block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary",
						children: [
							imageA && imageB && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
									src: imageA.thumb,
									webp: imageA.thumbWebp,
									alt: imageA.alt,
									loading: "lazy",
									width: 200,
									height: 112,
									className: "h-24 w-1/2 rounded-lg object-cover"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
									src: imageB.thumb,
									webp: imageB.thumbWebp,
									alt: imageB.alt,
									loading: "lazy",
									width: 200,
									height: 112,
									className: "h-24 w-1/2 rounded-lg object-cover"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 font-display text-base font-semibold",
								children: comparison.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: comparison.intro
							})
						]
					}) }, comparison.slug);
				})
			})
		]
	});
}
//#endregion
export { ComparisonsIndex as component };
