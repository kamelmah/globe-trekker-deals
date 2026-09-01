import { i as __toESM } from "../_runtime.mjs";
import { _ as Link, y as useRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn } from "./label-Cmix8ykc.mjs";
import { o as formatDateTimeShort } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { s as secondaryAirport } from "./airports-DEvng4YS.mjs";
import { r as PRUNED_ROUTE_SLUGS, s as withoutPruned } from "./pruned-pages-CLTc2P-L.mjs";
import { n as getDestinationImage, t as ResponsivePicture } from "./destination-images-C1720lZ9.mjs";
import { f as routesFrom, r as DESTINATIONS } from "./route-whitelist-w8ea1sr9.mjs";
import { t as Reveal } from "./Reveal-B9y2unCA.mjs";
import { R as BadgeEuro, _ as Map, c as ShieldCheck, d as RefreshCw, o as Store, w as EyeOff } from "../_libs/lucide-react.mjs";
import { t as FaqAccordion } from "./FaqAccordion-C_uU-d1T.mjs";
import { n as useCurrency } from "./currency-context-BjWSGzF3.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as SearchForm } from "./SearchForm-CDIOh918.mjs";
import { n as Route, t as HOME_FAQ } from "./routes-Deo91hhv.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-D_3zKrgs.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var hero_sky_default$1 = "/assets/hero-sky-1Q8vO-zf.jpg";
var hero_sky_default = "/assets/hero-sky-BUW9fy21.webp";
var hero_sky_640_default$1 = "/assets/hero-sky-640-D1Rtfhu1.jpg";
var hero_sky_640_default = "/assets/hero-sky-640-DlaXaBnc.webp";
var hero_sky_960_default$1 = "/assets/hero-sky-960-CcEpgnXZ.jpg";
var hero_sky_960_default = "/assets/hero-sky-960-FTgP7LX2.webp";
var hero_sky_1280_default$1 = "/assets/hero-sky-1280-BylI0v4Y.jpg";
var hero_sky_1280_default = "/assets/hero-sky-1280-BQ56M3Dz.webp";
function DestinationPriceGrid({ prices, origin, error }) {
	const { format } = useCurrency();
	const sorted = [...prices].sort((a, b) => a.priceEur - b.priceEur);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
			children: error
		}),
		!error && sorted.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground",
			children: "Aucun prix disponible pour le moment sur ces destinations. Essayez d'autres dates depuis le formulaire de recherche."
		}),
		sorted.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
			children: sorted.map((price) => {
				const image = getDestinationImage(price.destination, price.city, price.country);
				const depart = secondaryAirport(price.originAirport);
				const arrivee = secondaryAirport(price.destinationAirport);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/recherche",
					search: {
						origin,
						destination: price.destination,
						depart: price.departureAt.slice(0, 10),
						retour: "",
						duree: 0,
						flexible: 1,
						budget: 0,
						adultes: 1,
						enfants: 0,
						bebes: 0
					},
					className: "flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-secondary",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
							src: image.thumb,
							webp: image.thumbWebp,
							alt: image.alt,
							loading: "lazy",
							width: 112,
							height: 80,
							className: "size-14 shrink-0 rounded-lg object-cover sm:h-16 sm:w-20"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "min-w-0 flex-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "block truncate text-sm font-semibold",
									children: price.city
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block truncate text-xs text-muted-foreground",
									children: [
										price.country,
										" · ",
										price.airline
									]
								}),
								(depart || arrivee) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "mt-0.5 block truncate text-xs text-warning-foreground",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "rounded bg-warning px-1 py-0.5",
										children: [
											(depart ?? arrivee).code,
											" à ",
											(depart ?? arrivee).distanceKm,
											" km de",
											" ",
											(depart ?? arrivee).city
										]
									})
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-lg font-semibold text-primary",
							children: format(price.priceEur)
						})
					]
				}) }, price.destination);
			})
		})
	] });
}
/** État public de la mise à jour des prix (dernière et prochaine échéance). */
var priceRefreshState = createServerFn({ method: "GET" }).handler(createSsrRpc("4ab1ada93fa9eab2e277e023e04b661265bdc4774e82066a3330cf29227538f3"));
/**
* Rafraîchissement immédiat déclenché par un clic humain. Un délai minimum est
* appliqué pour ne pas gaspiller le quota de l'API de prix.
*/
var refreshPricesNow = createServerFn({ method: "POST" }).handler(createSsrRpc("9e36ca9ee8b5cd8f3c07b1a3a3f79c82a669c1540cf6ea2dd098fe684bf9e02a"));
/**
* Bandeau de transparence : quand les prix ont été relevés auprès de
* Travelpayouts, quand la prochaine mise à jour automatique est prévue, et
* possibilité d'en déclencher une immédiatement.
*/
function PriceRefreshStatus() {
	const readState = useServerFn(priceRefreshState);
	const runRefresh = useServerFn(refreshPricesNow);
	const router = useRouter();
	const [pending, setPending] = (0, import_react.useState)(false);
	const [feedback, setFeedback] = (0, import_react.useState)(null);
	const [manual, setManual] = (0, import_react.useState)(null);
	const query = useQuery({
		queryKey: ["price-refresh-state"],
		queryFn: () => readState(),
		staleTime: 6e4
	});
	const state = manual ?? query.data?.state ?? null;
	async function refresh() {
		setPending(true);
		setFeedback(null);
		try {
			const result = await runRefresh();
			setManual(result.state);
			setFeedback(result.message);
			if (result.refreshed) await router.invalidate();
		} catch {
			setFeedback("Mise à jour impossible pour le moment, réessayez dans quelques minutes.");
		} finally {
			setPending(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm sm:flex-row sm:items-center sm:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-medium",
				children: "Prix de référence rafraîchis plusieurs fois par jour"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: state?.lastAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					"Dernier relevé : ",
					formatDateTimeShort(state.lastAt),
					" (heure de Paris) · prochain passage attendu vers ",
					formatDateTimeShort(state.nextAt)
				] }) : query.isPending ? "Chargement de l'état de mise à jour…" : "Aucune mise à jour automatique enregistrée pour l'instant : lancez-en une maintenant."
			}),
			feedback && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-muted-foreground",
				children: feedback
			})
		] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
			variant: "outline",
			onClick: refresh,
			disabled: pending,
			className: "shrink-0",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, {
				className: pending ? "animate-spin" : void 0,
				"aria-hidden": true
			}), pending ? "Mise à jour en cours…" : "Actualiser les prix maintenant"]
		})]
	});
}
var HERO_SRCSET = `${hero_sky_640_default$1} 640w, ${hero_sky_960_default$1} 960w, ${hero_sky_1280_default$1} 1280w, ${hero_sky_default$1} 1920w`;
var HERO_WEBP_SRCSET = `${hero_sky_640_default} 640w, ${hero_sky_960_default} 960w, ${hero_sky_1280_default} 1280w, ${hero_sky_default} 1920w`;
/** Marseille est le départ de référence du site : il est mis en avant sur l'accueil. */
var MARSEILLE_ROUTES = [...routesFrom("MRS")].sort((a, b) => a.destinationCity.localeCompare(b.destinationCity, "fr"));
var MARSEILLE_FAMILIES = [
	["maghreb", "Maghreb"],
	["europe-sud", "Europe du Sud et îles"],
	["france-corse", "France et Corse"],
	["turquie-orient", "Turquie, Égypte et Proche-Orient"],
	["europe-nord-est", "Europe du Nord et de l'Est"]
];
/** Le parcours réel, écrit en clair : ce que fait le site, dans l'ordre. */
var HOME_STEPS = [
	{
		title: "Vous dites ce que vous cherchez",
		text: "Une destination précise, ou seulement un budget et une période. Les dates flexibles à ± 3 jours suffisent souvent à faire varier le prix du simple au double sur un même trajet."
	},
	{
		title: "Nous interrogeons les vendeurs",
		text: "Compagnies et agences en ligne remontent leurs tarifs. Chaque offre arrive avec son prix total, taxes et frais obligatoires compris, et le nom du vendeur qui la propose."
	},
	{
		title: "Chaque prix arrive daté",
		text: "Un tarif relevé il y a moins d'une heure est signalé comme tel. Au-delà de 24 h, il est présenté comme une estimation et non comme un prix ferme : c'est le vendeur qui l'a daté, pas nous."
	},
	{
		title: "Vous réservez chez le vendeur",
		text: "Le bouton ouvre la page du vendeur nommé sur l'offre. Nous ne vendons pas de billets et n'encaissons aucun paiement : notre commission vient du vendeur, sans surcoût pour vous ni effet sur le classement."
	}
];
var REASONS = [
	{
		icon: BadgeEuro,
		title: "Le montant affiché est le total",
		text: "Taxes et frais obligatoires sont déjà inclus dans le prix affiché : pas de tarif d'appel qui gonfle au moment de payer. Chaque prix porte sa date de relevé, et au-delà de 24 h il est présenté comme une estimation, pas comme un prix ferme."
	},
	{
		icon: Store,
		title: "Vous savez toujours à qui vous parlez",
		text: "Chaque résultat indique le vendeur réel — la compagnie ou l'agence nommée — et le bouton ouvre son lien de réservation en un clic, sans comparateur intermédiaire caché ni page de captation."
	},
	{
		icon: EyeOff,
		title: "On ne vous met jamais la pression",
		text: "Aucun faux compte à rebours, aucun « plus que 2 places à ce prix », aucune mise en avant payante dans le classement. Vous décidez à votre rythme."
	},
	{
		icon: ShieldCheck,
		title: "Notre commission ? Écrite noir sur blanc",
		text: "Nous touchons une commission d'affiliation si vous réservez, sans surcoût pour vous."
	}
];
function HomePage() {
	const { prices, error } = Route.useLoaderData();
	const prefill = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "relative isolate overflow-hidden border-b border-border bg-sky-soft",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
					src: hero_sky_default$1,
					webp: hero_sky_default,
					srcSet: HERO_SRCSET,
					webpSrcSet: HERO_WEBP_SRCSET,
					sizes: "100vw",
					alt: "Aile d'avion au-dessus d'une mer de nuages au lever du soleil",
					width: 1920,
					height: 1080,
					className: "hero-parallax-img absolute inset-0 -z-10 size-full object-cover"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "absolute inset-0 -z-10 bg-gradient-to-b from-background/35 via-background/15 to-background/45",
					"aria-hidden": true
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-16",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-2xl bg-gradient-to-br from-background/95 via-background/90 to-background/70 p-6 lg:p-8 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "hero-in hero-in-1 font-display leading-tight",
							children: "Prix total, taxes incluses, vendeur affiché"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hero-in hero-in-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-4 text-base text-muted-foreground sm:text-lg",
									children: "Pas de tarif d'appel ni de frais découverts au paiement : le montant que nous affichons est le total, et vous savez chez qui vous réservez. Chaque prix porte sa date de relevé — ou partez de votre budget et découvrez toutes les destinations accessibles depuis votre ville."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
									className: "mt-5 space-y-2 text-sm text-muted-foreground",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Dates flexibles ± 3 jours pour repérer le jour le moins cher" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Vue calendrier des prix du mois, en un coup d'œil" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "• Alerte email gratuite quand le prix baisse, sans créer de compte" })
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-6 flex flex-wrap gap-3",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
										to: "/mode-budget",
										search: {
											origin: "PAR",
											budget: 400,
											month: "",
											adultes: 1,
											enfants: 0,
											bebes: 0
										},
										className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Map, {
											className: "size-4 text-primary",
											"aria-hidden": true
										}), "Explorer la carte du monde par budget"]
									})
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "recherche",
						className: "hero-in hero-in-3 scroll-mt-24",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchForm, {
							initialOrigin: prefill.origin || "PAR",
							initialDestination: prefill.destination ?? "",
							...prefill.depart ? { initialDepart: prefill.depart } : {},
							initialRetour: prefill.retour ?? "",
							initialBudget: prefill.budget ? String(prefill.budget) : "",
							initialFlexible: prefill.flexible ?? true,
							initialPassengers: {
								adults: prefill.adultes ?? 1,
								children: prefill.enfants ?? 0,
								infants: Math.min(prefill.bebes ?? 0, prefill.adultes ?? 1)
							}
						}, `${prefill.origin}-${prefill.destination}-${prefill.depart}-${prefill.budget}`)
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-page py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display",
					children: "Où partir au départ de Paris, du moins cher au plus cher"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "Prix les plus bas relevés récemment pour un aller simple, taxes incluses. Cliquez sur une destination pour voir les vols et le vendeur de chaque billet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DestinationPriceGrid, {
						prices,
						origin: "PAR",
						error
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceRefreshStatus, {})]
				})
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
			className: "border-y border-border bg-secondary/40 py-14",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "container-page",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-display",
						children: "Pourquoi passer par nous"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 max-w-2xl text-sm text-muted-foreground",
						children: "La plupart des comparateurs vivent de l'urgence artificielle et du classement payant. Nous avons fait le choix inverse : une information complète, vérifiable, et un chemin de réservation le plus court possible."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 grid gap-4 sm:grid-cols-2",
						children: REASONS.map((reason) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(reason.icon, {
									className: "size-5 text-primary",
									"aria-hidden": true
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
									className: "mt-3",
									children: reason.title
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1.5 text-sm text-muted-foreground",
									children: reason.text
								})
							]
						}, reason.title))
					})
				]
			})
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-page py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display",
					children: "Comment ça marche"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "Quatre étapes, sans compte à créer et sans paiement chez nous."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
					className: "mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
					children: HOME_STEPS.map((step, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
						className: "rounded-xl border border-border bg-card p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex size-8 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground",
								children: index + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "mt-3 text-sm font-semibold",
								children: step.title
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed text-muted-foreground",
								children: step.text
							})
						]
					}, step.title))
				})
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-page py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display",
					children: "Vols au départ de Marseille"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: [MARSEILLE_ROUTES.length, " liaisons au départ de Marseille Provence, toutes vérifiées comme réellement desservies — en vol direct, sauf mention d'escale. Prix total taxes incluses et vendeur affiché, comme partout sur le site."]
				}),
				MARSEILLE_FAMILIES.map(([family, label]) => {
					const routes = MARSEILLE_ROUTES.filter((route) => route.family === family);
					if (routes.length === 0) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "text-sm font-semibold text-muted-foreground",
							children: label
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
							className: "mt-2 flex flex-wrap gap-2",
							children: routes.map((route) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/vols/$slug",
								params: { slug: route.slug },
								className: "inline-flex items-center gap-2 rounded-lg border border-border bg-card px-3 py-2 text-sm transition-colors hover:bg-secondary",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-medium",
										children: route.destinationCity
									}),
									!route.nonstop && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground",
										children: "avec escale"
									}),
									route.validation.minPriceEur !== null && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-xs text-primary",
										children: [
											"dès ",
											route.validation.minPriceEur,
											" €"
										]
									})
								]
							}) }, route.slug))
						})]
					}, family);
				})
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-page py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display",
					children: "Nos pages destinations"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "Chaque page détaille la meilleure période pour partir, l'évolution des prix sur douze mois et les questions les plus fréquentes sur le trajet."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3",
					children: withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS).map((d) => {
						const image = getDestinationImage(d.destination, d.destinationCity, d.country);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vols/$slug",
							params: { slug: d.slug },
							className: "flex items-center gap-3 rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsivePicture, {
								src: image.thumb,
								webp: image.thumbWebp,
								alt: image.alt,
								loading: "lazy",
								width: 128,
								height: 96,
								className: "size-16 shrink-0 rounded-lg object-cover"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "min-w-0",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "block text-sm font-semibold",
									children: [
										"Vols pas chers ",
										d.originCity,
										" — ",
										d.destinationCity
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "mt-1 block text-xs text-muted-foreground",
									children: [
										d.country,
										" · ",
										d.bestMonths
									]
								})]
							})]
						}) }, d.slug);
					})
				})
			]
		}) }),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Reveal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "container-page pb-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display",
					children: "Questions fréquentes"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-2xl text-sm text-muted-foreground",
					children: "Ce qu'on nous demande le plus souvent sur le fonctionnement du comparateur. Les questions propres à un trajet sont traitées sur chaque page destination."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6 max-w-3xl",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FaqAccordion, { items: HOME_FAQ })
				})
			]
		}) })
	] });
}
//#endregion
export { HomePage as component };
