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
  /** Corps de réponse brut (JSON indenté) pour le panneau de debug. */
  body: string;
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

function bookingUrlFromApiLink(
  link: string,
  marker: string,
  passengers?: { adults: number; children: number; infants: number },
): string {
  const url = new URL(link, "https://www.aviasales.com");
  if (marker && !url.searchParams.has("marker")) url.searchParams.set("marker", marker);
  if (passengers) {
    // Le deep link Aviasales encode le nombre de voyageurs en fin de chemin
    // (…/search/PAR0110RAK1). On ajuste ce compteur sans toucher au reste du lien.
    const total = Math.min(
      9,
      Math.max(1, passengers.adults + passengers.children + passengers.infants),
    );
    url.pathname = url.pathname.replace(/(\/search\/[A-Z0-9]+?)\d$/i, `$1${total}`);
    url.searchParams.set("adults", String(passengers.adults));
    if (passengers.children > 0) url.searchParams.set("children", String(passengers.children));
    if (passengers.infants > 0) url.searchParams.set("infants", String(passengers.infants));
  }
  return url.toString();
}

/* -------------------------------------------------------------------------- */
/* Appel API                                                                   */
/* -------------------------------------------------------------------------- */

async function callApi<T>(
  path: string,
  params: Record<string, string>,
  currency = "eur",
): Promise<{ data: T; raw: RawApiCall }> {
  const creds = getCredentials();
  if (!creds) {
    throw new TravelpayoutsError(
      "La clé API Travelpayouts n'est pas configurée sur le serveur (TRAVELPAYOUTS_TOKEN).",
    );
  }
  const search = new URLSearchParams({
    ...params,
    currency: currency.toLowerCase(),
    token: creds.token,
  });
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
  let parsed: unknown = text;
  let body = text;
  try {
    parsed = JSON.parse(text);
    body = JSON.stringify(parsed, null, 2);
  } catch {
    /* réponse non JSON : conservée telle quelle pour le debug */
  }

  const raw: RawApiCall = { endpoint: path, params, status: res.status, body };

  if (!res.ok) {
    console.error(`Travelpayouts ${path} a répondu ${res.status}: ${text.slice(0, 500)}`);
    throw new TravelpayoutsError(
      "Impossible de charger les prix pour le moment, réessayez plus tard.",
    );
  }


  return { data: parsed as T, raw };
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

function offersFromApi(
  list: ApiOffer[],
  marker: string,
  passengers?: { adults: number; children: number; infants: number },
): FlightOffer[] {
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
        bookingUrl: bookingUrlFromApiLink(offer.link as string, marker, passengers),
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
  currency?: string;
  adults?: number;
  children?: number;
  infants?: number;
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

  const adults = Math.min(9, Math.max(1, params.adults ?? 1));
  const children = Math.min(8, Math.max(0, params.children ?? 0));
  // Un bébé par adulte maximum (règle des compagnies aériennes).
  const infants = Math.min(adults, Math.max(0, params.infants ?? 0));
  query["adults"] = String(adults);
  if (children > 0) query["children"] = String(children);
  if (infants > 0) query["infants"] = String(infants);
  query["passengers"] = String(adults + children + infants);

  const { data, raw } = await callApi<{ data?: ApiOffer[] }>(
    "/aviasales/v3/prices_for_dates",
    query,
    params.currency,
  );
  let list = data?.data ?? [];

  // Repli : requête fraîche au niveau du mois puis filtrage sur la date exacte.
  // La recherche ne dépend jamais du cache du calendrier.
  if (list.length === 0) {
    const day = params.departureAt.slice(0, 10);
    const monthQuery: Record<string, string> = {
      ...query,
      departure_at: day.slice(0, 7),
      limit: "1000",
    };
    if (params.returnAt) monthQuery["return_at"] = params.returnAt.slice(0, 7);

    const monthCall = await callApi<{ data?: ApiOffer[] }>(
      "/aviasales/v3/prices_for_dates",
      monthQuery,
      params.currency,
    );
    list = (monthCall.data?.data ?? []).filter((offer) => {
      if (offer?.departure_at?.slice(0, 10) !== day) return false;
      if (!params.returnAt) return true;
      return offer?.return_at?.slice(0, 10) === params.returnAt.slice(0, 10);
    });
  }

  const offers = offersFromApi(list, creds?.marker ?? "", { adults, children, infants });
  if ((params.currency ?? "eur").toLowerCase() === "eur") {
    void recordHistory(params.origin, params.destination, offers);
  }
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

/** Cache Supabase générique (mémorisation de réponses API, jamais d'estimation). */
const DESTINATIONS_TTL_MS = 6 * 60 * 60 * 1000;

async function readJsonCache<T>(key: string): Promise<T | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("price_cache")
      .select("payload,expires_at")
      .eq("cache_key", key)
      .maybeSingle();
    if (!data) return null;
    if (Date.parse(data.expires_at) < Date.now()) return null;
    return data.payload as T;
  } catch (error) {
    console.error("Lecture du cache destinations impossible", error);
    return null;
  }
}

async function writeJsonCache(key: string, payload: unknown, ttlMs: number): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("price_cache").upsert(
      {
        cache_key: key,
        payload: payload as never,
        expires_at: new Date(Date.now() + ttlMs).toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch (error) {
    console.error("Écriture du cache destinations impossible", error);
  }
}

type WorldOffer = { price: number; airline: string; departureAt: string };

function keepCheapest(map: Map<string, WorldOffer>, code: string, offer: WorldOffer): void {
  if (!code || offer.price <= 0 || !offer.departureAt) return;
  const current = map.get(code);
  if (!current || offer.price < current.price) map.set(code, offer);
}

/**
 * Balayage mondial : agrège plusieurs endpoints Travelpayouts couvrant toutes les
 * destinations connues depuis l'origine (aucune liste de villes codée en dur).
 * Le résultat complet est mis en cache par ville de départ, le filtrage par
 * budget se fait ensuite côté client sans nouvel appel.
 */
export async function fetchCheapestDestinations(params: {
  origin: string;
  /** Restreint le résultat à ces codes (accueil, page liaison). Ignoré en mode monde. */
  destinations?: string[];
  /** true = balayage mondial complet (mode budget). */
  world?: boolean;
  month?: string | undefined;
  currency?: string;
}): Promise<{ prices: DestinationPrice[]; raw: RawApiCall | null }> {
  const origin = params.origin.toUpperCase();
  const currency = (params.currency ?? "EUR").toUpperCase();
  const world = params.world === true;
  const cacheKey = ["world-destinations", origin, params.month ?? "any", currency].join(":");

  const restrict =
    !world && params.destinations && params.destinations.length > 0
      ? new Set(params.destinations.map((code) => code.toUpperCase()))
      : null;

  // Un seul balayage par ville de départ : le cache évite de re-solliciter l'API
  // à chaque changement de budget.
  if (world) {
    const cached = await readJsonCache<{ prices: DestinationPrice[] }>(cacheKey);
    if (cached?.prices?.length) return { prices: cached.prices, raw: null };
  }

  const monthQuery: Record<string, string> = {
    origin,
    one_way: "true",
    limit: "1000",
    sorting: "price",
  };
  if (params.month) monthQuery["departure_at"] = params.month;

  // 1) Prix par dates (large, mois demandé si précisé) — sert aussi de raw debug.
  const datesCall = await callApi<{ data?: ApiOffer[] }>(
    "/aviasales/v3/prices_for_dates",
    monthQuery,
    currency,
  );


  const cheapest = new Map<string, WorldOffer>();
  for (const offer of datesCall.data?.data ?? []) {
    keepCheapest(cheapest, offer.destination?.toUpperCase() ?? "", {
      price: offer.price,
      airline: offer.airline,
      departureAt: offer.departure_at,
    });
  }

  // 2) Derniers prix observés dans le monde entier (plusieurs centaines de villes).
  type LatestRow = {
    destination?: string;
    value?: number;
    airline?: string;
    gate?: string;
    depart_date?: string;
  };
  const latestQueries: Record<string, string>[] = [1, 2].map((page) => ({
    origin,
    period_type: "year",
    one_way: "true",
    page: String(page),
    limit: "1000",
    sorting: "price",
    show_to_affiliates: "true",
  }));
  for (const query of latestQueries) {
    try {
      const call = await callApi<{ data?: LatestRow[] }>("/v2/prices/latest", query, currency);
      for (const row of call.data?.data ?? []) {
        keepCheapest(cheapest, row.destination?.toUpperCase() ?? "", {
          price: Number(row.value ?? 0),
          airline: row.airline ?? "",
          departureAt: row.depart_date ?? "",
        });
      }
    } catch (error) {
      console.error("Balayage mondial partiel (prices/latest)", error);
    }
  }

  // 3) Directions connues depuis la ville de départ.
  try {
    const call = await callApi<{ data?: Record<string, ApiOffer> }>(
      "/v1/city-directions",
      { origin },
      currency,
    );
    for (const [code, offer] of Object.entries(call.data?.data ?? {})) {
      keepCheapest(cheapest, code.toUpperCase(), {
        price: offer.price,
        airline: offer.airline,
        departureAt: offer.departure_at,
      });
    }
  } catch (error) {
    console.error("Balayage mondial partiel (city-directions)", error);
  }

  // Localisation des codes IATA via le référentiel mondial des villes.
  let cityIndex = new Map<string, { city: string; country: string; lat: number; lng: number }>();
  try {
    const { getCityIndex } = await import("@/lib/geo.server");
    cityIndex = await getCityIndex();
  } catch (error) {
    console.error("Référentiel des villes indisponible, repli sur les aéroports connus", error);
  }

  const prices: DestinationPrice[] = [];
  for (const [code, offer] of cheapest) {
    if (code === origin) continue;
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
    });
  }

  prices.sort((a, b) => a.priceEur - b.priceEur);
  if (prices.length > 0) await writeJsonCache(cacheKey, { prices }, DESTINATIONS_TTL_MS);

  return { prices, raw: datesCall.raw };
}


/* -------------------------------------------------------------------------- */
/* Calendrier des prix                                                         */
/* -------------------------------------------------------------------------- */

/** Cache Supabase des mois de calendrier (aucune donnée estimée, juste mémorisée). */
const CALENDAR_TTL_MS = 6 * 60 * 60 * 1000;

async function readCalendarCache(key: string): Promise<CalendarDayPrice[] | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("price_cache")
      .select("payload,expires_at")
      .eq("cache_key", key)
      .maybeSingle();
    if (error || !data) return null;
    if (Date.parse(data.expires_at) < Date.now()) return null;
    const payload = data.payload as { days?: CalendarDayPrice[] } | null;
    return Array.isArray(payload?.days) ? payload!.days : null;
  } catch (error) {
    console.error("Lecture du cache calendrier impossible", error);
    return null;
  }
}

async function writeCalendarCache(key: string, days: CalendarDayPrice[]): Promise<void> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("price_cache").upsert(
      {
        cache_key: key,
        payload: { days },
        expires_at: new Date(Date.now() + CALENDAR_TTL_MS).toISOString(),
      },
      { onConflict: "cache_key" },
    );
  } catch (error) {
    console.error("Écriture du cache calendrier impossible", error);
  }
}

export async function fetchCalendarPrices(params: {
  origin: string;
  destination: string;
  /** Mois au format YYYY-MM à remplir (mois de départ, ou mois de retour en mode retour). */
  month: string;
  /** Nombre de nuits du séjour recherché (0 = aller simple). */
  tripDuration?: number;
  currency?: string;
  /** "departure" = prix par jour de départ ; "return" = prix par jour de retour. */
  mode?: "departure" | "return";
  /** Date de départ déjà choisie (obligatoire en mode retour). */
  departureAt?: string | null;
}): Promise<{ days: CalendarDayPrice[]; raw: RawApiCall | null; cached: boolean }> {
  const nights = Math.max(0, Math.round(params.tripDuration ?? 0));
  const mode = params.mode ?? "departure";
  const currency = (params.currency ?? "EUR").toUpperCase();
  const departureAt = params.departureAt ?? null;

  if (mode === "return" && !departureAt) {
    throw new TravelpayoutsError(
      "Choisissez d'abord une date de départ pour afficher les prix de retour.",
    );
  }

  const cacheKey = [
    "calendar",
    mode,
    params.origin,
    params.destination,
    params.month,
    currency,
    mode === "return" ? departureAt : String(nights),
  ].join(":");

  const cached = await readCalendarCache(cacheKey);
  if (cached) return { days: cached, raw: null, cached: true };

  const map = new Map<string, number>();
  let raw: RawApiCall | null = null;

  if (mode === "return") {
    // L'API refuse un écart de plus de 30 jours entre départ et retour :
    // on ne consulte que la fenêtre valide du mois demandé.
    const dayMs = 86400000;
    const depMs = Date.parse(`${departureAt!}T00:00:00Z`);
    const monthDays = daysInMonth(params.month).filter((d) => {
      const t = Date.parse(`${d}T00:00:00Z`);
      return t > depMs && t - depMs <= 30 * dayMs;
    });
    if (monthDays.length > 0) {
      // Un seul appel par mois : l'API accepte return_at au format YYYY-MM.
      const call = await callApi<{ data?: ApiOffer[] }>(
        "/aviasales/v3/prices_for_dates",
        {
          origin: params.origin,
          destination: params.destination,
          departure_at: departureAt!,
          return_at: params.month,
          one_way: "false",
          sorting: "price",
          limit: "1000",
        },
        currency,
      );
      raw = call.raw;
      const allowed = new Set(monthDays);
      for (const offer of call.data?.data ?? []) {
        const back = offer?.return_at?.slice(0, 10);
        if (!back || !allowed.has(back)) continue;
        const price = Math.round(offer.price);
        if (!map.has(back) || price < map.get(back)!) map.set(back, price);
      }
    }

  } else {
    const call = await callApi<{ data?: Record<string, ApiOffer> | ApiOffer[] }>(
      "/aviasales/v3/grouped_prices",
      {
        origin: params.origin,
        destination: params.destination,
        departure_at: params.month,
        group_by: "departure_at",
        one_way: nights > 0 ? "false" : "true",
      },
      currency,
    );
    raw = call.raw;
    for (const offer of Object.values(call.data?.data ?? {}) as ApiOffer[]) {
      const day = offer?.departure_at?.slice(0, 10);
      const back = offer?.return_at?.slice(0, 10);
      if (!day) continue;
      if (nights > 0) {
        // Seuls les allers-retours de la durée demandée (± 1 nuit) sont retenus.
        if (!back) continue;
        const actual = Math.round(
          (Date.parse(`${back}T00:00:00Z`) - Date.parse(`${day}T00:00:00Z`)) / 86400000,
        );
        if (Math.abs(actual - nights) > 1) continue;
      }
      const price = Math.round(offer.price);
      if (!map.has(day) || price < map.get(day)!) map.set(day, price);
    }
  }

  const days = daysInMonth(params.month)
    .filter((d) => map.has(d))
    .map((d) => ({ date: d, priceEur: map.get(d)! }));


  await writeCalendarCache(cacheKey, days);

  return { days, raw, cached: false };
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
