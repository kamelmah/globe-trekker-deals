import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
import { TravelpayoutsError, fetchCalendarPrices, fetchCheapestDestinations, fetchMonthlyHistory, fetchOffers, hasApiCredentials, shiftDates } from "./travelpayouts.server-Dj_hGfma.mjs";
import { r as addDaysIso, s as nightsBetween } from "./trip-duration-Dr4Tuig8.mjs";
import { createAlert, deactivateAlert } from "./alerts.server-CfJLhiSF.mjs";
import { t as createServerRpc } from "./createServerRpc-B90ckaqP.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/flights.functions-BSranWJx.js
function payingTravelers(passengers) {
	return Math.max(1, passengers.adults + passengers.children);
}
/** Applique la multiplication au prix de référence (par voyageur payant) d'une offre. */
function totalPriceForPassengers(referencePriceEur, passengers) {
	return Math.round(referencePriceEur * payingTravelers(passengers));
}
var iata = stringType().trim().min(3).max(3).toUpperCase();
var isoDate = stringType().regex(/^\d{4}-\d{2}-\d{2}$/);
var currency = enumType([
	"EUR",
	"USD",
	"GBP",
	"CHF",
	"CAD"
]).optional();
/** La réponse brute n'est exposée qu'en développement. */
function debugOf(raw) {
	return null;
}
function messageOf(error) {
	if (error instanceof TravelpayoutsError) {
		if (error.configError) {
			console.error("Configuration serveur manquante :", error.message);
			return "Les prix ne sont pas disponibles pour le moment. Réessayez dans quelques instants.";
		}
		return error.message;
	}
	console.error("Erreur inattendue côté prix", error);
	return "Une erreur est survenue lors de la récupération des prix. Aucun résultat n'est affiché.";
}
var searchFlights_createServerFn_handler = createServerRpc({
	id: "0501799d203f532eff13894d17ddf28837dc4aad90cfc6bc3f1d19c636e85f8b",
	name: "searchFlights",
	filename: "src/lib/flights.functions.ts"
}, (opts) => searchFlights.__executeServer(opts));
var searchFlights = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata,
	departureAt: isoDate,
	returnAt: isoDate.nullish(),
	/** Nombre de nuits imposé par le raccourci de durée (0 = dates libres). */
	tripDuration: numberType().int().min(0).max(30).optional(),
	flexible: booleanType().optional(),
	currency,
	adults: numberType().int().min(1).max(9).optional(),
	children: numberType().int().min(0).max(8).optional(),
	infants: numberType().int().min(0).max(9).optional()
}).parse(data)).handler(searchFlights_createServerFn_handler, async ({ data }) => {
	const dates = data.flexible ? shiftDates(data.departureAt, 3) : [data.departureAt];
	const nights = data.tripDuration ?? 0;
	const passengers = {
		adults: data.adults ?? 1,
		children: data.children ?? 0,
		infants: Math.min(data.adults ?? 1, data.infants ?? 0)
	};
	try {
		const batches = await Promise.all(dates.map((departureAt) => fetchOffers({
			origin: data.origin,
			destination: data.destination,
			departureAt,
			returnAt: nights > 0 ? addDaysIso(departureAt, nights) : data.returnAt ?? null,
			currency: data.currency ?? "EUR",
			adults: passengers.adults,
			children: passengers.children,
			infants: passengers.infants
		})));
		const offers = batches.flatMap((batch) => batch.offers).sort((a, b) => a.priceEur - b.priceEur).slice(0, 40).map((offer) => ({
			...offer,
			priceEur: totalPriceForPassengers(offer.priceEur, passengers)
		}));
		const nearDateOnly = offers.length > 0 && batches.every((batch) => !batch.exactDate);
		const actualNights = nights > 0 ? nights : nightsBetween(data.departureAt, data.returnAt ?? "");
		let alternatives = [];
		if (offers.length === 0) try {
			const month = data.departureAt.slice(0, 7);
			const { days } = await fetchCalendarPrices({
				origin: data.origin,
				destination: data.destination,
				month,
				tripDuration: actualNights,
				currency: data.currency ?? "EUR",
				mode: "departure"
			});
			const ref = Date.parse(`${data.departureAt}T00:00:00Z`);
			alternatives = days.filter((d) => d.date !== data.departureAt).sort((a, b) => Math.abs(Date.parse(`${a.date}T00:00:00Z`) - ref) - Math.abs(Date.parse(`${b.date}T00:00:00Z`) - ref)).slice(0, 6).sort((a, b) => a.date.localeCompare(b.date)).map((day) => ({
				...day,
				priceEur: totalPriceForPassengers(day.priceEur, passengers)
			}));
		} catch (calendarError) {
			console.error("Dates alternatives indisponibles", calendarError);
		}
		return {
			offers,
			alternatives,
			nearDateOnly,
			error: null,
			debug: debugOf(batches[0]?.raw ?? null),
			configured: hasApiCredentials()
		};
	} catch (error) {
		return {
			offers: [],
			alternatives: [],
			nearDateOnly: false,
			error: messageOf(error),
			debug: null,
			configured: hasApiCredentials()
		};
	}
});
var cheapestDestinations_createServerFn_handler = createServerRpc({
	id: "3135f6cccd25785d185d84551efb34a0e3193f5c5513e7e85d6b432063d0f73f",
	name: "cheapestDestinations",
	filename: "src/lib/flights.functions.ts"
}, (opts) => cheapestDestinations.__executeServer(opts));
var cheapestDestinations = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	month: stringType().regex(/^\d{4}-\d{2}$/).nullish(),
	destinations: arrayType(iata).min(1).max(80).optional(),
	world: booleanType().optional(),
	currency,
	adults: numberType().int().min(1).max(9).optional(),
	children: numberType().int().min(0).max(8).optional(),
	infants: numberType().int().min(0).max(9).optional()
}).parse(data)).handler(cheapestDestinations_createServerFn_handler, async ({ data }) => {
	const passengers = {
		adults: data.adults ?? 1,
		children: data.children ?? 0,
		infants: Math.min(data.adults ?? 1, data.infants ?? 0)
	};
	try {
		const { prices: refPrices, raw } = await fetchCheapestDestinations({
			origin: data.origin,
			...data.destinations ? { destinations: data.destinations } : {},
			world: data.world === true,
			month: data.month ?? void 0,
			currency: data.currency ?? "EUR"
		});
		return {
			prices: refPrices.map((price) => ({
				...price,
				priceEur: totalPriceForPassengers(price.priceEur, passengers)
			})),
			error: null,
			debug: debugOf(raw)
		};
	} catch (error) {
		return {
			prices: [],
			error: messageOf(error),
			debug: null
		};
	}
});
var calendarPrices_createServerFn_handler = createServerRpc({
	id: "f366e7249cccad3fed6bf4d8f3107c5abb3ce7d8c4759fe9e9e8ebbb79fc0eb0",
	name: "calendarPrices",
	filename: "src/lib/flights.functions.ts"
}, (opts) => calendarPrices.__executeServer(opts));
var calendarPrices = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata,
	month: stringType().regex(/^\d{4}-\d{2}$/),
	tripDuration: numberType().int().min(0).max(30).optional(),
	currency,
	mode: enumType(["departure", "return"]).optional(),
	departureAt: isoDate.nullish(),
	adults: numberType().int().min(1).max(9).optional(),
	children: numberType().int().min(0).max(8).optional(),
	infants: numberType().int().min(0).max(9).optional()
}).parse(data)).handler(calendarPrices_createServerFn_handler, async ({ data }) => {
	const passengers = {
		adults: data.adults ?? 1,
		children: data.children ?? 0,
		infants: Math.min(data.adults ?? 1, data.infants ?? 0)
	};
	try {
		const { days: refDays, raw, cached } = await fetchCalendarPrices({
			origin: data.origin,
			destination: data.destination,
			month: data.month,
			tripDuration: data.tripDuration ?? 0,
			currency: data.currency ?? "EUR",
			mode: data.mode ?? "departure",
			departureAt: data.departureAt ?? null
		});
		return {
			days: refDays.map((day) => ({
				...day,
				priceEur: totalPriceForPassengers(day.priceEur, passengers)
			})),
			error: null,
			debug: debugOf(raw),
			cached
		};
	} catch (error) {
		return {
			days: [],
			error: messageOf(error),
			debug: null,
			cached: false
		};
	}
});
var monthlyHistory_createServerFn_handler = createServerRpc({
	id: "2f588ba3064f5f55597088794fc3314979103689a0eb633dcd5733d1782a8074",
	name: "monthlyHistory",
	filename: "src/lib/flights.functions.ts"
}, (opts) => monthlyHistory.__executeServer(opts));
var monthlyHistory = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata
}).parse(data)).handler(monthlyHistory_createServerFn_handler, async ({ data }) => {
	const { months } = await fetchMonthlyHistory(data);
	return { months };
});
var subscribeToAlert_createServerFn_handler = createServerRpc({
	id: "7dc300126362cfc8ea0dd6a00fda7d488c7072db87ede916f5f2869dac720ad3",
	name: "subscribeToAlert",
	filename: "src/lib/flights.functions.ts"
}, (opts) => subscribeToAlert.__executeServer(opts));
var subscribeToAlert = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	email: stringType().trim().email().max(180),
	origin: iata,
	destination: iata,
	departDate: isoDate.nullish(),
	returnDate: isoDate.nullish(),
	referencePrice: numberType().positive().max(1e5).nullish()
}).parse(data)).handler(subscribeToAlert_createServerFn_handler, async ({ data }) => createAlert({
	email: data.email,
	origin: data.origin,
	destination: data.destination,
	departDate: data.departDate ?? null,
	returnDate: data.returnDate ?? null,
	referencePrice: data.referencePrice ?? null
}));
var unsubscribeAlert_createServerFn_handler = createServerRpc({
	id: "3f530f76b8ed81b63216bcc9251d652e391f94c9eebee1094fafc645bb9cf4c1",
	name: "unsubscribeAlert",
	filename: "src/lib/flights.functions.ts"
}, (opts) => unsubscribeAlert.__executeServer(opts));
var unsubscribeAlert = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ token: stringType().trim().min(8).max(128) }).parse(data)).handler(unsubscribeAlert_createServerFn_handler, async ({ data }) => ({ ok: await deactivateAlert(data.token) }));
//#endregion
export { calendarPrices_createServerFn_handler, cheapestDestinations_createServerFn_handler, monthlyHistory_createServerFn_handler, searchFlights_createServerFn_handler, subscribeToAlert_createServerFn_handler, unsubscribeAlert_createServerFn_handler };
