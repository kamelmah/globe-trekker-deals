import { i as __toESM } from "../_runtime.mjs";
import { _ as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn } from "./label-Cmix8ykc.mjs";
import { a as formatDateTimeLong, r as formatDateMedium, s as formatMonthCompact } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { n as cheapestDestinations } from "./flights.functions-2XDL4V6N.mjs";
import { s as secondaryAirport } from "./airports-DEvng4YS.mjs";
import { a as formatPrice } from "./trip-duration-Dr4Tuig8.mjs";
import { i as guideForRoutePage } from "./city-guides-B563V5AS.mjs";
import { n as getDestinationImage, t as ResponsivePicture } from "./destination-images-C1720lZ9.mjs";
import { a as todayPlus } from "./search-params-CajpETpS.mjs";
import { t as Reveal } from "./Reveal-B9y2unCA.mjs";
import { t as TravelPartnersSection } from "./TravelPartners-DuBgRp2V.mjs";
import { t as Stay22Map } from "./Stay22Map-ChdA7JX9.mjs";
import { t as withPreposition } from "./french-grammar-AJb2OW9K.mjs";
import { t as FaqAccordion } from "./FaqAccordion-C_uU-d1T.mjs";
import { n as useCurrency } from "./currency-context-BjWSGzF3.mjs";
import { t as ApiDebugPanel } from "./ApiDebugPanel-CXzqegmj.mjs";
import { t as AlertForm } from "./AlertForm-C4olTnID.mjs";
import { n as routeHeading, t as Route } from "./vols._slug-C1lg0DY2.mjs";
import { a as CartesianGrid, i as Area, n as YAxis, o as ResponsiveContainer, r as XAxis, s as Tooltip, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/vols._slug-d7C6uQFJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Aucun appel API au chargement de la page : le tarif temps réel n'est demandé
* qu'après un clic humain explicite (économie de quota et pages plus rapides).
*/
function LivePriceButton({ origin, destination, originCity, destinationCity }) {
	const fetchCheapest = useServerFn(cheapestDestinations);
	const { currency, format } = useCurrency();
	const [state, setState] = (0, import_react.useState)("idle");
	const [price, setPrice] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [debug, setDebug] = (0, import_react.useState)(null);
	async function load() {
		setState("loading");
		setError(null);
		try {
			const result = await fetchCheapest({ data: {
				origin,
				destinations: [destination],
				currency
			} });
			setPrice(result.prices[0]?.priceEur ?? null);
			setError(result.error);
			setDebug(result.debug ?? null);
		} catch {
			setError("Impossible de charger les tarifs pour le moment, réessayez plus tard.");
			setPrice(null);
		} finally {
			setState("done");
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs text-muted-foreground",
				children: "Tarif en direct"
			}),
			state !== "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: [
					"Les tarifs ",
					originCity,
					" — ",
					destinationCity,
					" sont interrogés uniquement à votre demande."
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-3",
				onClick: load,
				disabled: state === "loading",
				children: state === "loading" ? "Recherche en cours…" : "Voir les tarifs en direct aujourd'hui"
			})] }),
			state === "done" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				price !== null ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 font-display text-2xl font-semibold text-primary",
					children: format(price)
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted-foreground",
					children: "Aucun vol trouvé pour cette recherche, essayez d'autres dates."
				}),
				error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-xs text-destructive",
					children: error
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "outline",
					size: "sm",
					className: "mt-3",
					onClick: load,
					children: "Actualiser"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiDebugPanel, { debug })
			] })
		]
	});
}
function monthLabel(month) {
	`${month}`;
	return formatMonthCompact(month);
}
function PriceHistoryChart({ months }) {
	const { format } = useCurrency();
	const data = months.map((m) => ({
		...m,
		label: monthLabel(m.month)
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "h-64 w-full",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
			width: "100%",
			height: "100%",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
				data,
				margin: {
					top: 8,
					right: 8,
					left: 0,
					bottom: 0
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
						id: "priceFill",
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "0%",
							stopColor: "var(--color-primary)",
							stopOpacity: .35
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
							offset: "100%",
							stopColor: "var(--color-primary)",
							stopOpacity: .03
						})]
					}) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartesianGrid, {
						strokeDasharray: "3 3",
						stroke: "var(--color-border)",
						vertical: false
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
						dataKey: "label",
						tick: { fontSize: 12 },
						stroke: "var(--color-muted-foreground)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
						tick: { fontSize: 12 },
						stroke: "var(--color-muted-foreground)",
						width: 56,
						tickFormatter: (value) => format(value)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						formatter: (value) => [format(value), "Prix le plus bas"],
						contentStyle: {
							borderRadius: 12,
							border: "1px solid var(--color-border)",
							background: "var(--color-card)",
							fontSize: 13
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
						type: "monotone",
						dataKey: "priceEur",
						stroke: "var(--color-primary)",
						strokeWidth: 2,
						fill: "url(#priceFill)"
					})
				]
			})
		})
	});
}
/** Date de relevé en toutes lettres, ex. « 28 août 2026 ». */
var formatObservedDate = formatDateTimeLong;
function DestinationPage() {
	const { route, lowestObserved, lowestObservedAt, related, saison } = Route.useLoaderData();
	const banner = getDestinationImage(route.destination, route.destinationCity);
	const guide = guideForRoutePage(route.slug, route.destination);
	const moisDeDepart = saison?.points.map((p) => ({
		month: p.month,
		priceEur: p.priceEur,
		...p.observedAt ? { updatedAt: p.observedAt } : {}
	})) ?? [];
	const heading = routeHeading(route.originCity, route.destinationCity);
	const aeroportEloigne = secondaryAirport(route.observedOriginAirport) ?? secondaryAirport(route.observedDestinationAirport);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "container-page py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
				className: "text-xs text-muted-foreground",
				"aria-label": "Fil d'ariane",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-foreground",
						children: "Accueil"
					}),
					" ",
					"/ Vols pas chers ",
					route.originCity,
					" — ",
					route.destinationCity
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative mt-4 overflow-hidden rounded-2xl border border-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
						src: banner.src,
						webp: banner.webp,
						alt: banner.alt,
						width: 1200,
						height: 630,
						className: "h-44 w-full object-cover sm:h-64 lg:h-80"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent",
						"aria-hidden": true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "absolute inset-x-0 bottom-0 p-4 font-display text-white drop-shadow sm:p-6",
						children: heading
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 max-w-3xl text-base text-muted-foreground",
				children: route.intro
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Prix de référence"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 font-display text-2xl font-semibold text-primary",
							children: lowestObserved ? route.simulatedLowestPrice ? `Dès ${route.simulatedLowestPrice}€` : `Dès ${formatPrice(lowestObserved)}` : "Historique en constitution"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: lowestObservedAt ? `Relevé le ${formatObservedDate(lowestObservedAt)}, taxes incluses. Repère indicatif, distinct de l'historique mesuré ci-dessous.` : "Repère indicatif taxes incluses, distinct de l'historique mesuré ci-dessous"
						}),
						aeroportEloigne && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1.5 inline-flex items-start gap-1 text-xs text-warning-foreground",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded bg-warning px-1.5 py-0.5",
								children: [
									"Ce tarif part de ",
									aeroportEloigne.code,
									", à ",
									aeroportEloigne.distanceKm,
									" km de",
									" ",
									aeroportEloigne.city,
									" — ",
									aeroportEloigne.access,
									" à prévoir."
								]
							})
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: "Durée de vol"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-base font-semibold",
						children: route.averageDuration
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LivePriceButton, {
					origin: route.origin,
					destination: route.destination,
					originCity: route.originCity,
					destinationCity: route.destinationCity
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: "Comparer avec vos dates"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted-foreground",
							children: "Prix total taxes incluses, vendeur affiché, lien direct vers ce vendeur."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							className: "mt-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/recherche",
								search: {
									origin: route.origin,
									destination: route.destination,
									depart: todayPlus(30),
									retour: "",
									duree: 0,
									flexible: 1,
									budget: 0,
									adultes: 1,
									enfants: 0,
									bebes: 0
								},
								children: [
									"Comparer les vols ",
									route.originCity,
									" — ",
									route.destinationCity
								]
							})
						})
					]
				})]
			}),
			guide && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-6 rounded-xl border border-primary/30 bg-primary/5 p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
						className: "font-display text-base font-semibold",
						children: ["Découvrez notre guide complet ", withPreposition("de", guide.city)]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "Meilleure période pour visiter, quartiers à voir, budget moyen sur place, transports, monnaie et formalités : tout ce qu'il faut savoir avant de réserver."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/conseils/destinations/$city",
						params: { city: guide.slug },
						className: "mt-3 inline-block text-sm font-medium text-primary underline-offset-2 hover:underline",
						children: [
							"Lire le guide « Que faire ",
							withPreposition("à", guide.city),
							" »"
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-10 grid gap-10 lg:grid-cols-[1fr_360px]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					route.sections.map((section) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						className: "mt-8 first:mt-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: section.heading
						}), section.paragraphs.map((paragraph) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-sm leading-relaxed text-muted-foreground",
							children: paragraph
						}, paragraph.slice(0, 40)))] })
					}, section.heading)),
					saison && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-xl font-semibold",
								children: [
									"Quand partir ",
									withPreposition("de", route.originCity),
									" ",
									withPreposition("à", route.destinationCity)
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: saison.sentence
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4 rounded-xl border border-border bg-card p-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceHistoryChart, { months: moisDeDepart })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: [
									"Prix le plus bas relevé pour chaque mois de départ",
									saison.latestObservedAt ? `, dernier relevé le ${formatDateMedium(saison.latestObservedAt.slice(0, 10))}` : "",
									". Les mois sans relevé restent absents plutôt que comblés par une estimation."
								]
							})
						] })
					}),
					related.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
								className: "font-display text-xl font-semibold",
								children: ["Autres destinations depuis ", route.originCity]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm text-muted-foreground",
								children: [
									"Prix les plus bas déjà relevés depuis ",
									route.originCity,
									", taxes incluses. Chaque lien mène à la fiche complète du trajet."
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-4 grid gap-2 sm:grid-cols-2",
								children: related.map((item) => {
									const thumb = getDestinationImage(null, item.city, item.country);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/vols/$slug",
										params: { slug: item.slug },
										className: "flex items-center gap-3 rounded-lg border border-border bg-card p-3 text-sm transition-colors hover:bg-secondary",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
												src: thumb.thumb,
												webp: thumb.thumbWebp,
												alt: thumb.alt,
												loading: "lazy",
												width: 96,
												height: 72,
												className: "size-12 shrink-0 rounded-md object-cover"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "min-w-0 flex-1",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "block truncate font-medium",
													children: [
														route.originCity,
														" — ",
														item.city
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "block truncate text-xs text-muted-foreground",
													children: item.country
												})]
											}),
											item.priceEur !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-semibold text-primary",
												children: ["dès ", formatPrice(item.priceEur)]
											})
										]
									}) }, item.slug);
								})
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, {
						className: "mt-10",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-xl font-semibold",
							children: "Questions fréquentes"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqAccordion, { items: route.faq })
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stay22Map, {
						className: "mt-12",
						city: route.destinationCity,
						title: `Trouvez aussi votre hébergement à ${route.destinationCity}`,
						description: `Hôtels, appartements et auberges disponibles à ${route.destinationCity}, affichés sur une carte. Les prix proviennent directement des plateformes de réservation.`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelPartnersSection, {
						className: "mt-10",
						partners: [
							"esim",
							"assurance",
							"voiture"
						]
					})
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertForm, {
						origin: route.origin,
						destination: route.destination,
						referencePrice: lowestObserved
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-base font-semibold text-foreground",
								children: "Pas encore décidé sur la destination ?"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2",
								children: "Le mode budget affiche sur une carte toutes les villes accessibles avec la somme que vous voulez dépenser."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								className: "mt-4",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/mode-budget",
									search: {
										origin: route.origin,
										budget: 400,
										month: "",
										adultes: 1,
										enfants: 0,
										bebes: 0
									},
									children: "Explorer par budget"
								})
							})
						]
					})]
				})]
			})
		]
	});
}
//#endregion
export { DestinationPage as component };
