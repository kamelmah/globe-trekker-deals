import { i as __toESM } from "../_runtime.mjs";
import { _ as Link, b as ClientOnly, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn, t as Label } from "./label-Cmix8ykc.mjs";
import { c as formatMonthLong } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { n as cheapestDestinations } from "./flights.functions-2XDL4V6N.mjs";
import { o as getAirport } from "./airports-DEvng4YS.mjs";
import { r as monthOr } from "./search-params-CajpETpS.mjs";
import { o as WHITELIST_SLUGS } from "./route-whitelist-w8ea1sr9.mjs";
import { N as Calendar } from "../_libs/lucide-react.mjs";
import { t as routeSlug } from "./slug-BO_x1oHK.mjs";
import { n as useCurrency } from "./currency-context-BjWSGzF3.mjs";
import { t as Route } from "./mode-budget-BNbfUsiI.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as PopoverTrigger, i as PopoverContent, n as PlaceAutocomplete, o as Skeleton, r as Popover, t as PassengerSelector } from "./PlaceAutocomplete-BNKESHVR.mjs";
import { t as ApiDebugPanel } from "./ApiDebugPanel-CXzqegmj.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mode-budget-DsKOP-zS.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var MONTHS_AHEAD = 12;
function monthKey(offset) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(1);
	d.setMonth(d.getMonth() + offset);
	return d.toISOString().slice(0, 7);
}
function monthLabel(month) {
	const label = formatMonthLong(month);
	return label.charAt(0).toUpperCase() + label.slice(1);
}
/** Sélecteur de mois en popover, pour remplacer le rendu natif disgracieux de <input type="month">. */
function MonthPicker({ value, onChange, id = "month", label = "Mois de départ (facultatif)" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const months = Array.from({ length: MONTHS_AHEAD }, (_, i) => monthKey(i));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: id,
			children: label
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, {
			open,
			onOpenChange: setOpen,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					id,
					type: "button",
					variant: "outline",
					className: "w-full justify-start text-left font-normal",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
						className: "size-4 shrink-0",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: value ? monthLabel(value) : "Tous les mois"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
				align: "start",
				className: "z-50 w-72 p-3 pointer-events-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => {
						onChange("");
						setOpen(false);
					},
					className: cn("mb-2 w-full rounded-md border p-2 text-center text-sm transition-colors hover:bg-muted", value === "" ? "border-primary bg-primary/10 font-medium" : "border-border"),
					children: "Tous les mois"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid grid-cols-3 gap-1.5",
					children: months.map((month) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => {
							onChange(month);
							setOpen(false);
						},
						className: cn("rounded-md border p-2 text-center text-xs transition-colors hover:bg-muted", value === month ? "border-primary bg-primary/10 font-medium" : "border-border"),
						children: monthLabel(month)
					}, month))
				})]
			})]
		})]
	});
}
function BudgetPage() {
	const search = Route.useSearch();
	const initial = Route.useLoaderData();
	const navigate = useNavigate({ from: Route.fullPath });
	const runDestinations = useServerFn(cheapestDestinations);
	const { formatApi: format, currency } = useCurrency();
	const [selected, setSelected] = (0, import_react.useState)(void 0);
	const [budgetInput, setBudgetInput] = (0, import_react.useState)(String(search["budget"]));
	const [monthInput, setMonthInput] = (0, import_react.useState)(search.month);
	const [passengers, setPassengers] = (0, import_react.useState)({
		adults: search.adultes,
		children: search.enfants,
		infants: search.bebes
	});
	const query = useQuery({
		queryKey: [
			"budget",
			search["origin"],
			search.month,
			search.adultes,
			search.enfants,
			search.bebes,
			currency
		],
		queryFn: () => runDestinations({ data: {
			origin: search["origin"],
			world: true,
			adults: search.adultes,
			children: search.enfants,
			infants: search.bebes,
			...search["month"] ? { month: search["month"] } : {},
			currency
		} }),
		...currency === "EUR" ? { initialData: initial } : {}
	});
	/** Pré-remplit le formulaire de recherche de l'accueil avec ce trajet. */
	const searchForDestination = (0, import_react.useCallback)((destination, departureAt) => ({
		origin: search["origin"],
		destination,
		depart: departureAt.slice(0, 10),
		retour: "",
		budget: search["budget"],
		flexible: true,
		adultes: search.adultes,
		enfants: search.enfants,
		bebes: search.bebes
	}), [search]);
	const originAirport = getAirport(search["origin"]);
	const prices = [...query.data?.prices ?? []].sort((a, b) => a.priceEur - b.priceEur);
	const affordable = prices.filter((p) => p.priceEur <= search["budget"]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display",
				children: [
					"Mode budget : où partir de ",
					originAirport?.city ?? search.origin,
					" avec",
					" ",
					format(search["budget"])
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 max-w-3xl text-sm text-muted-foreground",
				children: [
					"Dites-nous votre budget, on vous montre le monde qui rentre dedans. Chaque point de la carte correspond à une ville accessible avec le prix le plus bas relevé récemment, taxes incluses. Les destinations au-dessus de votre budget restent visibles, simplement estompées, pour vous laisser explorer. Aujourd'hui, ",
					affordable.length,
					" destinations sur",
					" ",
					prices.length,
					" tiennent dans votre budget."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "mt-5 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-2 lg:grid-cols-[1fr_1fr_1fr_1fr_auto] lg:items-end",
				onSubmit: (event) => {
					event.preventDefault();
					navigate({ search: (prev) => ({
						...prev,
						budget: Math.max(20, Number(budgetInput) || 400),
						month: monthOr(monthInput, ""),
						adultes: passengers.adults,
						enfants: passengers.children,
						bebes: passengers.infants
					}) });
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceAutocomplete, {
						id: "budget-origin",
						label: "Ville ou aéroport de départ",
						value: search.origin,
						onChange: (code) => code && navigate({ search: (prev) => ({
							...prev,
							origin: code
						}) }),
						placeholder: "Ex. Paris, Lyon, CDG…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MonthPicker, {
						id: "budget-month",
						value: monthInput,
						onChange: setMonthInput
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "budget-amount",
							children: "Budget maximum (€)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "budget-amount",
							type: "number",
							min: 20,
							inputMode: "numeric",
							value: budgetInput,
							onChange: (e) => setBudgetInput(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PassengerSelector, {
						value: passengers,
						onChange: setPassengers
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						children: "Mettre à jour la carte"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "Le mode budget compare un aller simple sur l'ensemble du mois choisi (ou toute l'année si aucun mois n'est précisé) : pas de date de retour ni de dates flexibles ici, contrairement à la recherche classique — utile pour repérer une destination avant d'affiner les dates exactes."
			})
		]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page mt-6 grid gap-4 pb-12 lg:grid-cols-[1fr_360px]",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-[520px] overflow-hidden rounded-xl border border-border bg-card lg:h-[640px]",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ClientOnly, { fallback: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-full w-full" }) })
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "max-h-[640px] overflow-y-auto rounded-xl border border-border bg-card p-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-display text-base font-semibold",
					children: "Destinations, du moins cher au plus cher"
				}),
				query.isFetching && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Chargement des prix…"
				}),
				query.data?.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive",
					children: query.data.error
				}),
				!query.isFetching && !query.data?.error && prices.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 text-sm text-muted-foreground",
					children: "Aucun vol trouvé pour cette recherche, essayez un autre mois ou une autre ville de départ."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "mt-3 space-y-2",
					children: prices.map((price) => {
						const inBudget = price.priceEur <= search.budget;
						const routePage = routeSlug(originAirport?.city ?? search.origin, price.city);
						const hasRoutePage = WHITELIST_SLUGS.has(routePage);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							search: searchForDestination(price.destination, price.departureAt),
							onMouseEnter: () => setSelected(price.destination),
							onFocus: () => setSelected(price.destination),
							className: `flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-secondary ${inBudget ? "border-border" : "border-dashed border-border opacity-55"} ${selected === price.destination ? "ring-2 ring-ring" : ""}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block font-medium",
								children: price.city
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: price.country
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-semibold text-primary",
								children: format(price.priceEur)
							})]
						}), hasRoutePage && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/vols/$slug",
							params: { slug: routePage },
							className: "mt-1 block px-3 text-xs text-muted-foreground underline hover:text-foreground",
							children: [
								"Fiche trajet ",
								price.city,
								" — prix, durée, FAQ"
							]
						})] }, price.destination);
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiDebugPanel, {
					debug: query.data?.debug,
					label: "Mode budget"
				})
			]
		})]
	})] });
}
//#endregion
export { BudgetPage as component };
