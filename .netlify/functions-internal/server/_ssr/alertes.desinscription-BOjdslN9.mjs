import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Route } from "./alertes.desinscription-DnXsFs3p.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alertes.desinscription-BOjdslN9.js
var import_jsx_runtime = require_jsx_runtime();
function UnsubscribePage() {
	const { done } = Route.useLoaderData();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page max-w-xl py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-2xl font-semibold",
				children: done ? "Alerte désactivée" : "Lien de désinscription invalide"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-sm text-muted-foreground",
				children: done ? "C'est fait : vous ne recevrez plus d'email pour ce trajet. Aucune donnée supplémentaire n'est conservée." : "Ce lien n'est plus valide ou l'alerte a déjà été désactivée. Vous pouvez en créer une nouvelle à tout moment depuis une page de résultats."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-6 inline-flex rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground",
				children: "Retour à l'accueil"
			})
		]
	});
}
//#endregion
export { UnsubscribePage as component };
