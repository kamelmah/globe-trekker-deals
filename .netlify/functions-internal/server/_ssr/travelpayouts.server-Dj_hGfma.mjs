import { o as getAirport, t as AIRPORTS } from "./airports-DEvng4YS.mjs";
import { t as logOps } from "./ops-log.server-rlNyfr2_.mjs";
import { n as estimateCo2Kg } from "./co2-DK0-3ik4.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/travelpayouts.server-Dj_hGfma.js
var API_BASE = "https://api.travelpayouts.com";
function getCredentials() {
	const token = process.env["TRAVELPAYOUTS_TOKEN"];
	const marker = process.env["TRAVELPAYOUTS_MARKER"] ?? "";
	if (!token) return null;
	return {
		token,
		marker
	};
}
function hasApiCredentials() {
	return getCredentials() !== null;
}
/** Toute donnée affichée provient de l'API : en cas d'échec on remonte l'erreur. */
var TravelpayoutsError = class extends Error {
	/**
	* Erreur de configuration serveur (clé API absente) plutôt qu'une panne
	* ponctuelle du service — jamais un message aussi technique ne doit
	* atteindre un visiteur, contrairement aux autres erreurs de cette classe
	* qui sont déjà rédigées pour être lues telles quelles.
	*/
	configError;
	constructor(message, options) {
		super(message);
		this.name = "TravelpayoutsError";
		this.configError = options?.configError ?? false;
	}
};
var AIRLINE_NAMES = {
	AF: "Air France",
	TO: "Transavia",
	FR: "Ryanair",
	U2: "easyJet",
	V7: "Volotea",
	IB: "Iberia",
	VY: "Vueling",
	TP: "TAP Air Portugal",
	LH: "Lufthansa",
	KL: "KLM",
	TK: "Turkish Airlines",
	EK: "Emirates",
	QR: "Qatar Airways",
	AT: "Royal Air Maroc",
	AH: "Air Algérie",
	JL: "Japan Airlines",
	NH: "ANA",
	DL: "Delta Air Lines",
	UA: "United Airlines",
	AZ: "ITA Airways",
	A3: "Aegean Airlines",
	MS: "EgyptAir",
	TU: "Tunisair"
};
function airlineName(code) {
	if (!code) return "Compagnie non communiquée";
	return AIRLINE_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}
/**
* Certains partenaires Travelpayouts renvoient leur raison sociale localisée
* (en cyrillique) dans le champ `gate`/`agent`. On normalise ces noms vers leur
* marque commerciale latine pour ne jamais afficher un vendeur illisible.
*/
var SELLER_ALIASES = {
	авиасейлс: "Aviasales",
	авиасэйлс: "Aviasales",
	аviasales: "Aviasales",
	джетрадар: "Jetradar",
	купибилет: "Kupibilet",
	"билетик аэро": "Biletik.aero",
	билетикаэро: "Biletik.aero",
	"трип.ком": "Trip.com",
	тинькофф: "Tinkoff Travel",
	аэрофлот: "Aeroflot",
	победа: "Pobeda",
	с7: "S7 Airlines",
	"уральские авиалинии": "Ural Airlines",
	оnetwotrip: "OneTwoTrip",
	вантутрип: "OneTwoTrip",
	клиkавиа: "Clickavia",
	кликавиа: "Clickavia",
	мультибилет: "Multibilet",
	"чип.трэвел": "Cheap.travel"
};
var NON_LATIN_RE = /[^\u0000-\u024F]/;
/** Le vendeur affiché est celui renvoyé par l'API (champ gate/agent), normalisé. */
function resolveSeller(gate, airline) {
	const raw = typeof gate === "string" ? gate.trim() : "";
	if (raw.length <= 1) return airline;
	const alias = SELLER_ALIASES[raw.toLowerCase()];
	if (alias) return alias;
	if (NON_LATIN_RE.test(raw)) {
		const latin = raw.replace(/[^\u0020-\u024F]/g, "").replace(/\s{2,}/g, " ").trim();
		return latin.length > 1 ? latin : airline;
	}
	return raw;
}
function bookingUrlFromApiLink(link, marker, passengers) {
	const url = new URL(link, "https://www.aviasales.com");
	if (marker && !url.searchParams.has("marker")) url.searchParams.set("marker", marker);
	if (passengers) {
		const total = Math.min(9, Math.max(1, passengers.adults + passengers.children + passengers.infants));
		url.pathname = url.pathname.replace(/(\/search\/[A-Z0-9]+?)\d$/i, `$1${total}`);
		url.searchParams.set("adults", String(passengers.adults));
		if (passengers.children > 0) url.searchParams.set("children", String(passengers.children));
		if (passengers.infants > 0) url.searchParams.set("infants", String(passengers.infants));
	}
	return url.toString();
}
async function callApi(path, params, currency = "eur") {
	const creds = getCredentials();
	if (!creds) throw new TravelpayoutsError("La clé API Travelpayouts n'est pas configurée sur le serveur (TRAVELPAYOUTS_TOKEN).", { configError: true });
	const search = new URLSearchParams({
		...params,
		currency: currency.toLowerCase(),
		token: creds.token
	});
	const startedAt = Date.now();
	let res;
	try {
		res = await fetch(`${API_BASE}${path}?${search.toString()}`, { headers: { Accept: "application/json" } });
	} catch (error) {
		logOps({
			kind: "travelpayouts",
			label: path,
			ok: false,
			durationMs: Date.now() - startedAt,
			message: error instanceof Error ? error.message : "échec réseau",
			context: params
		});
		throw new TravelpayoutsError("Le service de prix est momentanément injoignable.");
	}
	const text = await res.text();
	let parsed = text;
	let body = text;
	try {
		parsed = JSON.parse(text);
		body = JSON.stringify(parsed, null, 2);
	} catch {}
	const raw = {
		endpoint: path,
		params,
		status: res.status,
		body
	};
	if (!res.ok) {
		logOps({
			kind: "travelpayouts",
			label: path,
			ok: false,
			status: res.status,
			durationMs: Date.now() - startedAt,
			message: text.slice(0, 300),
			context: params
		});
		throw new TravelpayoutsError("Impossible de charger les prix pour le moment, réessayez plus tard.");
	}
	logOps({
		kind: "travelpayouts",
		label: path,
		ok: true,
		status: res.status,
		resultCount: countResults(parsed),
		durationMs: Date.now() - startedAt,
		context: params
	});
	return {
		data: parsed,
		raw
	};
}
/** Nombre d'éléments réellement renvoyés par l'API, quand la forme est connue. */
function countResults(parsed) {
	if (Array.isArray(parsed)) return parsed.length;
	if (parsed && typeof parsed === "object" && "data" in parsed) {
		const value = parsed.data;
		if (Array.isArray(value)) return value.length;
		if (value && typeof value === "object") return Object.keys(value).length;
	}
	return null;
}
/**
* Date réelle d'observation du prix. Malgré la documentation, l'API ne
* renvoie jamais de champ `found_at` exploitable dans les réponses réelles
* (vérifié en direct) — la seule donnée de fraîcheur fiable est le paramètre
* `search_date` (format DDMMYYYY) caché dans le lien de réservation, posé
* par Travelpayouts au moment où CE tarif précis a été mis en cache. Sans
* cette donnée, on renvoie `null` plutôt que l'instant présent : un prix
* dont on ignore l'âge ne doit jamais être présenté comme "à l'instant".
*/
function extractObservedAt(link, foundAt) {
	if (foundAt) {
		const d = new Date(foundAt);
		if (!Number.isNaN(d.getTime())) return d.toISOString();
	}
	const match = link?.match(/[?&]search_date=(\d{2})(\d{2})(\d{4})/);
	if (match) {
		const [, dd, mm, yyyy] = match;
		const d = /* @__PURE__ */ new Date(`${yyyy}-${mm}-${dd}T12:00:00Z`);
		if (!Number.isNaN(d.getTime())) return d.toISOString();
	}
	return null;
}
function offersFromApi(list, marker, passengers) {
	return list.filter((offer) => typeof offer?.link === "string" && offer.link.length > 0).map((offer, index) => {
		const airline = airlineName(offer.airline);
		const stops = offer.transfers ?? 0;
		return {
			id: `${offer.origin}-${offer.destination}-${offer.departure_at}-${index}`,
			origin: offer.origin,
			destination: offer.destination,
			originAirport: offer.origin_airport ?? offer.origin,
			destinationAirport: offer.destination_airport ?? offer.destination,
			priceEur: Math.round(offer.price),
			airline,
			airlineCode: offer.airline,
			seller: resolveSeller(offer.gate, airline),
			flightNumber: offer.flight_number ? `${offer.airline}${offer.flight_number}` : "",
			departureAt: offer.departure_at,
			returnAt: offer.return_at ?? null,
			durationMinutes: offer.duration ?? offer.duration_to ?? 0,
			stops,
			co2Kg: estimateCo2Kg(offer.origin, offer.destination, stops),
			observedAt: extractObservedAt(offer.link, offer.found_at),
			bookingUrl: bookingUrlFromApiLink(offer.link, marker, passengers)
		};
	}).sort((a, b) => a.priceEur - b.priceEur);
}
async function fetchOffers(params) {
	const creds = getCredentials();
	const query = {
		origin: params.origin,
		destination: params.destination,
		departure_at: params.departureAt.slice(0, 10),
		unique: "false",
		sorting: "price",
		direct: "false",
		limit: "30",
		one_way: params.returnAt ? "false" : "true"
	};
	if (params.returnAt) query["return_at"] = params.returnAt.slice(0, 10);
	const adults = Math.min(9, Math.max(1, params.adults ?? 1));
	const children = Math.min(8, Math.max(0, params.children ?? 0));
	const infants = Math.min(adults, Math.max(0, params.infants ?? 0));
	query["adults"] = String(adults);
	if (children > 0) query["children"] = String(children);
	if (infants > 0) query["infants"] = String(infants);
	query["passengers"] = String(adults + children + infants);
	const { data, raw } = await callApi("/aviasales/v3/prices_for_dates", query, params.currency);
	let list = data?.data ?? [];
	let exactDate = list.length > 0;
	if (list.length === 0) {
		const day = params.departureAt.slice(0, 10);
		const monthQuery = {
			...query,
			departure_at: day.slice(0, 7),
			limit: "1000"
		};
		if (params.returnAt) monthQuery["return_at"] = params.returnAt.slice(0, 7);
		const monthList = (await callApi("/aviasales/v3/prices_for_dates", monthQuery, params.currency)).data?.data ?? [];
		const exact = monthList.filter((offer) => {
			if (offer?.departure_at?.slice(0, 10) !== day) return false;
			if (!params.returnAt) return true;
			return offer?.return_at?.slice(0, 10) === params.returnAt.slice(0, 10);
		});
		if (exact.length > 0) {
			list = exact;
			exactDate = true;
		} else {
			const ref = Date.parse(`${day}T00:00:00Z`);
			const near = monthList.filter((offer) => {
				const iso = offer?.departure_at?.slice(0, 10);
				if (!iso) return false;
				const delta = Math.abs(Date.parse(`${iso}T00:00:00Z`) - ref) / 864e5;
				return delta > 0 && delta <= 3;
			});
			const bestPerDay = /* @__PURE__ */ new Map();
			for (const offer of near) {
				const iso = offer.departure_at.slice(0, 10);
				const current = bestPerDay.get(iso);
				if (!current || (offer.price ?? Infinity) < (current.price ?? Infinity)) bestPerDay.set(iso, offer);
			}
			list = [...bestPerDay.values()].sort((a, b) => (a.price ?? 0) - (b.price ?? 0));
			exactDate = false;
		}
	}
	const offers = offersFromApi(list, creds?.marker ?? "", {
		adults,
		children,
		infants
	});
	logOps({
		kind: "travelpayouts",
		label: `recherche ${params.origin}-${params.destination}`,
		ok: true,
		resultCount: offers.length,
		...offers.length === 0 ? { message: "aucune offre enregistrée par la source pour cette date" } : !exactDate ? { message: "offres réelles trouvées sur des dates proches (± 3 jours)" } : {},
		context: {
			origin: params.origin,
			destination: params.destination,
			departureAt: params.departureAt.slice(0, 10),
			returnAt: params.returnAt ?? null,
			currency: (params.currency ?? "eur").toLowerCase(),
			passengers: {
				adults,
				children,
				infants
			}
		}
	});
	if ((params.currency ?? "eur").toLowerCase() === "eur") recordHistory(params.origin, params.destination, offers);
	return {
		offers,
		raw,
		exactDate
	};
}
/** Enregistre l'observation réelle du prix le plus bas du mois (best effort). */
async function recordHistory(origin, destination, offers) {
	const cheapest = offers[0];
	if (!cheapest) return;
	const month = `${cheapest.departureAt.slice(0, 7)}-01`;
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data } = await supabaseAdmin.from("price_history").select("id,lowest_price").eq("origin", origin).eq("destination", destination).eq("month", month).maybeSingle();
		if (data && Number(data.lowest_price) <= cheapest.priceEur) return;
		if (data) {
			await supabaseAdmin.from("price_history").update({
				lowest_price: cheapest.priceEur,
				updated_at: (/* @__PURE__ */ new Date()).toISOString()
			}).eq("id", data.id);
			return;
		}
		await supabaseAdmin.from("price_history").insert({
			origin,
			destination,
			month,
			lowest_price: cheapest.priceEur,
			currency: "eur"
		});
	} catch (error) {
		console.error("Historique de prix non enregistré", error);
	}
}
/**
* Enregistre l'observation des prix par destination (balayage "destinations les
* moins chères") dans `price_history`. Le prix conservé reste le plus bas
* réellement observé sur le mois ; `updated_at` note la date du dernier relevé,
* ce qui alimente la fraîcheur affichée dans les guides destinations.
*/
async function recordDestinationHistory(origin, prices) {
	if (prices.length === 0) return 0;
	let written = 0;
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		for (const price of prices) {
			const yearMonth = (price.departureAt || "").slice(0, 7);
			if (yearMonth.length !== 7 || !Number.isFinite(price.priceEur) || price.priceEur <= 0) continue;
			const month = `${yearMonth}-01`;
			const { data } = await supabaseAdmin.from("price_history").select("id,lowest_price").eq("origin", origin).eq("destination", price.destination).eq("month", month).maybeSingle();
			const now = (/* @__PURE__ */ new Date()).toISOString();
			if (data) {
				const lowest = Math.min(Number(data.lowest_price), price.priceEur);
				const { error } = await supabaseAdmin.from("price_history").update({
					lowest_price: lowest,
					updated_at: now
				}).eq("id", data.id);
				if (error) throw error;
			} else {
				const { error } = await supabaseAdmin.from("price_history").insert({
					origin,
					destination: price.destination,
					month,
					lowest_price: price.priceEur,
					currency: "eur",
					updated_at: now
				});
				if (error) throw error;
			}
			written += 1;
		}
	} catch (error) {
		console.error("Historique des destinations non enregistré", error);
	}
	return written;
}
/** Cache Supabase générique (mémorisation de réponses API, jamais d'estimation). */
var DESTINATIONS_TTL_MS = 216e5;
async function readJsonCacheEntry(key) {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data } = await supabaseAdmin.from("price_cache").select("payload,expires_at").eq("cache_key", key).maybeSingle();
		if (!data) return null;
		return {
			payload: data.payload,
			stale: Date.parse(data.expires_at) < Date.now()
		};
	} catch (error) {
		console.error("Lecture du cache destinations impossible", error);
		return null;
	}
}
async function writeJsonCache(key, payload, ttlMs) {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		await supabaseAdmin.from("price_cache").upsert({
			cache_key: key,
			payload,
			expires_at: new Date(Date.now() + ttlMs).toISOString()
		}, { onConflict: "cache_key" });
	} catch (error) {
		console.error("Écriture du cache destinations impossible", error);
	}
}
function keepCheapest(map, code, offer) {
	if (!code || offer.price <= 0 || !offer.departureAt) return;
	const current = map.get(code);
	if (!current || offer.price < current.price) map.set(code, offer);
}
/** Revalidations mondiales en cours, pour éviter les appels API en rafale. */
var worldRevalidations = /* @__PURE__ */ new Set();
/**
* Rafraîchit en arrière-plan un balayage mondial périmé : la réponse en cours
* continue de servir les données périmées, le cache est réécrit ensuite.
*/
function scheduleWorldRevalidation(params, cacheKey) {
	if (worldRevalidations.has(cacheKey)) return;
	worldRevalidations.add(cacheKey);
	fetchCheapestDestinations(params).catch((error) => console.error("Revalidation du balayage mondial impossible", error)).finally(() => worldRevalidations.delete(cacheKey));
}
/**
* Balayage mondial : agrège plusieurs endpoints Travelpayouts couvrant toutes les
* destinations connues depuis l'origine (aucune liste de villes codée en dur).
* Le résultat complet est mis en cache par ville de départ, le filtrage par
* budget se fait ensuite côté client sans nouvel appel.
*/
async function fetchCheapestDestinations(params) {
	const origin = params.origin.toUpperCase();
	const currency = (params.currency ?? "EUR").toUpperCase();
	const world = params.world === true;
	const cacheKey = [
		"world-destinations",
		origin,
		params.month ?? "any",
		currency
	].join(":");
	const restrict = !world && params.destinations && params.destinations.length > 0 ? new Set(params.destinations.map((code) => code.toUpperCase())) : null;
	if (world && !params.forceRefresh) {
		const entry = await readJsonCacheEntry(cacheKey);
		if (entry?.payload?.prices?.length) {
			if (entry.stale) scheduleWorldRevalidation({
				...params,
				forceRefresh: true
			}, cacheKey);
			return {
				prices: entry.payload.prices,
				raw: null
			};
		}
	}
	const monthQuery = {
		origin,
		one_way: "true",
		limit: "1000",
		sorting: "price"
	};
	if (params.month) monthQuery["departure_at"] = params.month;
	const datesCall = await callApi("/aviasales/v3/prices_for_dates", monthQuery, currency);
	const cheapest = /* @__PURE__ */ new Map();
	for (const offer of datesCall.data?.data ?? []) keepCheapest(cheapest, offer.destination?.toUpperCase() ?? "", {
		price: offer.price,
		airline: offer.airline,
		departureAt: offer.departure_at,
		...offer.origin_airport ? { originAirport: offer.origin_airport } : {},
		...offer.destination_airport ? { destinationAirport: offer.destination_airport } : {}
	});
	if (world) {
		const latestQueries = [1, 2].map((page) => ({
			origin,
			period_type: "year",
			one_way: "true",
			page: String(page),
			limit: "1000",
			sorting: "price",
			show_to_affiliates: "true"
		}));
		for (const query of latestQueries) try {
			const call = await callApi("/v2/prices/latest", query, currency);
			for (const row of call.data?.data ?? []) keepCheapest(cheapest, row.destination?.toUpperCase() ?? "", {
				price: Number(row.value ?? 0),
				airline: row.airline ?? "",
				departureAt: row.depart_date ?? ""
			});
		} catch (error) {
			console.error("Balayage mondial partiel (prices/latest)", error);
		}
		try {
			const call = await callApi("/v1/city-directions", { origin }, currency);
			for (const [code, offer] of Object.entries(call.data?.data ?? {})) keepCheapest(cheapest, code.toUpperCase(), {
				price: offer.price,
				airline: offer.airline,
				departureAt: offer.departure_at
			});
		} catch (error) {
			console.error("Balayage mondial partiel (city-directions)", error);
		}
	}
	let cityIndex = /* @__PURE__ */ new Map();
	if (world) try {
		const { getCityIndex } = await import("./geo.server-CRol7P84.mjs");
		cityIndex = await getCityIndex();
	} catch (error) {
		console.error("Référentiel des villes indisponible, repli sur les aéroports connus", error);
	}
	const prices = [];
	for (const [code, offer] of cheapest) {
		if (code === origin) continue;
		if (restrict && !restrict.has(code)) continue;
		const place = cityIndex.get(code) ?? getAirport(code);
		if (!place) continue;
		prices.push({
			destination: code,
			city: place.city,
			country: place.country,
			lat: place.lat,
			lng: place.lng,
			priceEur: Math.round(offer.price),
			airline: airlineName(offer.airline),
			departureAt: offer.departureAt,
			...offer.originAirport ? { originAirport: offer.originAirport } : {},
			...offer.destinationAirport ? { destinationAirport: offer.destinationAirport } : {}
		});
	}
	prices.sort((a, b) => a.priceEur - b.priceEur);
	if (world && prices.length > 0) await writeJsonCache(cacheKey, { prices }, DESTINATIONS_TTL_MS);
	return {
		prices,
		raw: datesCall.raw
	};
}
/** Cache Supabase des mois de calendrier (aucune donnée estimée, juste mémorisée). */
var CALENDAR_TTL_MS = 216e5;
async function readCalendarCache(key) {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data, error } = await supabaseAdmin.from("price_cache").select("payload,expires_at").eq("cache_key", key).maybeSingle();
		if (error || !data) return null;
		if (Date.parse(data.expires_at) < Date.now()) return null;
		const payload = data.payload;
		return Array.isArray(payload?.days) ? payload.days : null;
	} catch (error) {
		console.error("Lecture du cache calendrier impossible", error);
		return null;
	}
}
async function writeCalendarCache(key, days) {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		await supabaseAdmin.from("price_cache").upsert({
			cache_key: key,
			payload: { days },
			expires_at: new Date(Date.now() + CALENDAR_TTL_MS).toISOString()
		}, { onConflict: "cache_key" });
	} catch (error) {
		console.error("Écriture du cache calendrier impossible", error);
	}
}
async function fetchCalendarPrices(params) {
	const nights = Math.max(0, Math.round(params.tripDuration ?? 0));
	const mode = params.mode ?? "departure";
	const currency = (params.currency ?? "EUR").toUpperCase();
	const departureAt = params.departureAt ?? null;
	if (mode === "return" && !departureAt) throw new TravelpayoutsError("Choisissez d'abord une date de départ pour afficher les prix de retour.");
	const cacheKey = [
		"calendar",
		mode,
		params.origin,
		params.destination,
		params.month,
		currency,
		mode === "return" ? departureAt : String(nights)
	].join(":");
	const cached = await readCalendarCache(cacheKey);
	if (cached) return {
		days: cached,
		raw: null,
		cached: true
	};
	const map = /* @__PURE__ */ new Map();
	let raw = null;
	if (mode === "return") {
		const dayMs = 864e5;
		const depMs = Date.parse(`${departureAt}T00:00:00Z`);
		const monthDays = daysInMonth(params.month).filter((d) => {
			const t = Date.parse(`${d}T00:00:00Z`);
			return t > depMs && t - depMs <= 30 * dayMs;
		});
		if (monthDays.length > 0) {
			const call = await callApi("/aviasales/v3/prices_for_dates", {
				origin: params.origin,
				destination: params.destination,
				departure_at: departureAt,
				return_at: params.month,
				one_way: "false",
				sorting: "price",
				limit: "1000"
			}, currency);
			raw = call.raw;
			const allowed = new Set(monthDays);
			for (const offer of call.data?.data ?? []) {
				const back = offer?.return_at?.slice(0, 10);
				if (!back || !allowed.has(back)) continue;
				const price = Math.round(offer.price);
				if (!map.has(back) || price < map.get(back)) map.set(back, price);
			}
		}
	} else {
		const call = await callApi("/aviasales/v3/grouped_prices", {
			origin: params.origin,
			destination: params.destination,
			departure_at: params.month,
			group_by: "departure_at",
			one_way: nights > 0 ? "false" : "true"
		}, currency);
		raw = call.raw;
		for (const offer of Object.values(call.data?.data ?? {})) {
			const day = offer?.departure_at?.slice(0, 10);
			const back = offer?.return_at?.slice(0, 10);
			if (!day) continue;
			if (nights > 0) {
				if (!back) continue;
				const actual = Math.round((Date.parse(`${back}T00:00:00Z`) - Date.parse(`${day}T00:00:00Z`)) / 864e5);
				if (Math.abs(actual - nights) > 1) continue;
			}
			const price = Math.round(offer.price);
			if (!map.has(day) || price < map.get(day)) map.set(day, price);
		}
	}
	const days = daysInMonth(params.month).filter((d) => map.has(d)).map((d) => ({
		date: d,
		priceEur: map.get(d)
	}));
	await writeCalendarCache(cacheKey, days);
	return {
		days,
		raw,
		cached: false
	};
}
async function fetchMonthlyHistory(params) {
	try {
		const { supabaseAdmin } = await import("./client.server-KzwUIAkW.mjs");
		const { data, error } = await supabaseAdmin.from("price_history").select("month,lowest_price,updated_at").eq("origin", params.origin).eq("destination", params.destination).order("month", { ascending: true }).limit(24);
		if (error) throw error;
		return { months: (data ?? []).map((row) => ({
			month: row.month.slice(0, 7),
			priceEur: Math.round(Number(row.lowest_price)),
			...row.updated_at ? { updatedAt: row.updated_at } : {}
		})) };
	} catch (error) {
		console.error("Lecture de l'historique impossible", error);
		return { months: [] };
	}
}
function daysInMonth(month) {
	const [yearRaw, monthRaw] = month.split("-");
	const year = Number(yearRaw);
	const m = Number(monthRaw);
	const total = new Date(Date.UTC(year, m, 0)).getUTCDate();
	return Array.from({ length: total }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
}
AIRPORTS.map((a) => a.code);
/** Dates à explorer pour l'option « dates flexibles ± N jours ». */
function shiftDates(date, days) {
	const out = [];
	const today = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	for (let offset = -days; offset <= days; offset += 1) {
		const d = /* @__PURE__ */ new Date(`${date}T00:00:00Z`);
		d.setUTCDate(d.getUTCDate() + offset);
		const iso = d.toISOString().slice(0, 10);
		if (iso >= today) out.push(iso);
	}
	return out.length ? out : [date];
}
//#endregion
export { TravelpayoutsError, fetchCalendarPrices, fetchCheapestDestinations, fetchMonthlyHistory, fetchOffers, hasApiCredentials, recordDestinationHistory, shiftDates };
