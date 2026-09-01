import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as TRAVEL_DOCUMENTS } from "./travel-documents-CkbhbaWQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.formalites.index-oMT3ivYu.js
var import_jsx_runtime = require_jsx_runtime();
function TravelDocumentsIndex() {
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
					"/ Formalités"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 font-display",
				children: "Documents et formalités par destination"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 max-w-2xl text-sm text-muted-foreground",
				children: "Visa, validité du passeport, vaccins recommandés et particularités locales : ce qu'il faut vérifier avant de réserver, pays par pays. Cette liste démarre par les destinations hors Union européenne les plus consultées sur le site et s'étoffera avec le temps."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3",
				children: TRAVEL_DOCUMENTS.map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/conseils/formalites/$pays",
					params: { pays: doc.slug },
					className: "block h-full rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-display text-base font-semibold",
						children: doc.country
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: doc.intro
					})]
				}) }, doc.slug))
			})
		]
	});
}
//#endregion
export { TravelDocumentsIndex as component };
