import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { t as Stay22Map } from "./Stay22Map-ChdA7JX9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/hebergement-7_zSKj7h.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function HebergementPage() {
	const [input, setInput] = (0, import_react.useState)("Paris");
	const [city, setCity] = (0, import_react.useState)("Paris");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display leading-tight",
				children: "Votre hôtel, avant même d'avoir choisi votre vol"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-2xl text-sm text-muted-foreground sm:text-base",
				children: "Comparez les prix réels sur la carte, sans attendre d'avoir votre billet en poche : hôtels, appartements et auberges, avec leurs tarifs issus directement des plateformes de réservation."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-6 flex max-w-md flex-wrap gap-2",
				onSubmit: (event) => {
					event.preventDefault();
					const value = input.trim();
					if (value) setCity(value);
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
						htmlFor: "ville-hebergement",
						className: "sr-only",
						children: "Ville ou destination"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "ville-hebergement",
						value: input,
						onChange: (event) => setInput(event.target.value),
						placeholder: "Ex. Marrakech, Lisbonne, Bangkok…",
						className: "flex-1"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Afficher la carte"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stay22Map, {
				className: "mt-10",
				city,
				title: `Hébergements à ${city}`,
				description: "Carte interactive des hôtels et locations, via notre partenaire Stay22. Les prix affichés proviennent des plateformes de réservation."
			})
		]
	});
}
//#endregion
export { HebergementPage as component };
