import { h as createFileRoute, m as lazyRouteComponent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as cheapestDestinations } from "./flights.functions-2XDL4V6N.mjs";
import { i as numberOr, n as iataOr, t as dateOr } from "./search-params-CajpETpS.mjs";
import { r as SITE_URL, t as DEFAULT_OG_IMAGE } from "./site-wHW1AJjJ.mjs";
import { t as HOME_DESTINATION_CODES } from "./price-refresh.shared-2Es62p8D.mjs";
import { t as hreflangLinks } from "./hreflang-Bl9HBMS6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Deo91hhv.js
/**
* FAQ de l'accueil.
*
* Elle porte sur le fonctionnement du service, là où celle des pages
* destinations porte sur un trajet : aucune question n'est dupliquée d'une
* page à l'autre. Le même tableau alimente l'affichage et le balisage JSON-LD,
* pour qu'ils ne puissent pas diverger.
*/
var HOME_FAQ = [
	{
		question: "TrouveMonVol est-il gratuit ?",
		answer: "Oui. Nous ne prenons aucun frais de service et n'ajoutons rien au tarif du vendeur. Notre rémunération est une commission d'affiliation versée par le vendeur lorsqu'une réservation aboutit, sans surcoût pour vous. Elle ne modifie jamais l'ordre des résultats, classés par prix."
	},
	{
		question: "Le prix affiché est-il vraiment le prix final ?",
		answer: "C'est le prix total : taxes et frais obligatoires sont déjà inclus, sans tarif d'appel qui gonfle au paiement. Deux réserves que nous préférons écrire plutôt que taire — certains revendeurs ajoutent des frais de service au moment de payer, et le bagage en soute n'est presque jamais compris dans les tarifs les plus bas."
	},
	{
		question: "À quelle fréquence les prix sont-ils mis à jour ?",
		answer: "Environ une fois par heure en journée, avec des intervalles plus longs la nuit ; la cadence réellement mesurée est affichée en bas de la page de résultats. Mais la date qui compte est celle du vendeur : c'est lui qui a daté son tarif, et aucune actualisation de notre côté ne peut la rajeunir. C'est cette date-là que porte chaque prix."
	},
	{
		question: "Les bagages sont-ils inclus dans le prix ?",
		answer: "Rarement sur les tarifs les plus bas. Quand la compagnie publie son barème, nous affichons deux prix : le tarif de base et le tarif avec bagage en soute. Quand elle ne le publie pas, nous le disons au lieu de deviner. Un filtre en tête des résultats permet de ne garder que les offres dont le bagage est documenté."
	},
	{
		question: "Chez qui est-ce que je réserve ?",
		answer: "Jamais chez nous : nous ne vendons pas de billets. Chaque offre porte le nom du vendeur et sa nature — vente directe par la compagnie, ou agence en ligne — avec un lien pour consulter les avis le concernant avant de réserver. Dans les faits, la grande majorité des tarifs les plus bas passent par des agences."
	},
	{
		question: "Pourquoi certains vols « Paris » partent-ils de Beauvais ?",
		answer: "Parce que les compagnies à bas coût vendent Beauvais sous le libellé Paris, alors que l'aéroport est à 85 km du centre et impose une navette, en temps comme en budget. Nous affichons l'aéroport réel sur chaque offre et signalons ces aéroports secondaires, à Paris comme à Milan, Bruxelles ou Barcelone. Un filtre permet de s'en tenir à Roissy et Orly."
	},
	{
		question: "Puis-je être prévenu quand le prix baisse ?",
		answer: "Oui, gratuitement. Vous créez une alerte sur un trajet et une date, et vous recevez un e-mail dès qu'un tarif passe sous celui relevé au moment de la création. Chaque message contient un lien de désinscription en un clic."
	}
];
var $$splitComponentImporter = () => import("./routes-D_3zKrgs.mjs");
var HOME_CODES = HOME_DESTINATION_CODES;
/** Marseille est le départ de référence du site : il est mis en avant sur l'accueil. */
var TITLE = "TrouveMonVol — comparateur de vols transparent, prix total et vendeur affiché";
var DESCRIPTION = "Comparez les vols au prix total taxes incluses, avec le nom du vendeur réel sur chaque résultat. Recherche par budget, dates flexibles ± 3 jours, alertes prix gratuites.";
var Route = createFileRoute("/")({
	/**
	* N'émet QUE les paramètres réellement présents dans l'URL.
	*
	* Renvoyer une valeur par défaut pour chaque clé faisait réécrire l'URL par
	* le routeur : `/` répondait 307 vers
	* `/?origin=&destination=&depart=&retour=&budget=0&flexible=true&…`. Chaque
	* visite de la page d'accueil payait donc un aller-retour réseau complet
	* avant même de recevoir un octet de HTML — et une 307 ne se met pas en cache
	* en edge, ce qui privait la page la plus visitée du site de tout cache CDN.
	*
	* Les valeurs par défaut sont appliquées à la lecture (voir `prefill`), pas
	* écrites dans l'URL.
	*/
	validateSearch: (search) => {
		const clamp = (v, min, max, fallback) => {
			const n = Math.round(numberOr(v, fallback));
			return Math.min(max, Math.max(min, n));
		};
		const origin = search["origin"] ? iataOr(search["origin"], "PAR") : "";
		const destination = search["destination"] ? iataOr(search["destination"], "") : "";
		const depart = dateOr(search["depart"], "");
		const retour = dateOr(search["retour"], "");
		const budget = Math.max(0, Math.round(numberOr(search["budget"], 0)));
		return {
			...origin ? { origin } : {},
			...destination ? { destination } : {},
			...depart ? { depart } : {},
			...retour ? { retour } : {},
			...budget > 0 ? { budget } : {},
			...search["flexible"] === void 0 ? {} : { flexible: numberOr(search["flexible"], 1) === 1 },
			...search["adultes"] === void 0 ? {} : { adultes: clamp(search["adultes"], 1, 9, 1) },
			...search["enfants"] === void 0 ? {} : { enfants: clamp(search["enfants"], 0, 8, 0) },
			...search["bebes"] === void 0 ? {} : { bebes: clamp(search["bebes"], 0, 8, 0) }
		};
	},
	loader: async () => {
		try {
			const { prices, error } = await cheapestDestinations({ data: {
				origin: "PAR",
				destinations: HOME_CODES
			} });
			return {
				prices,
				error
			};
		} catch {
			return {
				prices: [],
				error: "Les prix ne sont pas disponibles pour le moment. Réessayez dans quelques instants."
			};
		}
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
				content: SITE_URL
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
			href: `${SITE_URL}/`
		}, ...hreflangLinks(`${SITE_URL}/`)],
		scripts: [{
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "WebSite",
				name: "TrouveMonVol",
				url: SITE_URL,
				inLanguage: "fr-FR",
				description: DESCRIPTION,
				potentialAction: {
					"@type": "SearchAction",
					target: {
						"@type": "EntryPoint",
						urlTemplate: `${SITE_URL}/recherche?origin=PAR&destination={search_term_string}`
					},
					"query-input": "required name=search_term_string"
				}
			})
		}, {
			type: "application/ld+json",
			children: JSON.stringify({
				"@context": "https://schema.org",
				"@type": "FAQPage",
				url: `${SITE_URL}/`,
				inLanguage: "fr",
				mainEntity: HOME_FAQ.map((item) => ({
					"@type": "Question",
					name: item.question,
					acceptedAnswer: {
						"@type": "Answer",
						text: item.answer
					}
				}))
			})
		}]
	}),
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
//#endregion
export { Route as n, HOME_FAQ as t };
