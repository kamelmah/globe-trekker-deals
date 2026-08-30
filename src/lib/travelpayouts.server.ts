import { AIRPORTS, distanceKm, getAirport } from "@/data/airports";
import { estimateCo2Kg } from "@/lib/co2";
import type {
  CalendarDayPrice,
  DestinationPrice,
  FlightOffer,
  MonthlyPrice,
} from "@/lib/flights.types";

const API_BASE = "https://api.travelpayouts.com";

type Credentials = { token: string; marker: string };

function getCredentials(): Credentials | null {
  const token = process.env["TRAVELPAYOUTS_TOKEN"];
  const marker = process.env["TRAVELPAYOUTS_MARKER"] ?? "";
  if (!token) return null;
  return { token, marker };
}

/** Taux de change indicatifs pour ramener les réponses API en euros. */
const TO_EUR: Record<string, number> = { eur: 1, usd: 0.92, rub: 0.01, gbp: 1.18 };

function toEur(value: number, currency = "eur"): number {
  return Math.round(value * (TO_EUR[currency.toLowerCase()] ?? 1));
}

/* -------------------------------------------------------------------------- */
/* Vendeurs                                                                    */
/* -------------------------------------------------------------------------- */

const AIRLINE_NAMES: Record<string, string> = {
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
  TU: "Tunisair",
};

/** Agences connues renvoyées par le champ gate/agent de l'API. */
const KNOWN_AGENCIES = [
  "Kiwi.com",
  "Expedia",
  "Opodo",
  "eDreams",
  "Trip.com",
  "Gotogate",
  "Mytrip",
];

function airlineName(code: string): string {
  return AIRLINE_NAMES[code?.toUpperCase()] ?? code ?? "Compagnie aérienne";
}

/** Le vendeur doit toujours être nommé : compagnie ou agence identifiée. */
function resolveSeller(gate: unknown, airline: string): string {
  const raw = typeof gate === "string" ? gate.trim() : "";
  if (raw.length > 1) return raw;
  return airline;
}

/* -------------------------------------------------------------------------- */
/* Liens d'affiliation                                                         */
/* -------------------------------------------------------------------------- */

export function buildBookingUrl(params: {
  origin: string;
  destination: string;
  departureAt: string;
  returnAt?: string | null;
  marker?: string;
  link?: string | null;
}): string {
  const marker = params.marker ?? process.env["TRAVELPAYOUTS_MARKER"] ?? "";
  if (params.link) {
    const url = `https://www.aviasales.com${params.link}`;
    return marker ? `${url}${params.link.includes("?") ? "&" : "?"}marker=${marker}` : url;
  }
  const d = params.departureAt.slice(0, 10);
  const search = new URLSearchParams({
    origin_iata: params.origin,
    destination_iata: params.destination,
    depart_date: d,
    adults: "1",
  });
  if (params.returnAt) search.set("return_date", params.returnAt.slice(0, 10));
  if (marker) search.set("marker", marker);
  return `https://www.aviasales.com/search?${search.toString()}`;
}

/* -------------------------------------------------------------------------- */
/* Générateur de démonstration (déterministe, utilisé sans clé API)            */
/* -------------------------------------------------------------------------- */

function seededRandom(seed: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return () => {
    h ^= h << 13;
    h ^= h >>> 17;
    h ^= h << 5;
    return ((h >>> 0) % 100000) / 100000;
  };
}

function basePriceEur(origin: string, destination: string): number {
  const km = distanceKm(origin, destination);
  const rand = seededRandom(`${origin}${destination}`);
  const base = 38 + km * 0.041;
  return Math.round(base * (0.85 + rand() * 0.4));
}

const DEMO_AIRLINES = ["AF", "TO", "FR", "U2", "TP", "TK", "LH", "KL", "IB", "AT"];

function demoOffers(params: {
  origin: string;
  destination: string;
  departureAt: string;
  returnAt?: string | null;
}): FlightOffer[] {
  const { origin, destination, departureAt, returnAt } = params;
  const rand = seededRandom(`${origin}${destination}${departureAt}`);
  const base = basePriceEur(origin, destination);
  const km = distanceKm(origin, destination);
  const count = 12;
  const offers: FlightOffer[] = [];
  for (let i = 0; i < count; i++) {
    const r = rand();
    const stops = r < 0.42 ? 0 : r < 0.85 ? 1 : 2;
    const priceEur = Math.max(29, Math.round(base * (0.92 + r * 0.9) - stops * 14));
    const airlineCode = DEMO_AIRLINES[Math.floor(rand() * DEMO_AIRLINES.length)] ?? "AF";
    const airline = airlineName(airlineCode);
    const sellerRand = rand();
    const seller =
      sellerRand < 0.45
        ? airline
        : (KNOWN_AGENCIES[Math.floor(sellerRand * KNOWN_AGENCIES.length) % KNOWN_AGENCIES.length] ??
          airline);
    const hour = Math.floor(rand() * 22);
    const flightMinutes = Math.round(km / 12 + 45 + stops * (90 + rand() * 150));
    offers.push({
      id: `${origin}-${destination}-${departureAt}-${i}`,
      origin,
      destination,
      priceEur,
      airline,
      airlineCode,
      seller,
      flightNumber: `${airlineCode}${100 + Math.floor(rand() * 899)}`,
      departureAt: `${departureAt.slice(0, 10)}T${String(hour).padStart(2, "0")}:${
        rand() < 0.5 ? "10" : "45"
      }:00`,
      returnAt: returnAt ? `${returnAt.slice(0, 10)}T09:30:00` : null,
      durationMinutes: flightMinutes,
      stops,
      cabinBag: true,
      checkedBag: priceEur > base * 1.25 || stops === 0 ? rand() > 0.5 : rand() > 0.75,
      co2Kg: estimateCo2Kg(origin, destination, stops),
      bookingUrl: buildBookingUrl({ origin, destination, departureAt, returnAt: returnAt ?? null }),
      isDemo: true,
    });
  }
  return offers.sort((a, b) => a.priceEur - b.priceEur);
}

function nextMonthDate(offsetDays: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() + offsetDays);
  return d.toISOString().slice(0, 10);
}

/* -------------------------------------------------------------------------- */
/* Appels API                                                                  */
/* -------------------------------------------------------------------------- */

async function callApi<T>(path: string, params: Record<string, string>): Promise<T | null> {
  const creds = getCredentials();
  if (!creds) return null;
  const search = new URLSearchParams({ ...params, token: creds.token, currency: "eur" });
  try {
    const res = await fetch(`${API_BASE}${path}?${search.toString()}`, {
      headers: { Accept: "application/json" },
    });
    if (!res.ok) {
      console.error(`Travelpayouts ${path} a répondu ${res.status}: ${await res.text()}`);
      return null;
    }
    return (await res.json()) as T;
  } catch (error) {
    console.error("Appel Travelpayouts en échec", error);
    return null;
  }
}

type ApiOffer = {
  origin: string;
  destination: string;
  price: number;
  airline: string;
  flight_number?: string | number;
  departure_at: string;
  return_at?: string;
  duration?: number;
  duration_to?: number;
  transfers?: number;
  gate?: string;
  link?: string;
};

export async function fetchOffers(params: {
  origin: string;
  destination: string;
  departureAt: string;
  returnAt?: string | null;
}): Promise<FlightOffer[]> {
  const query: Record<string, string> = {
    origin: params.origin,
    destination: params.destination,
    departure_at: params.departureAt.slice(0, 10),
    unique: "false",
    sorting: "price",
    direct: "false",
    limit: "30",
    one_way: params.returnAt ? "false" : "true",
  };
  if (params.returnAt) query["return_at"] = params.returnAt.slice(0, 10);

  const data = await callApi<{ data?: ApiOffer[] }>("/aviasales/v3/prices_for_dates", query);
  if (!data?.data?.length) {
    return demoOffers(params);
  }
  return data.data
    .map((offer, index) => {
      const airline = airlineName(offer.airline);
      const stops = offer.transfers ?? 0;
      return {
        id: `${offer.origin}-${offer.destination}-${offer.departure_at}-${index}`,
        origin: offer.origin,
        destination: offer.destination,
        priceEur: toEur(offer.price),
        airline,
        airlineCode: offer.airline,
        seller: resolveSeller(offer.gate, airline),
        flightNumber: `${offer.airline}${offer.flight_number ?? ""}`,
        departureAt: offer.departure_at,
        returnAt: offer.return_at ?? null,
        durationMinutes: offer.duration ?? offer.duration_to ?? 0,
        stops,
        cabinBag: true,
        checkedBag: false,
        co2Kg: estimateCo2Kg(offer.origin, offer.destination, stops),
        bookingUrl: buildBookingUrl({
          origin: offer.origin,
          destination: offer.destination,
          departureAt: offer.departure_at,
          returnAt: offer.return_at ?? null,
          link: offer.link ?? null,
        }),
        isDemo: false,
      } satisfies FlightOffer;
    })
    .sort((a, b) => a.priceEur - b.priceEur);
}

export async function fetchCheapestDestinations(params: {
  origin: string;
  destinations: string[];
  month?: string | undefined;
}): Promise<DestinationPrice[]> {
  const creds = getCredentials();
  const results: DestinationPrice[] = [];

  if (creds) {
    const query: Record<string, string> = {
      origin: params.origin,
      one_way: "true",
      limit: "1000",
      sorting: "price",
    };
    if (params.month) query["departure_at"] = params.month;
    const data = await callApi<{ data?: ApiOffer[] }>("/aviasales/v3/prices_for_dates", query);
    const cheapest = new Map<string, ApiOffer>();
    for (const offer of data?.data ?? []) {
      const current = cheapest.get(offer.destination);
      if (!current || offer.price < current.price) cheapest.set(offer.destination, offer);
    }
    for (const code of params.destinations) {
      const airport = getAirport(code);
      const offer = cheapest.get(code);
      if (!airport || !offer) continue;
      results.push({
        destination: code,
        city: airport.city,
        country: airport.country,
        lat: airport.lat,
        lng: airport.lng,
        priceEur: toEur(offer.price),
        airline: airlineName(offer.airline),
        departureAt: offer.departure_at,
        isDemo: false,
      });
    }
    if (results.length > 0) return results.sort((a, b) => a.priceEur - b.priceEur);
  }

  // Démonstration : prix déterministes par trajet.
  for (const code of params.destinations) {
    const airport = getAirport(code);
    if (!airport || code === params.origin) continue;
    const rand = seededRandom(`${params.origin}${code}${params.month ?? ""}`);
    results.push({
      destination: code,
      city: airport.city,
      country: airport.country,
      lat: airport.lat,
      lng: airport.lng,
      priceEur: Math.round(basePriceEur(params.origin, code) * (0.95 + rand() * 0.25)),
      airline: airlineName(DEMO_AIRLINES[Math.floor(rand() * DEMO_AIRLINES.length)] ?? "AF"),
      departureAt: nextMonthDate(21 + Math.floor(rand() * 60)),
      isDemo: true,
    });
  }
  return results.sort((a, b) => a.priceEur - b.priceEur);
}

export async function fetchCalendarPrices(params: {
  origin: string;
  destination: string;
  /** Mois au format YYYY-MM. */
  month: string;
}): Promise<CalendarDayPrice[]> {
  const data = await callApi<{ data?: ApiOffer[] }>("/aviasales/v3/grouped_prices", {
    origin: params.origin,
    destination: params.destination,
    departure_at: params.month,
    group_by: "departure_at",
    one_way: "true",
  });

  const days = daysInMonth(params.month);
  if (data?.data) {
    const entries = Object.values(data.data) as ApiOffer[];
    if (entries.length) {
      const map = new Map<string, number>();
      for (const offer of entries) {
        const day = offer.departure_at?.slice(0, 10);
        if (!day) continue;
        const price = toEur(offer.price);
        if (!map.has(day) || price < map.get(day)!) map.set(day, price);
      }
      if (map.size) {
        return days
          .filter((d) => map.has(d))
          .map((d) => ({ date: d, priceEur: map.get(d)! }));
      }
    }
  }

  const base = basePriceEur(params.origin, params.destination);
  return days.map((date) => {
    const rand = seededRandom(`${params.origin}${params.destination}${date}`);
    const weekday = new Date(`${date}T00:00:00Z`).getUTCDay();
    const weekendPenalty = weekday === 5 || weekday === 0 ? 1.18 : weekday === 2 ? 0.88 : 1;
    return {
      date,
      priceEur: Math.max(25, Math.round(base * weekendPenalty * (0.82 + rand() * 0.6))),
    };
  });
}

export async function fetchMonthlyHistory(params: {
  origin: string;
  destination: string;
}): Promise<MonthlyPrice[]> {
  const base = basePriceEur(params.origin, params.destination);
  const months: MonthlyPrice[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - i, 1));
    const key = d.toISOString().slice(0, 7);
    const rand = seededRandom(`${params.origin}${params.destination}${key}`);
    const monthIndex = d.getUTCMonth();
    // Saisonnalité : plus cher en juillet/août et fin décembre.
    const seasonal =
      [0.92, 0.88, 0.9, 0.98, 1.0, 1.12, 1.28, 1.3, 1.02, 0.9, 0.86, 1.15][monthIndex] ?? 1;
    months.push({
      month: key,
      priceEur: Math.round(base * seasonal * (0.92 + rand() * 0.2)),
    });
  }
  return months;
}

export function daysInMonth(month: string): string[] {
  const [yearRaw, monthRaw] = month.split("-");
  const year = Number(yearRaw);
  const m = Number(monthRaw);
  const total = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return Array.from(
    { length: total },
    (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`,
  );
}

export function hasApiCredentials(): boolean {
  return getCredentials() !== null;
}

export const ALL_AIRPORT_CODES = AIRPORTS.map((a) => a.code);

/** Dates à explorer pour l'option « dates flexibles ± N jours ». */
export function shiftDates(date: string, days: number): string[] {
  const out: string[] = [];
  const today = new Date().toISOString().slice(0, 10);
  for (let offset = -days; offset <= days; offset += days) {
    const d = new Date(`${date}T00:00:00Z`);
    d.setUTCDate(d.getUTCDate() + offset);
    const iso = d.toISOString().slice(0, 10);
    if (iso >= today) out.push(iso);
  }
  return out.length ? out : [date];
}
