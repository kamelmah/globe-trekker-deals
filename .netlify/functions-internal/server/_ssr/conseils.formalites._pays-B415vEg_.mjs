import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { r as formatDateMedium } from "./dates-DNk5GF2y.mjs";
import { r as getCityGuide } from "./city-guides-B563V5AS.mjs";
import { t as Reveal } from "./Reveal-B9y2unCA.mjs";
import { t as TravelPartnersSection } from "./TravelPartners-DuBgRp2V.mjs";
import { n as countryPreposition } from "./travel-documents-CkbhbaWQ.mjs";
import { t as Route } from "./conseils.formalites._pays-CLR-6u68.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.formalites._pays-B415vEg_.js
var import_jsx_runtime = require_jsx_runtime();
function TravelDocumentPage() {
	const { doc } = Route.useLoaderData();
	const guides = doc.relatedGuideSlugs.map((slug) => getCityGuide(slug)).filter((g) => g !== void 0);
	const fields = [
		{
			label: "Visa",
			value: doc.visa
		},
		{
			label: "Passeport",
			value: doc.passport
		},
		{
			label: "Vaccins recommandés",
			value: doc.vaccines
		},
		{
			label: "Devise et formalités locales",
			value: doc.specifics
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "container-page max-w-3xl py-10",
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
					"/",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/conseils/formalites",
						className: "hover:text-foreground",
						children: "Formalités"
					}),
					" ",
					"/ ",
					doc.country
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "mt-3 font-display",
				children: [
					"Formalités pour voyager ",
					countryPreposition(doc.country),
					" ",
					doc.country
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Mis à jour le ", formatDateMedium(doc.updated)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-base text-muted-foreground",
				children: doc.intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: [
					"Ces informations sont données à titre indicatif pour les ressortissants français : les formalités changent régulièrement, vérifiez-les sur",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/",
						target: "_blank",
						rel: "noopener noreferrer",
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "France Diplomatie"
					}),
					" ",
					"avant de réserver."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
					className: "divide-y divide-border rounded-xl border border-border bg-card",
					children: fields.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
							className: "text-sm font-medium",
							children: field.label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", {
							className: "text-sm leading-relaxed text-muted-foreground",
							children: field.value
						})]
					}, field.label))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-xl font-semibold",
					children: "Bon à savoir"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground",
					children: doc.goodToKnow.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
				})] })
			}),
			guides.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-8",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-secondary/40 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-base font-semibold",
						children: [
							"Préparer votre séjour ",
							countryPreposition(doc.country),
							" ",
							doc.country
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-2 text-sm text-muted-foreground",
						children: [guides.map((guide) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/conseils/destinations/$city",
							params: { city: guide.slug },
							className: "font-medium text-primary underline-offset-2 hover:underline",
							children: [
								"Guide ",
								guide.city,
								" : que faire, budget, quand partir"
							]
						}) }, guide.slug)), doc.relatedDestinationSlugs.map((slug) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/vols/$slug",
							params: { slug },
							className: "font-medium text-primary underline-offset-2 hover:underline",
							children: "Voir les vols pas chers"
						}) }, slug))]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelPartnersSection, { partners: ["assurance"] })
			})
		]
	});
}
//#endregion
export { TravelDocumentPage as component };
