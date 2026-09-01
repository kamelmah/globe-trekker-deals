import { i as __toESM } from "../_runtime.mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn, t as Label } from "./label-Cmix8ykc.mjs";
import { c as formatMonthLong, n as formatDateLong } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { t as calendarPrices } from "./flights.functions-2XDL4V6N.mjs";
import { n as TRIP_DURATIONS, r as addDaysIso, s as nightsBetween } from "./trip-duration-Dr4Tuig8.mjs";
import { N as Calendar, O as ChevronRight, j as Check, k as ChevronLeft, u as Search } from "../_libs/lucide-react.mjs";
import { n as useCurrency } from "./currency-context-BjWSGzF3.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { n as CheckboxIndicator, t as Checkbox$1 } from "../_libs/@radix-ui/react-checkbox+[...].mjs";
import { a as PopoverTrigger, c as resolvePlace, i as PopoverContent, n as PlaceAutocomplete, o as Skeleton, r as Popover, t as PassengerSelector } from "./PlaceAutocomplete-BNKESHVR.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/SearchForm-CDIOh918.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var WEEKDAYS = [
	"L",
	"M",
	"M",
	"J",
	"V",
	"S",
	"D"
];
function monthOf(date) {
	return /^\d{4}-\d{2}/.test(date) ? date.slice(0, 7) : (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
}
function shiftMonth(month, delta) {
	const [y, m] = month.split("-").map(Number);
	return new Date(Date.UTC(y, (m ?? 1) - 1 + delta, 1)).toISOString().slice(0, 7);
}
function daysInMonth(month) {
	const [y, m] = month.split("-").map(Number);
	const total = new Date(Date.UTC(y, m, 0)).getUTCDate();
	return Array.from({ length: total }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
}
var monthLabel = formatMonthLong;
function level(price, min, max) {
	if (max === min) return "mid";
	const ratio = (price - min) / (max - min);
	if (ratio <= .33) return "low";
	if (ratio <= .66) return "mid";
	return "high";
}
function PriceDatePicker({ value, onChange, origin, destination, tripDuration, minDate, mode = "departure", departureAt = null, id = "depart", label = "Date de départ" }) {
	const [open, setOpen] = (0, import_react.useState)(false);
	const [month, setMonth] = (0, import_react.useState)(() => monthOf(value || departureAt || ""));
	const { formatApi: format } = useCurrency();
	const { currency } = useCurrency();
	const runCalendar = useServerFn(calendarPrices);
	const canFetch = open && Boolean(origin) && Boolean(destination) && (mode === "departure" || Boolean(departureAt));
	const pricesQuery = useQuery({
		queryKey: [
			"date-picker-calendar",
			mode,
			origin,
			destination,
			month,
			tripDuration,
			currency,
			departureAt
		],
		queryFn: () => runCalendar({ data: {
			origin,
			destination,
			month,
			tripDuration: mode === "return" ? 0 : tripDuration,
			currency,
			mode,
			departureAt: mode === "return" ? departureAt : null
		} }),
		enabled: canFetch
	});
	const priceByDate = /* @__PURE__ */ new Map();
	for (const day of pricesQuery.data?.days ?? []) priceByDate.set(day.date, day.priceEur);
	const prices = [...priceByDate.values()];
	const min = prices.length ? Math.min(...prices) : 0;
	const max = prices.length ? Math.max(...prices) : 0;
	const days = daysInMonth(month);
	const firstWeekday = ((/* @__PURE__ */ new Date(`${month}-01T00:00:00Z`)).getUTCDay() + 6) % 7;
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
					className: cn("w-full justify-start overflow-hidden text-left font-normal"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Calendar, {
						className: "size-4",
						"aria-hidden": true
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "truncate",
						children: formatDateLong(value) || "Choisir une date"
					})]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PopoverContent, {
				align: "start",
				className: "z-50 w-[320px] p-3 pointer-events-auto",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								"aria-label": "Mois précédent",
								onClick: () => setMonth((m) => shiftMonth(m, -1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, {
									className: "size-4",
									"aria-hidden": true
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-medium capitalize",
								children: monthLabel(month)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								variant: "ghost",
								size: "icon",
								"aria-label": "Mois suivant",
								onClick: () => setMonth((m) => shiftMonth(m, 1)),
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, {
									className: "size-4",
									"aria-hidden": true
								})
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: !destination ? "Indiquez une destination pour voir les prix par jour." : mode === "return" ? departureAt ? `Prix aller-retour le plus bas pour un retour ce jour-là (départ le ${formatDateLong(departureAt)}).` : "Choisissez d'abord une date de départ pour voir les prix de retour." : tripDuration > 0 ? `Prix aller-retour le plus bas (séjour de ${tripDuration} nuits).` : "Prix aller simple le plus bas par jour de départ."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground",
						children: WEEKDAYS.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }, `${d}-${i}`))
					}),
					canFetch && pricesQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-56 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-1 grid grid-cols-7 gap-1",
						children: [Array.from({ length: firstWeekday }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "aria-hidden": true }, `empty-${i}`)), days.map((date) => {
							const price = priceByDate.get(date);
							const disabled = date < minDate;
							const l = price === void 0 ? null : level(price, min, max);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled,
								onClick: () => {
									onChange(date);
									setOpen(false);
								},
								"aria-label": price === void 0 ? formatDateLong(date) : `${formatDateLong(date)} : ${format(price)}`,
								className: cn("flex min-h-11 flex-col items-center justify-center rounded-md border p-0.5 text-center transition-colors", l === null && "border-border hover:bg-muted", l === "low" && "border-success/40 bg-success/10 hover:bg-success/20", l === "mid" && "border-warning/40 bg-warning/10 hover:bg-warning/20", l === "high" && "border-destructive/30 bg-destructive/10 hover:bg-destructive/20", value === date && "ring-2 ring-ring", disabled && "cursor-not-allowed opacity-40"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] leading-none text-muted-foreground",
									children: Number(date.slice(8))
								}), price !== void 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[10px] font-semibold leading-tight",
									children: format(price)
								})]
							}, date);
						})]
					}),
					pricesQuery.data?.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-destructive",
						children: pricesQuery.data.error
					}),
					!pricesQuery.isFetching && !pricesQuery.data?.error && (pricesQuery.data?.days?.length ?? 0) === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: "Aucun prix disponible pour ce mois sur ce trajet. Essayez un autre mois."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 rounded bg-success/40",
									"aria-hidden": true
								}), " Bas"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 rounded bg-warning/40",
									"aria-hidden": true
								}), " Moyen"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "size-2.5 rounded bg-destructive/30",
									"aria-hidden": true
								}), " Élevé"]
							})
						]
					})
				]
			})]
		})]
	});
}
/** Compatibilité : le champ de départ garde son nom historique. */
function DepartureDatePicker(props) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceDatePicker, {
		...props,
		mode: "departure",
		id: "depart",
		label: "Date de départ"
	});
}
var Checkbox = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox$1, {
	ref,
	className: cn("grid place-content-center peer h-4 w-4 shrink-0 rounded-sm border border-primary shadow cursor-pointer focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckboxIndicator, {
		className: cn("grid place-content-center text-current"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" })
	})
}));
Checkbox.displayName = Checkbox$1.displayName;
function defaultDate(offsetDays) {
	const d = /* @__PURE__ */ new Date();
	d.setDate(d.getDate() + offsetDays);
	return d.toISOString().slice(0, 10);
}
function SearchForm({ initialOrigin = "PAR", initialDestination = "", initialDepart, initialRetour = "", initialBudget = "", initialFlexible = true, initialDuree, initialPassengers, compact = false }) {
	const navigate = useNavigate();
	const [origin, setOrigin] = (0, import_react.useState)(initialOrigin);
	const [destination, setDestination] = (0, import_react.useState)(initialDestination);
	const [depart, setDepart] = (0, import_react.useState)(initialDepart ?? defaultDate(30));
	const [retour, setRetour] = (0, import_react.useState)(initialRetour);
	const [flexible, setFlexible] = (0, import_react.useState)(initialFlexible);
	const [duree, setDuree] = (0, import_react.useState)(initialDuree ?? (initialRetour ? nightsBetween(initialDepart ?? "", initialRetour) : 0));
	const [passengers, setPassengers] = (0, import_react.useState)(initialPassengers ?? {
		adults: 1,
		children: 0,
		infants: 0
	});
	const [budget, setBudget] = (0, import_react.useState)(initialBudget);
	/** Texte brut du champ destination (saisie libre sans clic sur une suggestion). */
	const [destinationText, setDestinationText] = (0, import_react.useState)(initialDestination);
	const [destinationError, setDestinationError] = (0, import_react.useState)(null);
	const [resolving, setResolving] = (0, import_react.useState)(false);
	const typedDestination = destinationText.trim();
	const hasTypedDestination = typedDestination.length > 0;
	/** Avec un raccourci de durée, le retour est calculé depuis la date de départ. */
	const effectiveRetour = duree > 0 ? addDaysIso(depart, duree) : retour;
	function goToResults(code) {
		navigate({
			to: "/recherche",
			search: {
				origin,
				destination: code,
				depart,
				retour: effectiveRetour,
				duree,
				flexible: flexible ? 1 : 0,
				budget: budget ? Number(budget) : 0,
				adultes: passengers.adults,
				enfants: passengers.children,
				bebes: passengers.infants
			}
		});
	}
	async function submit(event) {
		event.preventDefault();
		setDestinationError(null);
		if (destination) {
			goToResults(destination);
			return;
		}
		if (hasTypedDestination) {
			setResolving(true);
			try {
				const result = await resolvePlace({ data: { term: typedDestination } });
				if (result.place) {
					setDestination(result.place.code);
					setDestinationText(`${result.place.city || result.place.name} (${result.place.code})`);
					goToResults(result.place.code);
					return;
				}
				setDestinationError(result.error ?? "Destination introuvable : sélectionnez une destination dans la liste ou laissez le champ vide pour le mode budget.");
			} catch {
				setDestinationError("Impossible de vérifier cette destination pour le moment. Réessayez dans un instant.");
			} finally {
				setResolving(false);
			}
			return;
		}
		navigate({
			to: "/mode-budget",
			search: {
				origin,
				budget: budget ? Number(budget) : 400,
				month: "",
				adultes: passengers.adults,
				enfants: passengers.children,
				bebes: passengers.infants
			}
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: (event) => void submit(event),
		className: "rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5",
		"aria-label": "Recherche de vols",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 md:grid-cols-2",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceAutocomplete, {
						id: "origin",
						label: "Ville ou aéroport de départ",
						value: origin,
						onChange: setOrigin,
						placeholder: "Ex. Paris, CDG, Marrakech…"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PlaceAutocomplete, {
						id: "destination",
						label: "Destination (facultatif — laissez vide pour le mode budget)",
						value: destination,
						onChange: (code) => {
							setDestination(code);
							if (code) setDestinationError(null);
						},
						onTextChange: (value) => {
							setDestinationText(value);
							setDestinationError(null);
						},
						error: destinationError,
						placeholder: "Peu importe — mode budget",
						allowEmpty: true
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DepartureDatePicker, {
						value: depart,
						onChange: setDepart,
						origin,
						destination,
						tripDuration: duree,
						minDate: defaultDate(1)
					}),
					duree > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: "Date de retour (calculée)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex min-h-9 items-center rounded-md border border-input bg-muted/40 px-3 py-1.5 text-sm",
							children: effectiveRetour ? `Retour le ${formatDateLong(effectiveRetour)} · ${duree} nuits` : "Choisissez une date de départ"
						})]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceDatePicker, {
						mode: "return",
						id: "retour",
						label: "Date de retour (facultatif)",
						value: retour,
						onChange: setRetour,
						origin,
						destination,
						tripDuration: 0,
						departureAt: depart || null,
						minDate: depart || defaultDate(1)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PassengerSelector, {
						value: passengers,
						onChange: setPassengers
					}),
					!compact && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "budget",
							children: "Budget maximum (facultatif, en €)"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "budget",
							type: "number",
							min: 0,
							inputMode: "numeric",
							placeholder: "Ex. 300",
							value: budget,
							onChange: (e) => setBudget(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "flex cursor-pointer items-center gap-2 text-sm text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
								checked: flexible,
								onCheckedChange: (v) => setFlexible(v === true),
								"aria-label": "Dates flexibles à plus ou moins trois jours"
							}), "Dates flexibles ± 3 jours"]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
				className: "mt-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
						className: "text-sm font-medium",
						children: "Durée du séjour"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 flex flex-wrap gap-2",
						role: "group",
						"aria-label": "Durée du séjour",
						children: TRIP_DURATIONS.map((preset) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							size: "sm",
							variant: duree === preset.days ? "default" : "outline",
							"aria-pressed": duree === preset.days,
							onClick: () => setDuree(preset.days),
							children: preset.label
						}, preset.days))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-xs text-muted-foreground",
						children: duree > 0 ? `Séjour de ${duree} nuits — choisissez seulement la date de départ${flexible ? ", nous testons aussi les départs à ± 3 jours" : ""}.` : "Choisissez librement vos dates d'aller et de retour."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				type: "submit",
				variant: "cta",
				size: "lg",
				className: "mt-5 w-full sm:w-auto",
				disabled: resolving,
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, {
					className: "size-4",
					"aria-hidden": true
				}), resolving ? "Vérification de la destination…" : destination || hasTypedDestination ? "Chercher le meilleur prix" : "Voir où partir avec mon budget"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted-foreground",
				children: "Prix total taxes incluses, vendeur affiché sur chaque résultat. Aucun compte à rebours artificiel."
			})
		]
	});
}
//#endregion
export { SearchForm as n, Checkbox as t };
