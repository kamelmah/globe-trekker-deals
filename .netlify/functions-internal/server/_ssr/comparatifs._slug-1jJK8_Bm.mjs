import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { o as formatDateTimeShort, r as formatDateMedium } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { a as isGuidePruned, o as isRoutePruned } from "./pruned-pages-CLTc2P-L.mjs";
import { n as getDestinationImage, t as ResponsivePicture } from "./destination-images-C1720lZ9.mjs";
import { a as todayPlus } from "./search-params-CajpETpS.mjs";
import { t as Route } from "./comparatifs._slug-Bq1nTR6M.mjs";
import { t as Reveal } from "./Reveal-B9y2unCA.mjs";
import { t as TravelPartnersSection } from "./TravelPartners-DuBgRp2V.mjs";
import { t as Stay22Map } from "./Stay22Map-ChdA7JX9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/comparatifs._slug-1jJK8_Bm.js
var import_jsx_runtime = require_jsx_runtime();
/** Bloc "carte + lien vers le guide et les vols" pour un côté du comparatif. */
function CitySidePanel({ side, guide, destination, price }) {
	const image = getDestinationImage(destination.destination, guide.city);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
				src: image.thumb,
				webp: image.thumbWebp,
				alt: image.alt,
				loading: "lazy",
				width: 320,
				height: 180,
				className: "h-32 w-full rounded-lg object-cover"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "mt-3 font-display text-base font-semibold",
				children: guide.city
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: guide.country
			}),
			price.lowestEur ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"Dès ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
						className: "text-foreground",
						children: [price.lowestEur, " €"]
					}),
					" l'aller-retour depuis",
					" ",
					destination.originCity,
					price.updatedAt ? ` (relevé le ${formatDateTimeShort(price.updatedAt)})` : "",
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-sm text-muted-foreground",
				children: [
					"Aucun prix encore relevé depuis ",
					destination.originCity,
					" : lancez une recherche pour voir les tarifs du moment."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 flex flex-col gap-2",
				children: [!isGuidePruned(guide.slug) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/conseils/destinations/$city",
					params: { city: guide.slug },
					className: "text-sm font-medium text-primary underline-offset-2 hover:underline",
					children: ["Voir le guide ", guide.city]
				}), !isRoutePruned(side.destinationSlug) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/vols/$slug",
					params: { slug: side.destinationSlug },
					className: "text-sm font-medium text-primary underline-offset-2 hover:underline",
					children: [
						"Voir les vols ",
						destination.originCity,
						" — ",
						guide.city
					]
				})]
			})
		]
	});
}
function ComparisonPage() {
	const { comparison, guideA, guideB, destA, destB, priceA, priceB } = Route.useLoaderData();
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
						to: "/comparatifs",
						className: "hover:text-foreground",
						children: "Comparatifs"
					}),
					" ",
					"/ ",
					guideA.city,
					" ou ",
					guideB.city
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-3 max-w-3xl font-display",
				children: comparison.title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: ["Mis à jour le ", formatDateMedium(comparison.updated)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-3xl text-base text-muted-foreground",
				children: comparison.intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitySidePanel, {
					side: comparison.cityA,
					guide: guideA,
					destination: destA,
					price: priceA
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CitySidePanel, {
					side: comparison.cityB,
					guide: guideB,
					destination: destB,
					price: priceB
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "max-w-4xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: "Comparatif en un coup d'œil"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 overflow-x-auto rounded-xl border border-border",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
							className: "w-full min-w-[560px] border-collapse text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
								className: "bg-secondary/40 text-left",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 font-medium",
										children: "Critère"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 font-medium",
										children: guideA.city
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
										className: "p-3 font-medium",
										children: guideB.city
									})
								]
							}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", {
								className: "divide-y divide-border",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top font-medium",
											children: "Prix vol observé"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: priceA.lowestEur ? `Dès ${priceA.lowestEur} € depuis ${destA.originCity}` : "Aucun relevé pour l'instant"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: priceB.lowestEur ? `Dès ${priceB.lowestEur} € depuis ${destB.originCity}` : "Aucun relevé pour l'instant"
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top font-medium",
											children: "Durée de vol"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: destA.averageDuration
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: destB.averageDuration
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top font-medium",
											children: "Budget sur place"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: guideA.practical.budgetJour
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: guideB.practical.budgetJour
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top font-medium",
											children: "Climat"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: comparison.table.climat[0]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: comparison.table.climat[1]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top font-medium",
											children: "Ambiance"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: comparison.table.ambiance[0]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: comparison.table.ambiance[1]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top font-medium",
											children: "Activités phares"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "list-disc space-y-1 pl-4",
												children: comparison.table.activites[0].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
											})
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 align-top text-muted-foreground",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
												className: "list-disc space-y-1 pl-4",
												children: comparison.table.activites[1].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: item }, item))
											})
										})
									] })
								]
							})]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-10 max-w-3xl",
				children: comparison.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
					className: "mt-8 first:mt-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-xl font-semibold",
						children: section.heading
					}), section.paragraphs.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: paragraph
					}, paragraph.slice(0, 40)))] })
				}, section.heading))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10 max-w-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "rounded-xl border border-border bg-secondary/40 p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold",
						children: "Notre avis en résumé"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "mt-3 space-y-3 text-sm text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-foreground",
								children: [guideA.city, "."]
							}),
							" ",
							comparison.verdict.forCityA
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
								className: "text-foreground",
								children: [guideB.city, "."]
							}),
							" ",
							comparison.verdict.forCityB
						] })]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10 max-w-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-xl font-semibold",
						children: [
							"Où dormir : ",
							guideA.city,
							" et ",
							guideB.city
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-sm leading-relaxed text-muted-foreground",
						children: "Un aperçu des prix d'hébergement sur les deux destinations, pour affiner votre choix avant de réserver."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-6 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stay22Map, {
							city: guideA.city,
							title: `Hébergements à ${guideA.city}`,
							description: `Carte interactive des hôtels et locations à ${guideA.city} (via notre partenaire Stay22).`,
							id: "hebergement-a"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stay22Map, {
							city: guideB.city,
							title: `Hébergements à ${guideB.city}`,
							description: `Carte interactive des hôtels et locations à ${guideB.city} (via notre partenaire Stay22).`,
							id: "hebergement-b"
						})]
					})
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
				className: "mt-10 max-w-3xl",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelPartnersSection, { partners: ["activites"] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 max-w-3xl rounded-xl border border-border bg-card p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display text-base font-semibold",
						children: "Toujours indécis ?"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"Indiquez votre budget et découvrez toutes les villes accessibles depuis votre aéroport,",
							" ",
							guideA.city,
							" et ",
							guideB.city,
							" comprises."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/recherche",
								search: {
									origin: destA.origin,
									destination: destA.destination,
									depart: todayPlus(45),
									retour: "",
									duree: 0,
									flexible: 1,
									budget: 0,
									adultes: 1,
									enfants: 0,
									bebes: 0
								},
								children: ["Chercher un vol pour ", guideA.city]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "sm",
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/recherche",
								search: {
									origin: destB.origin,
									destination: destB.destination,
									depart: todayPlus(45),
									retour: "",
									duree: 0,
									flexible: 1,
									budget: 0,
									adultes: 1,
									enfants: 0,
									bebes: 0
								},
								children: ["Chercher un vol pour ", guideB.city]
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { ComparisonPage as component };
