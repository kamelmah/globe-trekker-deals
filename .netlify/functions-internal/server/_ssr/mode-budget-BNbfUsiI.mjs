import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cheapestDestinations } from "./flights.functions-2XDL4V6N.mjs";
import { i as numberOr, n as iataOr, r as monthOr } from "./search-params-CajpETpS.mjs";
import { r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/mode-budget-BNbfUsiI.js
var $$splitComponentImporter = () => import("./mode-budget-DsKOP-zS.mjs");
var TITLE = "Mode budget : où partir avec votre budget | TrouveMonVol";
var DESCRIPTION = "Indiquez votre budget et votre ville de départ, puis explorez sur une carte du monde interactive toutes les destinations accessibles à ce prix, taxes incluses.";
function clampPassengers(search) {
	const adults = Math.min(9, Math.max(1, Math.round(numberOr(search["adultes"], 1))));
	return {
		adults,
		children: Math.min(8, Math.max(0, Math.round(numberOr(search["enfants"], 0)))),
		infants: Math.min(adults, Math.max(0, Math.round(numberOr(search["bebes"], 0))))
	};
}
var Route = createFileRoute("/mode-budget")({
	validateSearch: (search) => {
		const passengers = clampPassengers(search);
		return {
			origin: iataOr(search["origin"], "PAR"),
			budget: Math.max(20, numberOr(search["budget"], 400)),
			month: monthOr(search["month"], ""),
			adultes: passengers.adults,
			enfants: passengers.children,
			bebes: passengers.infants
		};
	},
	loader: async ({ location }) => {
		const rawSearch = location.search;
		const origin = iataOr(rawSearch["origin"], "PAR");
		const month = monthOr(rawSearch["month"], "");
		const passengers = clampPassengers(rawSearch);
		const { prices, error, debug } = await cheapestDestinations({ data: {
			origin,
			world: true,
			adults: passengers.adults,
			children: passengers.children,
			infants: passengers.infants,
			...month ? { month } : {}
		} });
		return {
			prices,
			error,
			debug
		};
	},
	head: () => ({
		meta: [
			{ title: TITLE },
			{
				name: "description",
				content: DESCRIPTION
			},
			{
				property: "og:title",
				content: TITLE
			},
			{
				property: "og:description",
				content: DESCRIPTION
			},
			{
				property: "og:url",
				content: `${SITE_URL}/mode-budget`
			},
			{
				property: "og:image",
				content: DEFAULT_OG_IMAGE
			},
			{
				name: "twitter:image",
				content: DEFAULT_OG_IMAGE
			}
		],
		links: [{
			rel: "canonical",
			href: `${SITE_URL}/mode-budget`
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
