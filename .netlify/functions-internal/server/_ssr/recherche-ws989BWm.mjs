import { N as redirect, h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { i as cityLabel } from "./airports-DEvng4YS.mjs";
import { r as addDaysIso } from "./trip-duration-Dr4Tuig8.mjs";
import { a as todayPlus, i as numberOr, n as iataOr, t as dateOr } from "./search-params-CajpETpS.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/recherche-ws989BWm.js
var $$splitComponentImporter = () => import("./recherche-BuFcfjhg.mjs");
var Route = createFileRoute("/recherche")({
	/**
	* `validateSearch` ne reçoit que ce que porte l'URL : un paramètre absent
	* prend sa valeur par défaut, jamais celle de la recherche précédente.
	*
	* La destination n'a volontairement PAS de valeur par défaut. Elle valait
	* "RAK" : une URL sans destination affichait donc des résultats Marrakech
	* qu'aucun visiteur n'avait demandés — et ce, quelle que soit la navigation
	* précédente. Sans destination, il n'y a pas de trajet à afficher : la
	* recherche relève du mode budget, et `beforeLoad` y redirige.
	*/
	validateSearch: (search) => {
		const duree = Math.min(30, Math.max(0, Math.round(numberOr(search["duree"], 0))));
		const depart = dateOr(search["depart"], todayPlus(30));
		return {
			origin: iataOr(search["origin"], "PAR"),
			destination: iataOr(search["destination"], ""),
			depart,
			retour: duree > 0 ? addDaysIso(depart, duree) : dateOr(search["retour"], ""),
			duree,
			flexible: numberOr(search["flexible"], 1) ? 1 : 0,
			budget: Math.max(0, numberOr(search["budget"], 0)),
			adultes: Math.min(9, Math.max(1, Math.round(numberOr(search["adultes"], 1)))),
			enfants: Math.min(8, Math.max(0, Math.round(numberOr(search["enfants"], 0)))),
			bebes: Math.min(Math.min(9, Math.max(1, Math.round(numberOr(search["adultes"], 1)))), Math.max(0, Math.round(numberOr(search["bebes"], 0))))
		};
	},
	/**
	* Une recherche sans destination est une recherche par budget : c'est déjà
	* ce que fait le formulaire quand le champ destination est laissé vide. On
	* conserve les critères saisis plutôt que d'inventer une destination.
	*/
	beforeLoad: ({ search }) => {
		if (search.destination) return;
		throw redirect({
			to: "/mode-budget",
			search: {
				origin: search.origin,
				budget: search.budget > 0 ? search.budget : 400,
				month: search.depart ? search.depart.slice(0, 7) : "",
				adultes: search.adultes,
				enfants: search.enfants,
				bebes: search.bebes
			}
		});
	},
	head: ({ match }) => {
		const from = cityLabel(match.search["origin"]);
		const to = cityLabel(match.search["destination"]);
		const title = `Vols ${from} — ${to} : comparer les prix totaux | TrouveMonVol`;
		const description = `Résultats de vols ${from} — ${to} triés par prix total taxes incluses, avec le vendeur réel de chaque billet et une vue calendrier des prix du mois.`;
		return { meta: [
			{ title },
			{
				name: "description",
				content: description
			},
			{
				name: "robots",
				content: "noindex, follow"
			},
			{
				property: "og:title",
				content: title
			},
			{
				property: "og:description",
				content: description
			}
		] };
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as t };
