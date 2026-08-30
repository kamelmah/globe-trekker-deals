import { AIRPORTS, getAirport } from "@/data/airports";
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

export function hasApiCredentials(): boolean {
  return getCredentials() !== null;
}

/** Toute donnée affichée provient de l'API : en cas d'échec on remonte l'erreur. */
export class TravelpayoutsError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "TravelpayoutsError";
  }
}

export type RawApiCall = {
  endpoint: string;
  params: Record<string, string>;
  status: number;
  body: unknown;
};

/* -------------------------------------------------------------------------- */
/* Noms de compagnies (libellés d'affichage uniquement)                        */
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

function airlineName(code: string): string {
  if (!code) return "Compagnie non communiquée";
  return AIRLINE_NAMES[code.toUpperCase()] ?? code.toUpperCase();
}

/** Le vendeur affiché est celui renvoyé par l'API (champ gate/agent). */
function resolveSeller(gate: unknown, airline: string): string {
  const raw = typeof gate === "string" ? gate.trim() : "";
  return raw.length > 1 ? raw : airline;
}

/* -------------------------------------------------------------------------- */
/* Lien de réservation : exactement celui renvoyé par l'API                    */
/* -------------------------------------------------------------------------- */

function bookingUrlFromApiLink(link: string, marker: string): string {
  const url = new URL(link, "https://www.aviasales.com");
  if (marker && !url.searchParams.has("marker")) url.searchParams.set("marker", marker);
  return url.toString();
}

/* -------------------------------------------------------------------------- */
/* Appel API                                                                   */
/* -------------------------------------------------------------------------- */

async function callApi<T>(
  path: string,
  params: Record<string, string>,
): Promise<{ data: T; raw: RawApiCall }> {
  const creds = getCredentials();
  if (!creds) {
    throw new TravelpayoutsError(
      "La clé API Travelpayouts n'est pas configurée sur le serveur (TRAVELPAYOUTS_TOKEN).",
    );
  }
  const search = new URLSearchParams({ ...params, currency: "eur", token: creds.token });
  let res: Response;
  try {
    res = await fetch(`${API_BASE}${path}?${search.toString()}`, {
      headers: { Accept: "application/json" },
    });
  } catch (error) {
    console.error("Appel Travelpayouts en échec réseau", error);
    throw new TravelpayoutsError("Le service de prix est momentanément injoignable.");
  }

  const text = await res.text();
  let body: unknown = text;
  try {
    body = JSON.parse(text);
  } catch {
    /* réponse non JSON : conservée telle quelle pour le debug */
  }

  const raw: RawApiCall = { endpoint: path, params, status: res.status, body };

  if (!res.ok) {
    console.error(`Travelpayouts ${path} a répondu ${res.status}: ${text.slice(0, 500)}`);
    throw new TravelpayoutsError(
      `Le service de prix a renvoyé une erreur (${res.status}). Aucun résultat n'est affiché.`,
    );
  }

  return { data: body as T, raw };
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

function offersFromApi(list: ApiOffer[], marker: string): FlightOffer[] {
  return list
    .filter((offer) => typeof offer?.link === "string" && offer.link.length > 0)
    .map((offer, index) => {
      const airline = airlineName(offer.airline);
      const stops = offer.transfers ?? 0;
      return {
        id: `${offer.origin}-${offer.destination}-${offer.departure_at}-${index}`,
        origin: offer.origin,
        destination: offer.destination,
        priceEur: Math.round(offer.price),
        airline,
        airlineCode: offer.airline,
        seller: resolveSeller(offer.gate, airline),
        flightNumber: offer.flight_number ? `${offer.airline}${offer.flight_number}` : "",
        departureAt: offer.departure_at,
        returnAt: offer.return_at ?? null,
        durationMinutes: offer.duration ?? offer.duration_to ?? 0,
        stops,
        cabinBag: true,
        checkedBag: false,
        co2Kg: estimateCo2Kg(offer.origin, offer.destination, stops),
        bookingUrl: bookingUrlFromApiLink(offer.link as string, marker),
      } satisfies FlightOffer;
    })
    .sort((a, b) => a.priceEur - b.priceEur);
}

/* -------------------------------------------------------------------------- */
/* Recherche de vols                                                           */
/* -------------------------------------------------------------------------- */

export async function fetchOffers(params: {
  origin: string;
  destination: string;
  departureAt: string;
  returnAt?: string | null;
}): Promise<{ offers: FlightOffer[]; raw: RawApiCall }> {
  const creds = getCredentials();
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

  const { data, raw } = await callApi<{ data?: ApiOffer[] }>(
    "/aviasales/v3/prices_for_dates",
    query,
  );
  const offers = offersFromApi(data?.data ?? [], creds?.marker ?? "");
  void recordHistory(params.origin, params.destination, offers);
  return { offers, raw };
}

/** Enregistre l'observation réelle du prix le plus bas du mois (best effort). */
async function recordHistory(
  origin: string,
  destination: string,
  offers: FlightOffer[],
): Promise<void> {
  const cheapest = offers[0];
  if (!cheapest) return;
  const month = cheapest.departureAt.slice(0, 7);
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("price_history")
      .select("id,lowest_price")
      .eq("origin", origin)
      .eq("destination", destination)
      .eq("month", month)
      .maybeSingle();
    if (data && Number(data.lowest_price) <= cheapest.priceEur) return;
    if (data) {
      await supabaseAdmin
        .from("price_history")
        .update({ lowest_price: cheapest.priceEur, updated_at: new Date().toISOString() })
        .eq("id", data.id);
      return;
    }
    await supabaseAdmin
      .from("price_history")
      .insert({ origin, destination, month, lowest_price: cheapest.priceEur, currency: "eur" });
  } catch (error) {
    console.error("Historique de prix non enregistré", error);
  }
}

/* -------------------------------------------------------------------------- */
/* Destinations les moins chères                                               */
/* -------------------------------------------------------------------------- */

export async function fetchCheapestDestinations(params: {
  origin: string;
  destinations: string[];
  month?: string | undefined;
}): Promise<{ prices: DestinationPrice[]; raw: RawApiCall }> {
  const query: Record<string, string> = {
    origin: params.origin,
    one_way: "true",
    limit: "1000",
    sorting: "price",
  };
  if (params.month) query["departure_at"] = params.month;

  const { data, raw } = await callApi<{ data?: ApiOffer[] }>(
    "/aviasales/v3/prices_for_dates",
    query,
  );

  const cheapest = new Map<string, ApiOffer>();
  for (const offer of data?.data ?? []) {
    const current = cheapest.get(offer.destination);
    if (!current || offer.price < current.price) cheapest.set(offer.destination, offer);
  }

  const prices: DestinationPrice[] = [];
  for (const code of params.destinations) {
    const airport = getAirport(code);
    const offer = cheapest.get(code);
    if (!airport || !offer) continue;
    prices.push({
      destination: code,
      city: airport.city,
      country: airport.country,
      lat: airport.lat,
      lng: airport.lng,
      priceEur: Math.round(offer.price),
      airline: airlineName(offer.airline),
      departureAt: offer.departure_at,
    });
  }

  return { prices: prices.sort((a, b) => a.priceEur - b.priceEur), raw };
}

/* -------------------------------------------------------------------------- */
/* Calendrier des prix                                                         */
/* -------------------------------------------------------------------------- */

export async function fetchCalendarPrices(params: {
  origin: string;
  destination: string;
  /** Mois au format YYYY-MM. */
  month: string;
}): Promise<{ days: CalendarDayPrice[]; raw: RawApiCall }> {
  const { data, raw } = await callApi<{ data?: Record<string, ApiOffer> | ApiOffer[] }>(
    "/aviasales/v3/grouped_prices",
    {
      origin: params.origin,
      destination: params.destination,
      departure_at: params.month,
      group_by: "departure_at",
      one_way: "true",
    },
  );

  const entries = Object.values(data?.data ?? {}) as ApiOffer[];
  const map = new Map<string, number>();
  for (const offer of entries) {
    const day = offer?.departure_at?.slice(0, 10);
    if (!day) continue;
    const price = Math.round(offer.price);
    if (!map.has(day) || price < map.get(day)!) map.set(day, price);
  }

  const days = daysInMonth(params.month)
    .filter((d) => map.has(d))
    .map((d) => ({ date: d, priceEur: map.get(d)! }));

  return { days, raw };
}

/* -------------------------------------------------------------------------- */
/* Historique réel observé (table price_history)                               */
/* -------------------------------------------------------------------------- */

export async function fetchMonthlyHistory(params: {
  origin: string;
  destination: string;
}): Promise<{ months: MonthlyPrice[] }> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("price_history")
      .select("month,lowest_price")
      .eq("origin", params.origin)
      .eq("destination", params.destination)
      .order("month", { ascending: true })
      .limit(24);
    if (error) throw error;
    return {
      months: (data ?? []).map((row) => ({
        month: row.month.slice(0, 7),
        priceEur: Math.round(Number(row.lowest_price)),
      })),
    };
  } catch (error) {
    console.error("Lecture de l'historique impossible", error);
    return { months: [] };
  }
}

export function daysInMonth(month: string): string[] {
  const [yearRaw, monthRaw] = month.split("-");
  const year = Number(yearRaw);
  const m = Number(monthRaw);
  const total = new Date(Date.UTC(year, m, 0)).getUTCDate();
  return Array.from({ length: total }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
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
