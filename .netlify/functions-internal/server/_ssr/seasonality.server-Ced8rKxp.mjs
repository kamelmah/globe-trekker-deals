import { a as ROUTE_WHITELIST, r as DESTINATIONS } from "./route-whitelist-w8ea1sr9.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/seasonality.server-Ced8rKxp.js
/**
* Saisonnalité : relevé du prix le plus bas par mois de départ, route par route.
*
* Pourquoi route par route, alors qu'un balayage par ville de départ coûterait
* douze appels au lieu de 1 536 : mesuré, le balayage renvoie les meilleures
* affaires de l'origine, pas une matrice par mois. Il donne une médiane d'un
* seul mois par route, et trois routes marseillaises sur soixante-quatre
* atteignent six mois. Il ne peut donc pas produire une saisonnalité. Le coût
* plus élevé achète la seule donnée qui existe.
*
* Ces appels sont hors ligne et périodiques : aucun n'est déclenché par le
* chargement d'une page.
*/
var API = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";
/** Mois couverts par un relevé complet. */
var MOIS_COUVERTS = 12;
/** Routes traitées par invocation, pour que le travail soit étalé. */
var ROUTES_PAR_PASSAGE = 8;
/**
* Requêtes simultanées vers la source tarifaire.
*
* Était à 4 pour tenir sous le plafond de sous-requêtes de Cloudflare, que
* Netlify n'a pas. Mesuré sur trois routes réelles : 12 fait tomber le coût
* d'une route de 874 ms à 288 ms.
*/
var PARALLELISME = 12;
async function admin() {
	const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
	return supabaseAdmin;
}
/**
* Saisonnalité courante d'un trajet : le relevé le plus RÉCENT pour chaque mois
* de départ.
*
* Volontairement pas le minimum absolu de `price_history` : celui-ci ne se
* révise qu'à la baisse et finit par décrire un prix que plus personne ne
* trouve. Pour répondre à « quand partir », c'est le dernier prix constaté qui
* compte, et il est daté.
*/
async function fetchSeasonalityPoints(route) {
	try {
		const { data, error } = await (await admin()).from("price_observations").select("departure_month,lowest_price,observed_at").eq("origin", route.origin).eq("destination", route.destination).order("departure_month", { ascending: true }).order("observed_on", { ascending: false }).limit(400);
		if (error) throw error;
		const parMois = /* @__PURE__ */ new Map();
		for (const row of data ?? []) {
			const month = String(row.departure_month).slice(0, 7);
			if (parMois.has(month)) continue;
			parMois.set(month, {
				month,
				priceEur: Math.round(Number(row.lowest_price)),
				...row.observed_at ? { observedAt: String(row.observed_at) } : {}
			});
		}
		return [...parMois.values()];
	} catch (error) {
		console.error("Lecture de la saisonnalité impossible", error);
		return [];
	}
}
function prochainsMois(count) {
	const now = /* @__PURE__ */ new Date();
	return Array.from({ length: count }, (_, i) => {
		const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
		return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
	});
}
/** Prix le plus bas d'un mois, ou null. Aucune valeur n'est inventée ni lissée. */
async function lowestForMonth(route, month, token) {
	const url = new URL(API);
	for (const [key, value] of Object.entries({
		origin: route.origin,
		destination: route.destination,
		departure_at: month,
		one_way: "true",
		direct: "false",
		sorting: "price",
		limit: "30",
		currency: "eur",
		token
	})) url.searchParams.set(key, value);
	for (let essai = 0; essai < 3; essai += 1) try {
		const res = await fetch(url, {
			headers: { Accept: "application/json" },
			signal: AbortSignal.timeout(2e4)
		});
		if (res.status === 429 || res.status >= 500) {
			await new Promise((r) => setTimeout(r, 1200 * (essai + 1)));
			continue;
		}
		if (!res.ok) return null;
		const json = await res.json();
		const prix = (Array.isArray(json.data) ? json.data : []).filter((o) => String(o.departure_at ?? "").startsWith(month)).map((o) => Number(o.price)).filter((p) => Number.isFinite(p) && p > 0);
		return prix.length ? Math.min(...prix) : null;
	} catch {
		await new Promise((r) => setTimeout(r, 1e3 * (essai + 1)));
	}
	return null;
}
/** Toutes les pages /vols : liste blanche et pages éditoriales, dédoublonnées. */
function allRoutes() {
	const parCle = /* @__PURE__ */ new Map();
	for (const r of [...ROUTE_WHITELIST, ...DESTINATIONS]) {
		const origin = r.origin.toUpperCase();
		const destination = r.destination.toUpperCase();
		const cle = `${origin}-${destination}`;
		if (!parCle.has(cle)) parCle.set(cle, {
			origin,
			destination
		});
	}
	return [...parCle.values()];
}
/**
* Les routes les plus anciennement relevées d'abord, celles jamais relevées
* avant tout.
*
* C'est ce qui rend le travail reprenable sans curseur à tenir : un échec au
* milieu ne laisse aucun état à réparer, il laisse simplement des routes
* anciennes, que le passage suivant reprendra en premier. Rien n'oblige jamais
* à tout relancer.
*/
async function stalestRoutes(limit) {
	const toutes = allRoutes();
	const vues = /* @__PURE__ */ new Map();
	try {
		const { data } = await (await admin()).from("price_observations").select("origin,destination,observed_on").order("observed_on", { ascending: false }).limit(5e3);
		for (const row of data ?? []) {
			const cle = `${row.origin}-${row.destination}`;
			if (!vues.has(cle)) vues.set(cle, String(row.observed_on));
		}
	} catch (error) {
		console.error("Ordre de fraîcheur indisponible", error);
	}
	const triees = [...toutes].sort((a, b) => {
		const va = vues.get(`${a.origin}-${a.destination}`) ?? "";
		const vb = vues.get(`${b.origin}-${b.destination}`) ?? "";
		return va.localeCompare(vb);
	});
	const aujourdhui = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	const restantes = triees.filter((r) => (vues.get(`${r.origin}-${r.destination}`) ?? "") < aujourdhui).length;
	return {
		routes: triees.slice(0, limit),
		restantes
	};
}
/**
* Écrit les douze mois d'une route en trois requêtes au lieu de trente-six.
*
* Ce n'est pas de l'optimisation gratuite : un Worker Cloudflare est plafonné
* en nombre de sous-requêtes par invocation (50 sur le palier gratuit). Écrire
* mois par mois faisait dépasser ce plafond dès trois routes, et l'invocation
* échouait au milieu — sans casser quoi que ce soit, mais sans avancer non plus.
*/
async function recordRoute(route, releves) {
	if (releves.length === 0) return 0;
	const db = await admin();
	const maintenant = (/* @__PURE__ */ new Date()).toISOString();
	const moisSql = (month) => `${month}-01`;
	const { error: erreurObservations } = await db.from("price_observations").upsert(releves.map((r) => ({
		origin: route.origin,
		destination: route.destination,
		departure_month: moisSql(r.month),
		lowest_price: r.priceEur,
		currency: "eur",
		observed_at: maintenant
	})), { onConflict: "origin,destination,departure_month,observed_on" });
	if (erreurObservations) throw erreurObservations;
	const { data: existantes, error: erreurLecture } = await db.from("price_history").select("id,month,lowest_price").eq("origin", route.origin).eq("destination", route.destination).in("month", releves.map((r) => moisSql(r.month)));
	if (erreurLecture) throw erreurLecture;
	const parMois = new Map((existantes ?? []).map((row) => [String(row.month).slice(0, 10), row]));
	const aInserer = [];
	const aBaisser = [];
	for (const releve of releves) {
		const dejaLa = parMois.get(moisSql(releve.month));
		if (!dejaLa) aInserer.push({
			origin: route.origin,
			destination: route.destination,
			month: moisSql(releve.month),
			lowest_price: releve.priceEur,
			currency: "eur",
			updated_at: maintenant,
			observed_at: maintenant
		});
		else if (releve.priceEur < Number(dejaLa.lowest_price)) aBaisser.push({
			id: dejaLa.id,
			priceEur: releve.priceEur
		});
	}
	if (aInserer.length > 0) {
		const { error } = await db.from("price_history").insert(aInserer);
		if (error) throw error;
	}
	for (const baisse of aBaisser) {
		const { error } = await db.from("price_history").update({
			lowest_price: baisse.priceEur,
			updated_at: maintenant,
			observed_at: maintenant
		}).eq("id", baisse.id);
		if (error) throw error;
	}
	return releves.length;
}
/**
* Un passage : les `routes` les plus anciennement relevées, douze mois chacune.
*
* Une route coûte 12 appels tarifaires et 3 écritures, soit 15 sous-requêtes.
* C'est ce chiffre qui décide du nombre de routes tenable par invocation, pas
* la durée.
*/
async function ingestSeasonality(params) {
	const debut = Date.now();
	const token = process.env["TRAVELPAYOUTS_TOKEN"];
	if (!token) throw new Error("TRAVELPAYOUTS_TOKEN absent : aucun relevé possible.");
	const { routes, restantes } = await stalestRoutes(params?.routes ?? ROUTES_PAR_PASSAGE);
	const mois = prochainsMois(params?.months ?? MOIS_COUVERTS);
	let appels = 0;
	let moisEcrits = 0;
	let echecs = 0;
	for (const route of routes) {
		const releves = [];
		let curseur = 0;
		await Promise.all(Array.from({ length: PARALLELISME }, async () => {
			for (;;) {
				const month = mois[curseur++];
				if (!month) return;
				const priceEur = await lowestForMonth(route, month, token);
				appels += 1;
				if (priceEur !== null) releves.push({
					month,
					priceEur
				});
			}
		}));
		try {
			moisEcrits += await recordRoute(route, releves);
		} catch (error) {
			echecs += 1;
			console.error(`Relevés non enregistrés ${route.origin}-${route.destination}`, error);
		}
	}
	return {
		routesTraitees: routes.length,
		routesRestantes: Math.max(0, restantes - routes.length),
		appels,
		moisEcrits,
		echecs,
		dureeMs: Date.now() - debut
	};
}
//#endregion
export { fetchSeasonalityPoints, ingestSeasonality };
