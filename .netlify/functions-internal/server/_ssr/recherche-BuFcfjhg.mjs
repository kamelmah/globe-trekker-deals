import { i as __toESM } from "../_runtime.mjs";
import { _ as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as require_jsx_runtime } from "../_libs/@radix-ui/react-accordion+[...].mjs";
import { n as useServerFn, t as Label } from "./label-Cmix8ykc.mjs";
import { c as formatMonthLong, i as formatDateTimeCompact, n as formatDateLong, o as formatDateTimeShort, r as formatDateMedium, t as formatDateCompact } from "./dates-DNk5GF2y.mjs";
import { t as Button } from "./button-CiauPzBb.mjs";
import { i as searchFlights, t as calendarPrices } from "./flights.functions-2XDL4V6N.mjs";
import { i as cityLabel, n as PARIS_MAIN_AIRPORTS, r as airportLabel, s as secondaryAirport } from "./airports-DEvng4YS.mjs";
import { t as co2Label } from "./co2-DK0-3ik4.mjs";
import { c as tripDurationLabel, r as addDaysIso, s as nightsBetween } from "./trip-duration-Dr4Tuig8.mjs";
import { C as Leaf, F as Building2, O as ChevronRight, P as CalendarDays, T as Clock, c as ShieldCheck, i as TriangleAlert, k as ChevronLeft, o as Store, p as Plane, s as SlidersHorizontal, t as X, x as Luggage, z as BadgeCheck } from "../_libs/lucide-react.mjs";
import { t as TravelPartnersSection } from "./TravelPartners-DuBgRp2V.mjs";
import { t as Stay22Map } from "./Stay22Map-ChdA7JX9.mjs";
import { n as useCurrency } from "./currency-context-BjWSGzF3.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { o as Skeleton, s as passengersSummary } from "./PlaceAutocomplete-BNKESHVR.mjs";
import { t as ApiDebugPanel } from "./ApiDebugPanel-CXzqegmj.mjs";
import { t as Route } from "./recherche-ws989BWm.mjs";
import { n as SearchForm, t as Checkbox } from "./SearchForm-CDIOh918.mjs";
import { t as AlertForm } from "./AlertForm-C4olTnID.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recherche-BuFcfjhg.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Normalise un nom de vendeur pour la comparaison : casse, accents, ponctuation. */
function normalize(value) {
	return value.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");
}
/**
* Vendeurs qui SONT la compagnie aérienne. Un billet acheté là revient à
* acheter au guichet du transporteur : pas d'intermédiaire, donc pas de frais
* de service d'agence, et le service après-vente est celui de la compagnie.
*/
var COMPAGNIES = [
	"Frenchbee",
	"French Bee",
	"Ryanair",
	"easyJet",
	"Transavia",
	"Vueling",
	"Volotea",
	"Air France",
	"Wizz Air",
	"Pegasus",
	"Air Algérie",
	"Tunisair",
	"Nouvelair",
	"Royal Air Maroc",
	"Air Arabia",
	"Turkish Airlines",
	"Iberia",
	"British Airways",
	"Lufthansa",
	"KLM",
	"Air Corsica",
	"Aegean Airlines",
	"ITA Airways",
	"TAP Air Portugal",
	"Emirates",
	"Qatar Airways",
	"EgyptAir"
];
/**
* Agences en ligne rencontrées dans les résultats. Cette liste ne change pas la
* nature attribuée — une agence inconnue est traitée pareil — mais elle porte
* le groupe propriétaire et le domaine, et sert de garde-fou : un nom qui n'y
* figure pas mérite d'être vérifié avant d'être ajouté aux compagnies.
*/
var AGENCES = [
	{
		name: "Aviasales",
		domain: "aviasales.com"
	},
	{
		name: "Trip.com",
		group: "Trip.com Group",
		domain: "trip.com"
	},
	{
		name: "Vayama",
		group: "Trip.com Group",
		domain: "vayama.com"
	},
	{
		name: "Gotogate",
		group: "Etraveli Group",
		domain: "gotogate.com"
	},
	{
		name: "Mytrip",
		group: "Etraveli Group",
		domain: "mytrip.com"
	},
	{
		name: "Mytrip.com",
		group: "Etraveli Group",
		domain: "mytrip.com"
	},
	{
		name: "Flightnetwork",
		group: "Etraveli Group",
		domain: "flightnetwork.com"
	},
	{
		name: "SuperSaver",
		group: "Etraveli Group",
		domain: "supersaver.com"
	},
	{
		name: "Kupi.com",
		domain: "kupi.com"
	},
	{
		name: "Aviakassa",
		domain: "aviakassa.com"
	},
	{
		name: "Clickavia",
		domain: "clickavia.ru"
	},
	{
		name: "Kiwi.com",
		domain: "kiwi.com"
	},
	{
		name: "Farera",
		domain: "farera.com"
	},
	{
		name: "City.Travel",
		domain: "city.travel"
	},
	{
		name: "Tickets",
		domain: "tickets.ua"
	},
	{
		name: "Biletix",
		domain: "biletix.com"
	},
	{
		name: "Lucky2Go",
		domain: "lucky2go.com"
	},
	{
		name: "Wingie",
		domain: "wingie.com"
	},
	{
		name: "SuperKassa",
		domain: "superkassa.ru"
	},
	{
		name: "Jetradar",
		domain: "jetradar.com"
	},
	{
		name: "Kupibilet",
		domain: "kupibilet.ru"
	},
	{
		name: "Biletik.aero",
		domain: "biletik.aero"
	},
	{
		name: "OneTwoTrip",
		domain: "onetwotrip.com"
	},
	{
		name: "Multibilet",
		domain: "multibilet.ru"
	},
	{
		name: "Cheap.travel",
		domain: "cheap.travel"
	}
];
var COMPAGNIES_NORM = new Set(COMPAGNIES.map(normalize));
var AGENCES_PAR_NOM = new Map(AGENCES.map((a) => [normalize(a.name), a]));
/** Groupe affiché sans son suffixe « Group », qui alourdit sans rien apporter. */
function groupLabel(group) {
	return group.replace(/\s+Group$/i, "");
}
/**
* Nature d'un vendeur.
*
* `airline` est le nom de la compagnie qui opère le vol : quand le vendeur
* porte ce nom, c'est une vente directe même si la compagnie n'est pas encore
* listée. Sans ce rapprochement, toute nouvelle compagnie vendant en direct
* serait étiquetée « agence », ce qui serait faux.
*/
function sellerNature(seller, airline) {
	const nom = seller?.trim() ?? "";
	const inconnu = {
		kind: "agence",
		known: false,
		label: nom || "vendeur non communiqué",
		reviewsUrl: null
	};
	if (!nom) return inconnu;
	const vendeur = normalize(nom);
	if (!vendeur) return inconnu;
	if (COMPAGNIES_NORM.has(vendeur) || airline && normalize(airline) === vendeur) return {
		kind: "compagnie",
		known: true,
		label: nom,
		reviewsUrl: null
	};
	const agence = AGENCES_PAR_NOM.get(vendeur);
	if (!agence) return inconnu;
	const suffixeUtile = agence.group !== void 0 && normalize(agence.name) !== normalize(groupLabel(agence.group));
	return {
		kind: "agence",
		known: true,
		...agence.group ? { group: agence.group } : {},
		label: suffixeUtile && agence.group ? `${agence.name} (groupe ${groupLabel(agence.group)})` : agence.name,
		reviewsUrl: agence.domain ? `https://fr.trustpilot.com/review/${agence.domain}` : null
	};
}
var VERIFIED = "2026-09-01";
var PAR_CODE = new Map([
	{
		airline: "FR",
		name: "Ryanair",
		personalItem: { kind: "inclus" },
		cabinBag: {
			kind: "payant",
			minEur: 6,
			maxEur: 36
		},
		checkedBag: {
			kind: "payant",
			minEur: 19,
			maxEur: 60,
			weightKg: 20,
			atAirportEur: 60
		},
		source: "https://olyneia.com/blogs/infos/frais-bagage-ryanair-2026-comment-les-eviter",
		verifiedAt: VERIFIED,
		note: "Seul un petit sac sous le siège est compris. Le bagage cabine dans le coffre est payant."
	},
	{
		airline: "TO",
		name: "Transavia",
		personalItem: { kind: "inclus" },
		cabinBag: {
			kind: "inclus",
			weightKg: 10
		},
		checkedBag: {
			kind: "payant",
			minEur: 31,
			maxEur: 45,
			weightKg: 20,
			atAirportEur: 70
		},
		source: "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
		verifiedAt: VERIFIED
	},
	{
		airline: "V7",
		name: "Volotea",
		personalItem: { kind: "inclus" },
		cabinBag: {
			kind: "inclus",
			weightKg: 10
		},
		checkedBag: {
			kind: "payant",
			minEur: 15,
			maxEur: 34,
			weightKg: 20,
			atAirportEur: 65
		},
		source: "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
		verifiedAt: VERIFIED,
		note: "Le tarif du bagage en soute varie selon la saison."
	},
	{
		airline: "AH",
		name: "Air Algérie",
		personalItem: { kind: "inclus" },
		cabinBag: {
			kind: "inclus",
			weightKg: 10
		},
		checkedBag: {
			kind: "inclus",
			weightKg: 23
		},
		source: "https://ulysse.com/news/comparatif-vols-marseille-algerie-transavia-volotea-air-algerie-ete-2026",
		verifiedAt: VERIFIED,
		note: "Soute comprise dans le tarif de base, ce qui compense souvent un billet plus cher au départ."
	},
	{
		airline: "TU",
		name: "Tunisair",
		personalItem: { kind: "inclus" },
		cabinBag: {
			kind: "inclus",
			weightKg: 10
		},
		checkedBag: {
			kind: "inclus",
			weightKg: 23
		},
		source: "https://www.tunisair.com/en/guide-utilisateur/prepare-your-luggage",
		verifiedAt: VERIFIED,
		note: "23 kg sur la plupart des lignes ; jusqu'à 32 kg selon la destination et la cabine."
	},
	{
		airline: "BJ",
		name: "Nouvelair",
		personalItem: { kind: "inclus" },
		cabinBag: {
			kind: "inclus",
			weightKg: 10
		},
		checkedBag: {
			kind: "inclus",
			weightKg: 25
		},
		source: "https://www.marhba.com/voyages/tout-savoir-sur-la-franchise-bagage-de-nouvelair",
		verifiedAt: VERIFIED,
		note: "Offre Pack Easy : 10 kg en cabine et 25 kg en soute compris."
	},
	{
		airline: "U2",
		name: "easyJet",
		personalItem: { kind: "inclus" },
		cabinBag: {
			kind: "payant",
			minEur: 6,
			maxEur: 33
		},
		checkedBag: { kind: "inconnu" },
		source: "https://easyscape.eu/blog/regles-bagages-compagnies-low-cost-2026",
		verifiedAt: VERIFIED,
		note: "La soute se paie par tranches de 3 kg jusqu'à 32 kg : pas de tarif unique pour 20 kg."
	}
].map((p) => [p.airline, p]));
/** Politique bagages d'une compagnie, ou null si nous ne l'avons pas documentée. */
function baggagePolicy(airline) {
	if (!airline) return null;
	return PAR_CODE.get(airline.toUpperCase()) ?? null;
}
var BAGGAGE_LEVELS = [
	{
		value: "personnel",
		label: "Objet personnel seul",
		short: "Sac sous le siège"
	},
	{
		value: "cabine",
		label: "Bagage cabine",
		short: "Cabine"
	},
	{
		value: "soute",
		label: "Bagage en soute",
		short: "Soute"
	}
];
function allowanceFor(policy, level) {
	if (level === "personnel") return policy.personalItem;
	if (level === "cabine") return policy.cabinBag;
	return policy.checkedBag;
}
/**
* Supplément à ajouter au prix du billet pour voyager avec ce niveau de bagage.
*
* Les trois niveaux sont ALTERNATIFS, pas cumulatifs. Prendre une soute chez
* Ryanair n'oblige pas à payer aussi le bagage cabine : on garde l'objet
* personnel compris et on ajoute la soute. Additionner les deux gonflerait le
* prix annoncé — l'inverse exact de ce que ce comparateur prétend faire.
*/
function baggageSupplement(airline, level) {
	const policy = baggagePolicy(airline);
	if (!policy) return { kind: "inconnu" };
	const allowance = allowanceFor(policy, level);
	if (allowance.kind === "inconnu") return { kind: "inconnu" };
	if (allowance.kind === "inclus") return allowance.weightKg === void 0 ? { kind: "inclus" } : {
		kind: "inclus",
		weightKg: allowance.weightKg
	};
	return {
		kind: "payant",
		minEur: allowance.minEur,
		maxEur: allowance.maxEur,
		...allowance.weightKg === void 0 ? {} : { weightKg: allowance.weightKg },
		...allowance.atAirportEur === void 0 ? {} : { atAirportEur: allowance.atAirportEur }
	};
}
/**
* Prix du billet pour un niveau de bagage donné, ou null si nous ne savons pas.
* Toujours une estimation BASSE : on additionne le tarif publié le moins cher.
*/
function priceWithBaggage(priceEur, airline, level) {
	const supplement = baggageSupplement(airline, level);
	if (supplement.kind === "inconnu") return null;
	return supplement.kind === "inclus" ? priceEur : priceEur + supplement.minEur;
}
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
function formatDuration(minutes) {
	if (!minutes) return "Durée non communiquée";
	const h = Math.floor(minutes / 60);
	const m = minutes % 60;
	return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}
var formatTime = formatDateTimeCompact;
/**
* Seuil de fermeté du prix.
*
* Au-delà de 24 h, le montant n'est plus présenté comme un prix : il devient
* explicitement une estimation, et le bouton de réservation perd son style
* principal. Un tarif de plusieurs jours peut avoir dérivé de 30 % ou plus chez
* le vendeur au moment du clic — l'annoncer comme ferme serait une pratique
* commerciale trompeuse.
*
* La date de relevé vient du vendeur (`found_at` / `search_date` renvoyés par
* l'API), pas de notre propre rafraîchissement : nous constatons l'âge du prix,
* nous ne le maîtrisons pas.
*/
var ESTIMATE_THRESHOLD_MS = 864e5;
/** En deçà, le relevé est assez récent pour être signalé en vert. */
var FRESH_THRESHOLD_MS = 36e5;
/** Fraîcheur du relevé de prix, calculée côté client pour éviter tout écart SSR. */
function computeFreshness(iso) {
	const d = iso ? new Date(iso) : null;
	if (!d || Number.isNaN(d.getTime())) return {
		label: "date de relevé inconnue",
		tone: "ancien",
		estimate: true
	};
	const ageMs = Date.now() - d.getTime();
	const minutes = Math.max(0, Math.round(ageMs / 6e4));
	let label;
	if (minutes < 1) label = "relevé à l'instant";
	else if (minutes < 60) label = `relevé il y a ${minutes} min`;
	else {
		const hours = Math.round(minutes / 60);
		label = hours < 24 ? `relevé il y a ${hours} h` : `relevé le ${formatDateTimeShort(d.toISOString())}`;
	}
	return {
		label,
		tone: ageMs < FRESH_THRESHOLD_MS ? "frais" : ageMs <= ESTIMATE_THRESHOLD_MS ? "neutre" : "ancien",
		estimate: ageMs > ESTIMATE_THRESHOLD_MS
	};
}
/**
* `--warning` seul ne passe en texte dans aucun des deux thèmes : trop clair sur
* fond clair, et `--warning-foreground` est une couleur prévue POUR un fond
* warning. Au-delà de 24 h on utilise donc la paire telle qu'elle a été conçue,
* en pastille — ce qui appuie au passage l'avertissement.
*/
var TONE_CLASS = {
	frais: "text-success",
	neutre: "text-muted-foreground",
	ancien: "rounded-md bg-warning px-2 py-0.5 text-warning-foreground"
};
function useFreshness(iso) {
	const [freshness, setFreshness] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		setFreshness(computeFreshness(iso));
		const timer = setInterval(() => setFreshness(computeFreshness(iso)), 6e4);
		return () => clearInterval(timer);
	}, [iso]);
	return freshness;
}
function stopsLabel(stops) {
	if (stops === 0) return "Vol direct";
	return stops === 1 ? "1 escale" : `${stops} escales`;
}
/** Libellé d'un supplément bagage, tel qu'il apparaît dans la carte. */
function allowanceLabel(supplement) {
	if (supplement.kind === "inconnu") return "non documenté";
	if (supplement.kind === "inclus") return supplement.weightKg ? `compris (${supplement.weightKg} kg)` : "compris";
	const poids = supplement.weightKg ? ` (${supplement.weightKg} kg)` : "";
	return `+${supplement.minEur === supplement.maxEur ? `${supplement.minEur} €` : `${supplement.minEur} à ${supplement.maxEur} €`}${poids}`;
}
function allowanceClass(supplement) {
	if (supplement.kind === "inclus") return "font-medium text-success";
	if (supplement.kind === "inconnu") return "italic";
	return "font-medium text-foreground";
}
function FlightCard({ offer, greenest = false, baggageLevel = "personnel" }) {
	const { formatApi: format } = useCurrency();
	const freshness = useFreshness(offer.observedAt);
	const policy = baggagePolicy(offer.airlineCode);
	const vendeur = sellerNature(offer.seller, offer.airline);
	const departSecondaire = secondaryAirport(offer.originAirport);
	const arriveeSecondaire = secondaryAirport(offer.destinationAirport);
	const prixAffiche = priceWithBaggage(offer.priceEur, offer.airlineCode, baggageLevel) ?? offer.priceEur;
	const prixSoute = priceWithBaggage(offer.priceEur, offer.airlineCode, "soute");
	const soute = baggageSupplement(offer.airlineCode, "soute");
	const secondPrix = baggageLevel === "personnel" ? prixSoute !== null && prixSoute !== offer.priceEur ? {
		prefixe: "· ",
		montant: prixSoute,
		suffixe: `avec ${soute.kind === "payant" && soute.weightKg ? `${soute.weightKg} kg en soute` : "bagage en soute"}`
	} : null : prixAffiche !== offer.priceEur ? {
		prefixe: "· ",
		montant: offer.priceEur,
		suffixe: "sans bagage"
	} : null;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("article", {
		className: "rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1.5 text-sm font-semibold",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plane, {
									className: "size-4 text-primary",
									"aria-hidden": true
								}), offer.airline]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "secondary",
								children: stopsLabel(offer.stops)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: formatDuration(offer.durationMinutes)
							}),
							greenest && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
								className: "bg-success text-success-foreground",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Leaf, {
									className: "mr-1 size-3",
									"aria-hidden": true
								}), "Vol plus écologique"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm text-muted-foreground",
						children: [
							"Départ ",
							formatTime(offer.departureAt),
							offer.returnAt ? ` · retour ${formatTime(offer.returnAt)}` : " · aller simple",
							" · vol",
							" ",
							offer.flightNumber
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm",
						children: [
							airportLabel(offer.originAirport, offer.origin),
							" →",
							" ",
							airportLabel(offer.destinationAirport, offer.destination)
						]
					}),
					(departSecondaire || arriveeSecondaire) && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-1 space-y-0.5",
						children: [departSecondaire, arriveeSecondaire].filter(Boolean).map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
							className: "inline-flex items-start gap-1 text-xs text-warning-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
								className: "mt-0.5 size-3 shrink-0",
								"aria-hidden": true
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "rounded bg-warning px-1.5 py-0.5",
								children: [
									a.code,
									" est à ",
									a.distanceKm,
									" km de ",
									a.city,
									" — ",
									a.access,
									" à prévoir"
								]
							})]
						}, a.code))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex flex-wrap items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-sm font-medium",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Store, {
									className: "size-4 text-primary",
									"aria-hidden": true
								}),
								"Vendu par ",
								vendeur.label
							]
						}), vendeur.kind === "compagnie" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							className: "bg-success text-success-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BadgeCheck, {
								className: "mr-1 size-3",
								"aria-hidden": true
							}), "Vente directe compagnie"]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
							variant: "secondary",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Building2, {
								className: "mr-1 size-3",
								"aria-hidden": true
							}), "Agence en ligne"]
						})]
					}),
					vendeur.kind === "agence" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: ["Frais de service possibles à l'étape paiement, chez ce vendeur.", vendeur.reviewsUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [" ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
							href: vendeur.reviewsUrl,
							target: "_blank",
							rel: "noopener nofollow",
							className: "underline underline-offset-2 hover:text-foreground",
							children: "Voir les avis sur ce vendeur"
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 rounded-md border border-border/70 bg-secondary/40 p-2.5",
						children: policy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "inline-flex items-center gap-1.5 text-xs font-medium",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Luggage, {
										className: "size-3.5 shrink-0 text-primary",
										"aria-hidden": true
									}),
									"Bagages chez ",
									policy.name
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-1.5 space-y-0.5 text-xs text-muted-foreground",
								children: BAGGAGE_LEVELS.map((niveau) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex flex-wrap gap-x-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [niveau.short, " :"] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: allowanceClass(baggageSupplement(offer.airlineCode, niveau.value)),
										children: allowanceLabel(baggageSupplement(offer.airlineCode, niveau.value))
									})]
								}, niveau.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1.5 text-[11px] text-muted-foreground/80",
								children: [
									"Tarifs publiés par la compagnie, relevés le ",
									formatDateMedium(policy.verifiedAt),
									". Ils varient selon la ligne, la saison et le moment de l'achat."
								]
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "inline-flex items-start gap-1.5 text-xs text-muted-foreground",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Luggage, {
								className: "mt-0.5 size-3.5 shrink-0",
								"aria-hidden": true
							}), "Information bagage non fournie par ce vendeur — à vérifier chez lui avant de réserver."]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["Empreinte estimée : ", co2Label(offer.co2Kg)] })
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex shrink-0 flex-col items-start gap-1.5 sm:items-end",
				children: [
					freshness?.estimate ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-2xl font-medium text-muted-foreground",
						children: [
							"~",
							format(prixAffiche),
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-sm font-normal",
								children: "(estimation)"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-display text-2xl font-semibold",
						children: format(prixAffiche)
					}),
					secondPrix && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							secondPrix.prefixe,
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-medium text-foreground",
								children: format(secondPrix.montant)
							}),
							" ",
							secondPrix.suffixe
						]
					}),
					freshness && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: `inline-flex items-center gap-1 text-xs font-medium ${TONE_CLASS[freshness.tone]}`,
						children: [freshness.tone === "ancien" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
							className: "size-3 shrink-0",
							"aria-hidden": true
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, {
							className: "size-3 shrink-0",
							"aria-hidden": true
						}), freshness.label]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: freshness?.estimate ? "Estimation d'après un relevé ancien — prix à confirmer chez le vendeur" : "Prix total, taxes incluses"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: freshness?.estimate ? "outline" : "default",
						className: "mt-1",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
							href: offer.bookingUrl,
							target: "_blank",
							rel: "noopener noreferrer nofollow sponsored",
							children: [
								freshness?.estimate ? "Vérifier chez" : "Réserver chez",
								" ",
								offer.seller
							]
						})
					})
				]
			})]
		})
	});
}
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
/** Vue calendrier des prix affichée uniquement quand l'utilisateur la demande. */
function ResultsPriceCalendar({ origin, destination, departureAt, tripDuration, passengers, onSelectDate }) {
	const [month, setMonth] = (0, import_react.useState)(() => monthOf(departureAt));
	const { formatApi: format, currency } = useCurrency();
	const runCalendar = useServerFn(calendarPrices);
	const pricesQuery = useQuery({
		queryKey: [
			"results-calendar",
			origin,
			destination,
			month,
			tripDuration,
			passengers.adults,
			passengers.children,
			passengers.infants,
			currency
		],
		queryFn: () => runCalendar({ data: {
			origin,
			destination,
			month,
			tripDuration,
			currency,
			mode: "departure",
			adults: passengers.adults,
			children: passengers.children,
			infants: passengers.infants
		} })
	});
	const priceByDate = /* @__PURE__ */ new Map();
	for (const day of pricesQuery.data?.days ?? []) priceByDate.set(day.date, day.priceEur);
	const prices = [...priceByDate.values()];
	const min = prices.length ? Math.min(...prices) : 0;
	const max = prices.length ? Math.max(...prices) : 0;
	const days = daysInMonth(month);
	const firstWeekday = ((/* @__PURE__ */ new Date(`${month}-01T00:00:00Z`)).getUTCDay() + 6) % 7;
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-xl border border-border bg-card p-4",
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
				children: tripDuration > 0 ? `Prix aller-retour le plus bas par jour de départ (séjour de ${tripDuration} nuits).` : "Prix aller simple le plus bas par jour de départ."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground",
				children: WEEKDAYS.map((d, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: d }, `${d}-${i}`))
			}),
			pricesQuery.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-2 h-56 w-full" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 grid grid-cols-7 gap-1",
				children: [Array.from({ length: firstWeekday }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { "aria-hidden": true }, `empty-${i}`)), days.map((date) => {
					const price = priceByDate.get(date);
					const disabled = date < today;
					const l = price === void 0 ? null : level(price, min, max);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled,
						onClick: () => onSelectDate(date),
						"aria-label": price === void 0 ? formatDateLong(date) : `${formatDateLong(date)} : ${format(price)}`,
						className: cn("flex min-h-12 flex-col items-center justify-center rounded-md border p-0.5 text-center transition-colors", l === null && "border-border hover:bg-muted", l === "low" && "border-success/40 bg-success/10 hover:bg-success/20", l === "mid" && "border-warning/40 bg-warning/10 hover:bg-warning/20", l === "high" && "border-destructive/30 bg-destructive/10 hover:bg-destructive/20", departureAt === date && "ring-2 ring-ring", disabled && "cursor-not-allowed opacity-40"),
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
				children: "Impossible de charger les prix pour ce mois, réessayez plus tard."
			}),
			!pricesQuery.isPending && !pricesQuery.data?.error && (pricesQuery.data?.days?.length ?? 0) === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: "Aucun prix disponible pour ce mois sur ce trajet. Essayez un autre mois."
			})
		]
	});
}
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
function SearchResultsPage() {
	const search = Route.useSearch();
	const navigate = useNavigate({ from: Route.fullPath });
	const runSearch = useServerFn(searchFlights);
	const { currency } = useCurrency();
	const [directOnly, setDirectOnly] = (0, import_react.useState)(false);
	const [airline, setAirline] = (0, import_react.useState)("");
	const [morningOnly, setMorningOnly] = (0, import_react.useState)(false);
	const [maxDuration, setMaxDuration] = (0, import_react.useState)(0);
	const [view, setView] = (0, import_react.useState)("list");
	const [filtersOpen, setFiltersOpen] = (0, import_react.useState)(false);
	const [baggageLevel, setBaggageLevel] = (0, import_react.useState)("personnel");
	const [parisMainOnly, setParisMainOnly] = (0, import_react.useState)(false);
	const from = cityLabel(search["origin"]);
	const to = cityLabel(search["destination"]);
	const effectiveTripDuration = search["duree"] > 0 ? search["duree"] : nightsBetween(search["depart"], search["retour"]);
	const offersQuery = useQuery({
		queryKey: [
			"offers",
			search["origin"],
			search["destination"],
			search["depart"],
			search["retour"],
			search.flexible,
			search["adultes"],
			search["enfants"],
			search["bebes"],
			search["duree"],
			currency
		],
		queryFn: () => runSearch({ data: {
			origin: search["origin"],
			destination: search["destination"],
			departureAt: search["depart"],
			returnAt: search["retour"] || null,
			tripDuration: search["duree"],
			flexible: search["flexible"] === 1,
			adults: search["adultes"],
			children: search["enfants"],
			infants: search["bebes"],
			currency
		} })
	});
	const offers = offersQuery.data?.offers ?? [];
	const airlines = (0, import_react.useMemo)(() => Array.from(new Set(offers.map((o) => o.airline))).sort(), [offers]);
	/**
	* Prix de comparaison : celui du niveau de bagage demandé. Sans barème pour
	* la compagnie, on retombe sur le prix nu — jamais sur un supplément inventé.
	*/
	const prixComparaison = (offer) => priceWithBaggage(offer.priceEur, offer.airlineCode, baggageLevel) ?? offer.priceEur;
	const filtered = offers.filter((offer) => {
		if (directOnly && offer.stops > 0) return false;
		if (parisMainOnly && !PARIS_MAIN_AIRPORTS.includes(offer.originAirport)) return false;
		if (airline && offer.airline !== airline) return false;
		if (search["budget"] && prixComparaison(offer) > search["budget"]) return false;
		if (maxDuration && offer.durationMinutes > maxDuration * 60) return false;
		if (morningOnly) {
			if (new Date(offer.departureAt).getHours() >= 12) return false;
		}
		return true;
	}).sort((a, b) => prixComparaison(a) - prixComparaison(b));
	const cheapest = filtered[0] ?? offers[0];
	const greenestId = filtered.length ? filtered.reduce((best, o) => o.co2Kg < best.co2Kg ? o : best, filtered[0]).id : void 0;
	const filtersPanel = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex cursor-pointer items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: directOnly,
					onCheckedChange: (v) => setDirectOnly(v === true)
				}), "Vols directs uniquement"]
			}),
			search["origin"] === "PAR" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex cursor-pointer items-start gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: parisMainOnly,
					onCheckedChange: (v) => setParisMainOnly(v === true),
					className: "mt-0.5"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Aéroports parisiens principaux uniquement (CDG, ORY)", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "block text-xs text-muted-foreground",
					children: "Écarte Beauvais, à 85 km de Paris."
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex cursor-pointer items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checkbox, {
					checked: morningOnly,
					onCheckedChange: (v) => setMorningOnly(v === true)
				}), "Départ le matin (avant 12 h)"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "airline-filter",
					children: "Compagnie"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "airline-filter",
					value: airline,
					onChange: (e) => setAirline(e.target.value),
					className: "h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: "",
						children: "Toutes les compagnies"
					}), airlines.map((name) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
						value: name,
						children: name
					}, name))]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "space-y-1.5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "duration-filter",
					children: "Durée maximale"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
					id: "duration-filter",
					value: maxDuration,
					onChange: (e) => setMaxDuration(Number(e.target.value)),
					className: "h-9 w-full rounded-md border border-input bg-background px-2 text-sm",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 0,
							children: "Peu importe"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 4,
							children: "Moins de 4 h"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 8,
							children: "Moins de 8 h"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: 14,
							children: "Moins de 14 h"
						})
					]
				})]
			})
		]
	});
	const searchFormBlock = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SearchForm, {
		initialOrigin: search.origin,
		initialDestination: search.destination,
		initialDepart: search.depart,
		initialRetour: search.retour,
		initialFlexible: search.flexible === 1,
		initialDuree: search.duree,
		initialPassengers: {
			adults: search.adultes,
			children: search.enfants,
			infants: search.bebes
		},
		compact: true
	});
	const alertBlock = /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AlertForm, {
		origin: search.origin,
		destination: search.destination,
		departDate: search.depart,
		...search["retour"] ? { returnDate: search["retour"] } : {},
		referencePrice: cheapest?.priceEur ?? null
	});
	const resultsBlock = /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-5 space-y-4",
		children: [
			offersQuery.isPending && Array.from({ length: 4 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 w-full rounded-xl" }, i)),
			!offersQuery.isPending && !offersQuery.data?.error && offers.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-medium text-foreground",
						children: "Aucun vol trouvé pour ces dates, essayez d'élargir votre recherche."
					}),
					(offersQuery.data?.alternatives?.length ?? 0) > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2",
						children: [
							"Notre source de prix (mise à jour périodiquement) n'a pas de vol enregistré pour le",
							" ",
							formatDateLong(search["depart"]),
							" sur ",
							from,
							" — ",
							to,
							". Cela ne veut pas dire qu'aucun vol n'existe — voici les dates proches où nous avons trouvé des prix réels."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2",
						children: [
							"Notre source de prix n'a aucun vol enregistré sur ",
							from,
							" — ",
							to,
							" pour l'ensemble du mois de ",
							formatMonthLong(search["depart"].slice(0, 7)),
							". Essayez les dates flexibles ± 3 jours, un autre mois, ou un autre aéroport de départ."
						]
					}),
					(offersQuery.data?.alternatives?.length ?? 0) > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium text-foreground",
							children: "Dates réellement disponibles ce mois-ci :"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mt-2 flex flex-wrap gap-2",
							children: offersQuery.data?.alternatives.map((alt) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								variant: "outline",
								size: "sm",
								onClick: () => {
									navigate({ search: (prev) => ({
										...prev,
										depart: alt.date,
										retour: effectiveTripDuration > 0 ? addDaysIso(alt.date, effectiveTripDuration) : prev["retour"]
									}) });
								},
								children: [
									formatDateCompact(alt.date),
									" · ",
									alt.priceEur,
									" €"
								]
							}, alt.date))
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 flex flex-wrap gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => setView("calendar"),
							children: "Voir le calendrier des prix"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							variant: "outline",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "https://kiwi.tpm.lv/efaL5TCr",
								target: "_blank",
								rel: "noopener noreferrer nofollow sponsored",
								children: "Vérifier en temps réel sur Kiwi.com"
							})
						})]
					})
				]
			}),
			!offersQuery.isPending && offersQuery.data?.nearDateOnly && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-secondary/50 p-4 text-sm text-muted-foreground",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Notre source de prix (mise à jour périodiquement) n'a pas de vol enregistré pour le",
					" ",
					formatDateLong(search["depart"]),
					". Cela ne veut pas dire qu'aucun vol n'existe — voici les dates proches (± 3 jours) où nous avons trouvé des prix réels. La date de chaque vol est indiquée sur son résultat."
				] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					size: "sm",
					className: "mt-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://kiwi.tpm.lv/efaL5TCr",
						target: "_blank",
						rel: "noopener noreferrer nofollow sponsored",
						children: "Vérifier en temps réel sur Kiwi.com"
					})
				})]
			}),
			!offersQuery.isPending && offers.length > 0 && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "rounded-xl border border-border bg-card p-6 text-sm text-muted-foreground",
				children: "Aucun vol ne correspond à ces filtres. Essayez d'élargir les dates ou de retirer un filtre."
			}),
			filtered.map((offer, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "card-in",
				style: { animationDelay: `${Math.min(index, 6) * 40}ms` },
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-2 flex flex-wrap items-center gap-2",
					children: [index === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						className: "bg-success text-success-foreground",
						children: "Prix le plus bas trouvé"
					}), offer.departureAt.slice(0, 10) !== search["depart"] && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						children: ["Départ le ", formatDateCompact(offer.departureAt.slice(0, 10))]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FlightCard, {
					offer,
					greenest: offer.id === greenestId,
					baggageLevel
				})]
			}, offer.id))
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "container-page py-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
				className: "font-display",
				children: [
					"Vols ",
					from,
					" — ",
					to
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 max-w-2xl text-sm text-muted-foreground",
				children: [
					"Départ le ",
					formatDateLong(search.depart),
					search["retour"] ? `, retour le ${formatDateLong(search.retour)}` : " (aller simple)",
					search["duree"] > 0 ? ` · ${tripDurationLabel(search.duree)} (${search.duree} nuits)` : "",
					search["flexible"] === 1 ? " · dates flexibles ± 3 jours" : "",
					". Les prix affichés sont des prix totaux, taxes incluses pour",
					" ",
					passengersSummary({
						adults: search["adultes"],
						children: search["enfants"],
						infants: search["bebes"]
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-4 inline-flex items-start gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3 text-sm",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, {
					className: "mt-0.5 size-4 shrink-0 text-primary",
					"aria-hidden": true
				}), "Prix total taxes incluses. Des frais de service peuvent s'ajouter chez certains revendeurs — le vendeur est indiqué sur chaque offre."]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-2 text-xs text-muted-foreground",
				children: [
					"Vol déjà réservé, retardé ou annulé ?",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/indemnisation",
						className: "font-medium text-primary underline-offset-2 hover:underline",
						children: "Voir si vous avez droit à une indemnisation"
					}),
					"."
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 max-w-2xl text-xs text-muted-foreground",
				children: "Notre source tarifaire renvoie le meilleur prix trouvé par date de départ, pas la liste complète des vols du jour. Avec les dates flexibles ± 3 jours, vous obtenez un prix par date testée pour comparer les jours entre eux."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-8 lg:grid-cols-[320px_1fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "hidden space-y-6 lg:block",
					children: [
						searchFormBlock,
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-xl border border-border bg-card p-5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-base font-semibold",
								children: "Filtres"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-4",
								children: filtersPanel
							})]
						}),
						alertBlock
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("fieldset", {
						className: "mb-4 rounded-xl border border-border bg-card p-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("legend", {
								className: "px-1 text-sm font-medium",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "inline-flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Luggage, {
										className: "size-4 text-primary",
										"aria-hidden": true
									}), "Je voyage avec"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 flex flex-wrap gap-2",
								children: BAGGAGE_LEVELS.map((niveau) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									size: "sm",
									variant: baggageLevel === niveau.value ? "default" : "outline",
									"aria-pressed": baggageLevel === niveau.value,
									onClick: () => setBaggageLevel(niveau.value),
									children: niveau.label
								}, niveau.value))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted-foreground",
								children: baggageLevel === "personnel" ? "Prix du billet nu. Le prix avec bagage en soute est indiqué sous chaque montant quand nous connaissons le tarif de la compagnie." : "Les prix affichés incluent le supplément publié par la compagnie, et les résultats sont retriés en conséquence. Les compagnies dont nous n'avons pas le barème gardent leur prix nu, signalé sur leur carte."
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted-foreground",
							"aria-live": "polite",
							children: offersQuery.isPending ? "Recherche des meilleurs prix…" : filtered.length === 0 ? "Aucun prix réel disponible pour ces critères" : filtered.length === 1 ? "Meilleur prix trouvé pour ce trajet" : `${filtered.length} meilleurs prix trouvés (un par date testée)`
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex rounded-lg border border-border p-0.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "button",
								size: "sm",
								variant: view === "list" ? "default" : "ghost",
								onClick: () => setView("list"),
								children: "Liste"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								type: "button",
								size: "sm",
								variant: view === "calendar" ? "default" : "ghost",
								onClick: () => setView("calendar"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalendarDays, {
									className: "size-4",
									"aria-hidden": true
								}), "Calendrier des prix"]
							})]
						})]
					}),
					offersQuery.isError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
						children: "La recherche n'a pas abouti. Rechargez la page ou essayez d'autres dates."
					}),
					offersQuery.data?.error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive",
						children: offersQuery.data.error
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApiDebugPanel, {
						debug: offersQuery.data?.debug,
						label: "Recherche de vols"
					}),
					view === "list" ? resultsBlock : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-5",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsPriceCalendar, {
							origin: search.origin,
							destination: search.destination,
							departureAt: search.depart,
							tripDuration: effectiveTripDuration,
							passengers: {
								adults: search["adultes"],
								children: search["enfants"],
								infants: search["bebes"]
							},
							onSelectDate: (date) => {
								navigate({ search: (prev) => ({
									...prev,
									depart: date,
									retour: effectiveTripDuration > 0 ? addDaysIso(date, effectiveTripDuration) : prev["retour"]
								}) });
								setView("list");
							}
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 lg:hidden",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, {
							open: filtersOpen,
							onOpenChange: setFiltersOpen,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									type: "button",
									variant: "outline",
									size: "sm",
									className: "w-full sm:w-auto",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, {
										className: "size-4",
										"aria-hidden": true
									}), "Filtres"]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
								side: "bottom",
								className: "max-h-[85vh] overflow-y-auto",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTitle, { children: "Filtres et recherche" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-6 px-4 pb-8",
									children: [
										filtersPanel,
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											className: "w-full",
											onClick: () => setFiltersOpen(false),
											children: "Voir les prix trouvés"
										}),
										searchFormBlock,
										alertBlock
									]
								})]
							})]
						})
					})
				] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TravelPartnersSection, {
				className: "mt-12 border-t border-border pt-8",
				partners: ["assurance", "voiture"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Stay22Map, {
				className: "mt-10",
				city: to,
				...search.depart ? { checkin: search.depart } : {},
				...search.retour ? { checkout: search.retour } : {},
				title: "Et pour dormir sur place ?",
				description: `Hébergements disponibles à ${to}${search.depart ? ` pour votre séjour du ${formatDateLong(search.depart)}${search.retour ? ` au ${formatDateLong(search.retour)}` : ""}` : ""}, affichés sur une carte.`
			})
		]
	});
}
//#endregion
export { SearchResultsPage as component };
