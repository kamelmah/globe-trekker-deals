import { i as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { n as useCookieConsent } from "./cookie-consent-context-B4K0ucXm.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/Stay22Map-ChdA7JX9.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Identifiant d'affiliation Stay22 (Let Me Allez). */
var STAY22_LMA_ID = "6a94b04440e01477bf8d234c";
/** Délai maximum d'attente du chargement de l'iframe Stay22 (ms). */
var LOAD_TIMEOUT_MS = 7e3;
/**
* Carte d'hébergement Stay22, pré-configurée sur une ville (et des dates si connues).
* Le chargement de l'iframe est différé jusqu'à ce que la section entre dans le viewport,
* afin de ne pas ralentir l'affichage initial de la page. Si le widget ne charge pas
* dans un délai raisonnable, un état de repli propose d'ouvrir la carte dans un nouvel onglet.
*/
function Stay22Map({ city, checkin, checkout, title, description, className, id = "hebergement" }) {
	const containerRef = (0, import_react.useRef)(null);
	const [visible, setVisible] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const timeoutRef = (0, import_react.useRef)(null);
	const { consent, savePreferences } = useCookieConsent();
	const mapsConsent = consent?.maps === true;
	(0, import_react.useEffect)(() => {
		const node = containerRef.current;
		if (!node || visible) return;
		if (typeof IntersectionObserver === "undefined") {
			setVisible(true);
			return;
		}
		const observer = new IntersectionObserver((entries) => {
			if (entries.some((entry) => entry.isIntersecting)) {
				setVisible(true);
				observer.disconnect();
			}
		}, { rootMargin: "300px" });
		observer.observe(node);
		return () => observer.disconnect();
	}, [visible]);
	/**
	* Script d'affiliation Stay22 (letmeallez.js).
	*
	* Il était injecté depuis la racine de l'application : il se chargeait donc
	* sur toutes les pages, y compris celles sans carte d'hébergement, pour y
	* poser du suivi et réécrire des liens. Il vit maintenant ici, et à trois
	* conditions cumulées — une carte est présente, elle est entrée dans le champ
	* de vision, et le consentement « Cartes Stay22 » est accordé.
	*
	* L'iframe elle-même n'en dépend pas : elle porte son propre `aid`. Ce script
	* ne sert qu'à l'attribution des liens hors iframe.
	*/
	(0, import_react.useEffect)(() => {
		if (!visible || !mapsConsent) return;
		if (document.getElementById("stay22-letmeallez")) return;
		const w = window;
		w.Stay22 = w.Stay22 ?? {};
		w.Stay22.params = { lmaID: STAY22_LMA_ID };
		const script = document.createElement("script");
		script.id = "stay22-letmeallez";
		script.async = true;
		script.src = "https://scripts.stay22.com/letmeallez.js";
		document.head.appendChild(script);
	}, [visible, mapsConsent]);
	const src = (0, import_react.useMemo)(() => {
		const params = new URLSearchParams({
			aid: STAY22_LMA_ID,
			address: city,
			hidefooter: "true",
			hideallezbutton: "true",
			currency: "EUR",
			supportedlang: "fr",
			unitsystem: "metric"
		});
		if (checkin) params.set("checkin", checkin);
		if (checkout) params.set("checkout", checkout);
		return `https://www.stay22.com/embed/gm?${params.toString()}`;
	}, [
		city,
		checkin,
		checkout
	]);
	(0, import_react.useEffect)(() => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		if (!visible || !mapsConsent) {
			setStatus("idle");
			return;
		}
		setStatus("loading");
		timeoutRef.current = setTimeout(() => {
			setStatus("error");
		}, LOAD_TIMEOUT_MS);
		return () => {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
				timeoutRef.current = null;
			}
		};
	}, [
		visible,
		src,
		mapsConsent
	]);
	const handleLoad = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setStatus("loaded");
	};
	const handleError = () => {
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
			timeoutRef.current = null;
		}
		setStatus("error");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		ref: containerRef,
		id,
		className: `scroll-mt-24 ${className ?? ""}`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-semibold",
				children: title
			}),
			description && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: description
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-hidden rounded-xl border border-border bg-card",
				children: !mapsConsent ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-[420px] w-full flex-col items-center justify-center gap-4 p-6 text-center sm:h-[520px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "max-w-sm text-sm text-muted-foreground",
						children: "Cette carte est fournie par notre partenaire Stay22 et dépose des cookies tiers. Elle ne s'affiche qu'avec votre accord."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => savePreferences({ maps: true }),
						size: "sm",
						children: "Autoriser les cartes Stay22"
					})]
				}) : visible ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative h-[420px] w-full sm:h-[520px]",
					children: [
						status !== "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("iframe", {
							src,
							title,
							loading: "lazy",
							sandbox: "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox",
							referrerPolicy: "no-referrer-when-downgrade",
							onLoad: handleLoad,
							onError: handleError,
							className: `absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${status === "loaded" ? "opacity-100" : "opacity-0"}`
						}),
						status === "loading" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "absolute inset-0 animate-pulse bg-secondary",
							role: "status",
							"aria-label": "Chargement de la carte des hébergements"
						}),
						status === "error" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex h-full flex-col items-center justify-center gap-4 p-6 text-center",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "La carte met du temps à charger"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
									href: src,
									target: "_blank",
									rel: "noopener noreferrer",
									"aria-label": `Voir les hébergements à ${city} dans un nouvel onglet`,
									children: ["Voir les hébergements à ", city]
								})
							})]
						})
					]
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-[420px] w-full animate-pulse bg-secondary sm:h-[520px]",
					role: "status",
					"aria-label": "Chargement de la carte des hébergements"
				})
			})
		]
	});
}
//#endregion
export { Stay22Map as t };
