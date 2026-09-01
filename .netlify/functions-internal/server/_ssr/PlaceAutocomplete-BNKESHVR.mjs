import { i as __toESM } from "../_runtime.mjs";
import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { t as Label } from "./label-Cmix8ykc.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { t as Input } from "./input-HMhuwhH6.mjs";
import { a as objectType, o as stringType } from "../_libs/zod.mjs";
import { o as getAirport } from "./airports-DEvng4YS.mjs";
import { f as Plus, h as Minus, r as Users } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as Trigger, n as Portal, r as Root2, t as Content2 } from "../_libs/@radix-ui/react-popover+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/PlaceAutocomplete-BNKESHVR.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Popover = Root2;
var PopoverTrigger = Trigger;
var PopoverContent = import_react.forwardRef(({ className, align = "center", sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	align,
	sideOffset,
	className: cn("z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-popover-content-transform-origin)", className),
	...props
}) }));
PopoverContent.displayName = Content2.displayName;
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
function passengersSummary({ adults, children, infants }) {
	const parts = [`${adults} adulte${adults > 1 ? "s" : ""}`];
	if (children > 0) parts.push(`${children} enfant${children > 1 ? "s" : ""}`);
	if (infants > 0) parts.push(`${infants} bébé${infants > 1 ? "s" : ""}`);
	return parts.join(", ");
}
function CounterRow({ id, title, hint, value, min, max, disabledPlusReason, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start justify-between gap-4 py-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					id: `${id}-label`,
					children: title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: hint
				}),
				value >= max && disabledPlusReason ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-primary",
					children: disabledPlusReason
				}) : null
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex shrink-0 items-center gap-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "icon",
					className: "size-8",
					"aria-label": `Retirer un passager : ${title}`,
					disabled: value <= min,
					onClick: () => onChange(Math.max(min, value - 1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, {
						className: "size-4",
						"aria-hidden": true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "w-6 text-center text-sm font-semibold tabular-nums",
					"aria-live": "polite",
					"aria-labelledby": `${id}-label`,
					children: value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					size: "icon",
					className: "size-8",
					"aria-label": `Ajouter un passager : ${title}`,
					disabled: value >= max,
					onClick: () => onChange(Math.min(max, value + 1)),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, {
						className: "size-4",
						"aria-hidden": true
					})
				})
			]
		})]
	});
}
function PassengerSelector({ value, onChange }) {
	const summary = passengersSummary(value);
	function setAdults(adults) {
		onChange({
			...value,
			adults,
			infants: Math.min(value.infants, adults)
		});
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
			htmlFor: "passagers",
			children: "Nombre de passagers"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Popover, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverTrigger, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				id: "passagers",
				type: "button",
				variant: "outline",
				className: "h-9 w-full justify-start font-normal",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Users, {
					className: "size-4 text-muted-foreground",
					"aria-hidden": true
				}), summary]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PopoverContent, {
			align: "start",
			className: "w-80 p-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "divide-y divide-border",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CounterRow, {
						id: "adultes",
						title: "Adultes",
						hint: "12 ans et plus",
						value: value.adults,
						min: 1,
						max: 9,
						onChange: setAdults
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CounterRow, {
						id: "enfants",
						title: "Enfants",
						hint: "2 à 11 ans — siège propre, tarif enfant",
						value: value.children,
						min: 0,
						max: 8,
						onChange: (children) => onChange({
							...value,
							children
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CounterRow, {
						id: "bebes",
						title: "Bébés",
						hint: "0 à 23 mois — sur les genoux d'un adulte, sans siège",
						value: value.infants,
						min: 0,
						max: value.adults,
						disabledPlusReason: "Un bébé par adulte maximum, comme l'exigent les compagnies aériennes.",
						onChange: (infants) => onChange({
							...value,
							infants
						})
					})
				]
			})
		})] })]
	});
}
var searchPlaces = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ term: stringType().trim().max(80) }).parse(data)).handler(createSsrRpc("86a553360b1d2d5d6c994785348fb63757e6915e3db78e09d21670073a7e667b"));
var resolvePlace = createServerFn({ method: "GET" }).inputValidator((data) => objectType({ term: stringType().trim().max(80) }).parse(data)).handler(createSsrRpc("c342fb1b797e5992fd0e8420175833624eb4de00876d487df985a4e006a759bc"));
function labelFor(code) {
	const known = getAirport(code);
	if (known) return `${known.city} (${code})`;
	return code ? code : "";
}
/**
* Champ ville/aéroport couvrant le monde entier (API autocomplete Travelpayouts,
* appelée côté serveur). La valeur remontée est toujours un code IATA.
*/
function PlaceAutocomplete({ id, label, value, onChange, placeholder = "Ville ou aéroport", allowEmpty = false, onTextChange, error }) {
	const listId = (0, import_react.useId)();
	const [text, setText] = (0, import_react.useState)(() => labelFor(value));
	const [term, setTerm] = (0, import_react.useState)("");
	const [open, setOpen] = (0, import_react.useState)(false);
	const [active, setActive] = (0, import_react.useState)(0);
	const wrapper = (0, import_react.useRef)(null);
	const skipBlur = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		const handle = setTimeout(() => setTerm(text.trim()), 300);
		return () => clearTimeout(handle);
	}, [text]);
	(0, import_react.useEffect)(() => {
		function onDocClick(event) {
			if (!wrapper.current?.contains(event.target)) setOpen(false);
		}
		document.addEventListener("mousedown", onDocClick);
		return () => document.removeEventListener("mousedown", onDocClick);
	}, []);
	const enabled = term.length >= 2;
	const query = useQuery({
		queryKey: ["places", term],
		queryFn: () => searchPlaces({ data: { term } }),
		enabled,
		staleTime: 216e5
	});
	const places = query.data?.places ?? [];
	function select(place) {
		onChange(place.code);
		const nextText = place.type === "airport" ? `${place.name} (${place.code})` : `${place.city || place.name} (${place.code})`;
		setText(nextText);
		onTextChange?.(nextText);
		setOpen(false);
	}
	/**
	* Saisie libre : au blur, on résout le texte tapé en code IATA sans exiger
	* un clic sur une suggestion.
	*/
	async function resolveTyped() {
		if (skipBlur.current) {
			skipBlur.current = false;
			return;
		}
		const typed = text.trim();
		if (typed === "") {
			if (allowEmpty) onChange("");
			return;
		}
		if (value && typed === labelFor(value)) return;
		if (value && typed.toUpperCase() === value.toUpperCase()) return;
		const match = places.find((place) => typed.toUpperCase() === place.code || typed.toLowerCase() === (place.city || place.name).toLowerCase());
		if (match) {
			select(match);
			return;
		}
		try {
			const result = await resolvePlace({ data: { term: typed } });
			if (result.place) select(result.place);
			else onChange("");
		} catch {
			onChange("");
		}
	}
	function onKeyDown(event) {
		if (!open || places.length === 0) return;
		if (event.key === "ArrowDown") {
			event.preventDefault();
			setActive((i) => (i + 1) % places.length);
		} else if (event.key === "ArrowUp") {
			event.preventDefault();
			setActive((i) => (i - 1 + places.length) % places.length);
		} else if (event.key === "Enter") {
			const place = places[active];
			if (place) {
				event.preventDefault();
				select(place);
			}
		} else if (event.key === "Escape") setOpen(false);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative",
		ref: wrapper,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
				htmlFor: id,
				className: "text-sm font-medium leading-none",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
				id,
				className: "mt-1.5",
				autoComplete: "off",
				role: "combobox",
				"aria-expanded": open,
				"aria-controls": listId,
				"aria-autocomplete": "list",
				placeholder,
				value: text,
				"aria-invalid": error ? true : void 0,
				"aria-describedby": error ? `${id}-error` : void 0,
				onChange: (event) => {
					setText(event.target.value);
					onTextChange?.(event.target.value);
					setActive(0);
					setOpen(true);
					if (allowEmpty && event.target.value.trim() === "") onChange("");
				},
				onFocus: () => setOpen(true),
				onBlur: () => void resolveTyped(),
				onKeyDown
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				id: `${id}-error`,
				className: "mt-1.5 text-xs text-destructive",
				role: "alert",
				children: error
			}),
			open && enabled && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				id: listId,
				role: "listbox",
				className: "absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg",
				children: [
					query.isFetching && places.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-2 text-sm text-muted-foreground",
						children: "Recherche…"
					}),
					query.data?.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-2 text-sm text-destructive",
						children: query.data.error
					}),
					!query.isFetching && !query.data?.error && places.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-2 py-2 text-sm text-muted-foreground",
						children: "Aucune ville ou aéroport trouvé. Vérifiez l'orthographe."
					}),
					places.map((place, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						role: "option",
						"aria-selected": index === active,
						onMouseEnter: () => setActive(index),
						onMouseDown: () => {
							skipBlur.current = true;
						},
						onClick: () => select(place),
						className: `flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm ${index === active ? "bg-secondary" : ""}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block font-medium",
								children: [place.city || place.name, place.country ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [" · ", place.country]
								}) : null]
							}),
							place.type === "airport" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "block text-xs text-muted-foreground",
								children: [
									"Aéroport ",
									place.code,
									" — ",
									place.name
								]
							}),
							place.type === "city" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "block text-xs text-muted-foreground",
								children: "Tous les aéroports de la ville"
							})
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs",
							children: place.code
						})]
					}, place.code))
				]
			})
		]
	});
}
//#endregion
export { PopoverTrigger as a, resolvePlace as c, PopoverContent as i, PlaceAutocomplete as n, Skeleton as o, Popover as r, passengersSummary as s, PassengerSelector as t };
