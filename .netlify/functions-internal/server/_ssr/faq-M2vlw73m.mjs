import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as FAQ } from "./faq-CfypCZv5.mjs";
import { t as FaqAccordion } from "./FaqAccordion-C_uU-d1T.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-M2vlw73m.js
var import_jsx_runtime = require_jsx_runtime();
function FaqPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Questions fréquentes"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 max-w-2xl text-sm text-muted-foreground",
				children: [
					"Tout ce qu'il faut savoir sur le fonctionnement du site, la formation des prix et notre modèle économique. Pour les conseils de réservation, rendez-vous dans nos",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/conseils",
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "articles"
					}),
					". Vol retardé ou annulé ?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/indemnisation",
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "Voir vos droits à indemnisation"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 max-w-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqAccordion, { items: FAQ })
			})
		]
	});
}
//#endregion
export { FaqPage as component };
