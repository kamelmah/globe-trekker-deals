import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { n as useCookieConsent } from "./cookie-consent-context-B4K0ucXm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cookies-CFmm8upQ.js
var import_jsx_runtime = require_jsx_runtime();
function CookiesPage() {
	const { openManager } = useCookieConsent();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "container-page max-w-3xl py-12",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-semibold",
				children: "Gestion des cookies"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: "Dernière mise à jour : 2026-08-31."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-muted-foreground",
				children: "Cette page liste précisément les cookies et technologies similaires utilisés par TrouveMonVol au moment de la rédaction. Nous ne décrivons ici que ce qui est réellement en place : aucun outil de mesure d'audience (type Google Analytics) n'est actuellement intégré au site."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-xl font-semibold",
				children: "Cookies strictement nécessaires"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Stockés localement dans votre navigateur (localStorage), sans consentement requis :"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
				className: "mt-2 list-disc space-y-1 pl-5 text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Devise d'affichage choisie" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Thème clair ou sombre choisi" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Votre choix de consentement aux cookies lui-même (catégories ci-dessous), pendant 13 mois maximum" })
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-xl font-semibold",
				children: "Cartes d'hébergement Stay22 (nécessite votre accord)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Les pages Hébergement et les guides destination intègrent une carte interactive fournie par notre partenaire Stay22, ainsi qu'un script d'affiliation associé. Ce sont des cookies tiers déposés par stay22.com, pas par TrouveMonVol : ils ne se chargent que si vous avez accepté cette catégorie. Refuser n'empêche pas d'utiliser le reste du site — vous pouvez toujours rechercher et comparer des vols normalement."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-xl font-semibold",
				children: "Cookies déposés par nos partenaires de réservation"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Quand vous cliquez sur « Réserver » vers une compagnie ou une agence, vous quittez TrouveMonVol : c'est ce site partenaire qui dépose alors ses propres cookies (permettant notamment de rattacher une éventuelle réservation à votre visite). Nous n'avons pas la main sur ces cookies-là ; c'est ce mécanisme d'affiliation qui finance le site, sans surcoût pour vous ni influence sur l'ordre des résultats."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "mt-8 font-display text-xl font-semibold",
				children: "Modifier votre choix"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-muted-foreground",
				children: "Vous pouvez revenir sur votre choix à tout moment, sans avoir à vider votre cache :"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				onClick: openManager,
				variant: "outline",
				className: "mt-3",
				children: "Gérer mes cookies"
			})
		]
	});
}
//#endregion
export { CookiesPage as component };
