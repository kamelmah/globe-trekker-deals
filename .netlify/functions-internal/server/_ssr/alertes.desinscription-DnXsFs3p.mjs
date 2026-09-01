import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { o as unsubscribeAlert } from "./flights.functions-2XDL4V6N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/alertes.desinscription-DnXsFs3p.js
var $$splitComponentImporter = () => import("./alertes.desinscription-BOjdslN9.mjs");
var Route = createFileRoute("/alertes/desinscription")({
	validateSearch: (search) => ({ token: typeof search["token"] === "string" ? search["token"].slice(0, 128) : "" }),
	loader: async ({ location }) => {
		const token = location.search["token"];
		if (typeof token !== "string" || token.length < 8) return { done: false };
		return { done: (await unsubscribeAlert({ data: { token } })).ok };
	},
	head: () => ({ meta: [{ title: "Désinscription des alertes prix | TrouveMonVol" }, {
		name: "robots",
		content: "noindex, nofollow"
	}] }),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
