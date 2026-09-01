import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { c as formatMonthLong, o as formatDateTimeShort, r as formatDateMedium } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { n as getDestinationImage, t as ResponsivePicture } from "./destination-images-C1720lZ9.mjs";
import { a as todayPlus } from "./search-params-CajpETpS.mjs";
import { t as Reveal } from "./Reveal-B9y2unCA.mjs";
import { t as TravelPartnersSection } from "./TravelPartners-DuBgRp2V.mjs";
import { t as Stay22Map } from "./Stay22Map-ChdA7JX9.mjs";
import { i as getTravelDocumentForGuide } from "./travel-documents-CkbhbaWQ.mjs";
import { t as Route } from "./conseils.destinations._city-D3CwfRhV.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/conseils.destinations._city-BslGBi4K.js
var import_jsx_runtime = require_jsx_runtime();
/** "2026-12" → "décembre 2026" (aucune donnée inventée, simple libellé). */
function formatMonthLabel(month) {
	return formatMonthLong(month) || month;
}
function CityGuidePage() {
	const { guide, price } = Route.useLoaderData();
	const image = getDestinationImage(guide.destination, guide.city);
	const travelDocument = getTravelDocumentForGuide(guide.slug);
	const practical = [
		{
			label: "Monnaie",
			value: guide.practical.monnaie
		},
		{
			label: "Langue",
			value: guide.practical.langue
		},
		{
			label: "Formalités pour les Français",
			value: guide.practical.visa
		},
		{
			label: "Transports sur place",
			value: guide.practical.transport
		},
		{
			label: "Budget moyen sur place",
			value: guide.practical.budgetJour
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
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
					"/",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/conseils/destinations",
						className: "hover:text-foreground",
						children: "Guides destinations"
					}),
					" ",
					"/ ",
					guide.city
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4 overflow-hidden rounded-2xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
						src: image.src,
						webp: image.webp,
						alt: image.alt,
						width: 1200,
						height: 630,
						className: "h-44 w-full object-cover sm:h-64"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "absolute inset-x-0 bottom-0 p-4 font-display text-white drop-shadow sm:p-6",
						children: guide.title
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					guide.readingMinutes,
					" min de lecture · guide mis à jour le",
					" ",
					formatDateMedium(guide.updated),
					price.updatedAt ? ` · prix des vols relevés le ${formatDateTimeShort(price.updatedAt)}` : ""
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-3xl text-base text-muted-foreground",
				children: guide.intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-10 lg:grid-cols-[1fr_340px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "max-w-3xl",
					children: [
						guide.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							className: "mt-8 first:mt-0",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: section.heading
							}), section.paragraphs.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-sm leading-relaxed text-muted-foreground",
								children: paragraph
							}, paragraph.slice(0, 40)))] })
						}, section.heading)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							className: "mt-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-xl font-semibold",
								children: "Informations pratiques en résumé"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dl", {
								className: "mt-4 divide-y divide-border rounded-xl border border-border bg-card",
								children: practical.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid gap-1 p-4 sm:grid-cols-[220px_1fr] sm:gap-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
										className: "text-sm font-medium",
										children: item.label
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dd", {
										className: "text-sm text-muted-foreground",
										children: [item.value, item.label === "Formalités pour les Français" && travelDocument && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
											to: "/conseils/formalites/$pays",
											params: { pays: travelDocument.slug },
											className: "font-medium text-primary underline-offset-2 hover:underline",
											children: [
												"Détail des formalités (",
												travelDocument.country,
												")"
											]
										})] })]
									})]
								}, item.label))
							})] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							className: "mt-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "font-display text-xl font-semibold",
									children: ["Budget sur place : où dormir à ", guide.city]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 text-sm leading-relaxed text-muted-foreground",
									children: [
										"L'hébergement est souvent le premier poste de dépense du budget sur place. La carte ci-dessous affiche des hôtels et locations à ",
										guide.city,
										" avec leurs prix, pour vous aider à estimer le coût réel de votre séjour."
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stay22Map, {
									className: "mt-4",
									city: guide.city,
									title: `Hébergements à ${guide.city}`,
									description: `Carte interactive des hôtels et locations à ${guide.city} (via notre partenaire Stay22).`
								})
							] })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
							className: "mt-10",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelPartnersSection, { partners: [
								"esim",
								"assurance",
								"voiture",
								"activites"
							] })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4 lg:sticky lg:top-24 lg:self-start",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-secondary/40 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-base font-semibold",
								children: [
									"Comparer les vols ",
									guide.originCity,
									" — ",
									guide.city
								]
							}),
							price.lowestEur ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									"Prix le plus bas relevé par notre source de prix :",
									" ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
										className: "text-foreground",
										children: [price.lowestEur, " €"]
									}),
									price.month ? ` (départ en ${formatMonthLabel(price.month)})` : "",
									price.updatedAt ? `, relevé le ${formatDateTimeShort(price.updatedAt)}` : "",
									"."
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Aucun prix n'a encore été relevé sur ce trajet : lancez une recherche pour obtenir les tarifs du moment."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Prix total taxes incluses, vendeur réel affiché sur chaque résultat, lien direct vers ce vendeur."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								className: "mt-4 w-full",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/recherche",
									search: {
										origin: guide.origin,
										destination: guide.destination,
										depart: todayPlus(30),
										retour: "",
										duree: 0,
										flexible: 1,
										budget: 0,
										adultes: 1,
										enfants: 0,
										bebes: 0
									},
									children: ["Chercher un vol pour ", guide.city]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/vols/$slug",
								params: { slug: guide.routeSlug },
								className: "mt-3 block text-sm font-medium text-primary underline-offset-2 hover:underline",
								children: [
									"Voir la fiche prix ",
									guide.originCity,
									" — ",
									guide.city
								]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-base font-semibold",
								children: "Pas encore décidé ?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: "Indiquez votre budget et découvrez toutes les villes accessibles depuis votre aéroport."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/mode-budget",
								search: {
									origin: guide.origin,
									budget: 400,
									month: "",
									adultes: 1,
									enfants: 0,
									bebes: 0
								},
								className: "mt-3 block text-sm font-medium text-primary underline-offset-2 hover:underline",
								children: "Explorer par budget"
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
export { CityGuidePage as component };
