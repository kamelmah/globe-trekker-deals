import { c as createServerFn } from "./createServerFn-CIHAFgYl.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B9f7sT_v.mjs";
import { a as objectType, i as numberType, n as booleanType, o as stringType, r as enumType, t as arrayType } from "../_libs/zod.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/flights.functions-2XDL4V6N.js
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
}).parse(data)).handler(createSsrRpc("0501799d203f532eff13894d17ddf28837dc4aad90cfc6bc3f1d19c636e85f8b"));
var cheapestDestinations = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	month: stringType().regex(/^\d{4}-\d{2}$/).nullish(),
	destinations: arrayType(iata).min(1).max(80).optional(),
	world: booleanType().optional(),
	currency,
	adults: numberType().int().min(1).max(9).optional(),
	children: numberType().int().min(0).max(8).optional(),
	infants: numberType().int().min(0).max(9).optional()
}).parse(data)).handler(createSsrRpc("3135f6cccd25785d185d84551efb34a0e3193f5c5513e7e85d6b432063d0f73f"));
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
}).parse(data)).handler(createSsrRpc("f366e7249cccad3fed6bf4d8f3107c5abb3ce7d8c4759fe9e9e8ebbb79fc0eb0"));
var monthlyHistory = createServerFn({ method: "GET" }).inputValidator((data) => objectType({
	origin: iata,
	destination: iata
}).parse(data)).handler(createSsrRpc("2f588ba3064f5f55597088794fc3314979103689a0eb633dcd5733d1782a8074"));
var subscribeToAlert = createServerFn({ method: "POST" }).inputValidator((data) => objectType({
	email: stringType().trim().email().max(180),
	origin: iata,
	destination: iata,
	departDate: isoDate.nullish(),
	returnDate: isoDate.nullish(),
	referencePrice: numberType().positive().max(1e5).nullish()
}).parse(data)).handler(createSsrRpc("7dc300126362cfc8ea0dd6a00fda7d488c7072db87ede916f5f2869dac720ad3"));
var unsubscribeAlert = createServerFn({ method: "POST" }).inputValidator((data) => objectType({ token: stringType().trim().min(8).max(128) }).parse(data)).handler(createSsrRpc("3f530f76b8ed81b63216bcc9251d652e391f94c9eebee1094fafc645bb9cf4c1"));
//#endregion
export { subscribeToAlert as a, searchFlights as i, cheapestDestinations as n, unsubscribeAlert as o, monthlyHistory as r, calendarPrices as t };
