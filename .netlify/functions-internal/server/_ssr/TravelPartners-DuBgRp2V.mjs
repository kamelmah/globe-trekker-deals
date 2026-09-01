import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { a as YESIM_URL, i as KLOOK_URL, n as EKTA_URL, r as GETRENTACAR_URL } from "./affiliate-partners-ihZENUB-.mjs";
import { M as Car, c as ShieldCheck, n as Wifi, v as MapPinned } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/TravelPartners-DuBgRp2V.js
var import_jsx_runtime = require_jsx_runtime();
/**
* Simples liens sortants (jamais d'iframe), ouverts en nouvel onglet : pas de
* script ni de contenu tiers chargé sur nos pages, donc pas de gate cookies
* nécessaire ici (contrairement à Stay22).
*/
var PARTNERS = {
	esim: {
		icon: Wifi,
		partnerName: "Yesim",
		title: "Rester connecté sur place",
		description: "Une eSIM internationale à activer avant de partir, pour éviter les frais d'itinérance à l'arrivée.",
		href: YESIM_URL
	},
	assurance: {
		icon: ShieldCheck,
		partnerName: "EKTA",
		title: "Voyagez assuré",
		description: "Annulation, bagages perdus, frais médicaux à l'étranger : une couverture à comparer avant de partir.",
		href: EKTA_URL
	},
	voiture: {
		icon: Car,
		partnerName: "GetRentacar.com",
		title: "Louer une voiture sur place",
		description: "Comparez les loueurs disponibles à destination pour la durée de votre séjour.",
		href: GETRENTACAR_URL
	},
	activites: {
		icon: MapPinned,
		partnerName: "Klook",
		title: "Activités et visites à faire sur place",
		description: "Excursions, musées et activités à réserver à l'avance, souvent moins chers qu'en les achetant sur place.",
		href: KLOOK_URL
	}
};
/** Rangée compacte de compléments de voyage (eSIM, assurance, location de voiture). */
function TravelPartnersSection({ partners, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "font-display text-xl font-semibold",
			children: "Pour compléter votre voyage"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: `mt-4 grid gap-4 sm:grid-cols-2 ${partners.length >= 4 ? "lg:grid-cols-4" : partners.length === 3 ? "lg:grid-cols-3" : ""}`,
			children: partners.map((id) => {
				const partner = PARTNERS[id];
				const Icon = partner.icon;
				const hasLongPartnerName = partner.partnerName.length > 10;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "size-5 text-primary",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "truncate text-[11px] font-medium uppercase tracking-wide text-muted-foreground",
								children: partner.partnerName
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "mt-3 text-sm font-semibold",
							children: partner.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 text-xs text-muted-foreground",
							children: partner.description
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							size: "sm",
							className: "mt-3 h-auto min-h-8 w-full whitespace-normal px-3 py-1.5 text-center leading-snug",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: partner.href,
								target: "_blank",
								rel: "noopener noreferrer nofollow sponsored",
								children: hasLongPartnerName ? "Voir les offres" : `Voir les offres ${partner.partnerName}`
							})
						})
					]
				}, id);
			})
		})]
	});
}
//#endregion
export { TravelPartnersSection as t };
