import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createAlert, deactivateAlert } from "@/lib/alerts.server";
import type { ApiDebugInfo } from "@/lib/flights.types";
import { addDaysIso as addDays } from "@/lib/trip-duration";
import {
  TravelpayoutsError,
  fetchCalendarPrices,
  fetchCheapestDestinations,
  fetchMonthlyHistory,
  fetchOffers,
  hasApiCredentials,
  shiftDates,
  type RawApiCall,
} from "@/lib/travelpayouts.server";

const iata = z.string().trim().min(3).max(3).toUpperCase();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const currency = z.enum(["EUR", "USD", "GBP", "CHF", "CAD"]).optional();

/** La réponse brute n'est exposée qu'en développement. */
function debugOf(raw: RawApiCall | null): ApiDebugInfo | null {
  if (process.env["NODE_ENV"] === "production") return null;
  if (!raw) return null;
  return {
    endpoint: raw.endpoint,
    params: raw.params,
    status: raw.status,
    body: raw.body.length > 20000 ? `${raw.body.slice(0, 20000)}\n… (tronqué)` : raw.body,
  };
}

function messageOf(error: unknown): string {
  if (error instanceof TravelpayoutsError) return error.message;
  console.error("Erreur inattendue côté prix", error);
  return "Une erreur est survenue lors de la récupération des prix. Aucun résultat n'est affiché.";
}

export const searchFlights = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: iata,
        destination: iata,
        departureAt: isoDate,
        returnAt: isoDate.nullish(),
        /** Nombre de nuits imposé par le raccourci de durée (0 = dates libres). */
        tripDuration: z.number().int().min(0).max(30).optional(),
        flexible: z.boolean().optional(),
        currency,
        adults: z.number().int().min(1).max(9).optional(),
        children: z.number().int().min(0).max(8).optional(),
        infants: z.number().int().min(0).max(9).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const dates = data.flexible ? shiftDates(data.departureAt, 3) : [data.departureAt];
    const nights = data.tripDuration ?? 0;
    try {
      const batches = await Promise.all(
        dates.map((departureAt) =>
          fetchOffers({
            origin: data.origin,
            destination: data.destination,
            departureAt,
            // Avec un raccourci de durée, le retour suit chaque date de départ testée.
            returnAt: nights > 0 ? addDays(departureAt, nights) : data.returnAt ?? null,
            currency: data.currency ?? "EUR",
            adults: data.adults ?? 1,
            children: data.children ?? 0,
            infants: Math.min(data.adults ?? 1, data.infants ?? 0),
          }),
        ),
      );

      const offers = batches
        .flatMap((batch) => batch.offers)
        .sort((a, b) => a.priceEur - b.priceEur)
        .slice(0, 40);

      // Vrai zéro API : on propose les dates réellement disponibles du mois.
      let alternatives: { date: string; priceEur: number }[] = [];
      if (offers.length === 0) {
        try {
          const month = data.departureAt.slice(0, 7);
          const { days } = await fetchCalendarPrices({
            origin: data.origin,
            destination: data.destination,
            month,
            tripDuration: nights,
            currency: data.currency ?? "EUR",
            mode: "departure",
          });
          const ref = Date.parse(`${data.departureAt}T00:00:00Z`);
          alternatives = days
            .filter((d) => d.date !== data.departureAt)
            .sort(
              (a, b) =>
                Math.abs(Date.parse(`${a.date}T00:00:00Z`) - ref) -
                Math.abs(Date.parse(`${b.date}T00:00:00Z`) - ref),
            )
            .slice(0, 6)
            .sort((a, b) => a.date.localeCompare(b.date));
        } catch (calendarError) {
          console.error("Dates alternatives indisponibles", calendarError);
        }
      }

      return {
        offers,
        alternatives,
        error: null as string | null,
        debug: debugOf(batches[0]?.raw ?? null),
        configured: hasApiCredentials(),
      };
    } catch (error) {
      return {
        offers: [],
        alternatives: [] as { date: string; priceEur: number }[],
        error: messageOf(error),
        debug: null,
        configured: hasApiCredentials(),
      };
    }

  });

export const cheapestDestinations = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: iata,
        month: z.string().regex(/^\d{4}-\d{2}$/).nullish(),
        destinations: z.array(iata).min(1).max(80),
        currency,
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      const { prices, raw } = await fetchCheapestDestinations({
        origin: data.origin,
        destinations: data.destinations,
        month: data.month ?? undefined,
        currency: data.currency ?? "EUR",
      });
      return { prices, error: null as string | null, debug: debugOf(raw) };
    } catch (error) {
      return { prices: [], error: messageOf(error), debug: null };
    }
  });

export const calendarPrices = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: iata,
        destination: iata,
        month: z.string().regex(/^\d{4}-\d{2}$/),
        tripDuration: z.number().int().min(0).max(30).optional(),
        currency,
        mode: z.enum(["departure", "return"]).optional(),
        departureAt: isoDate.nullish(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    try {
      const { days, raw, cached } = await fetchCalendarPrices({
        origin: data.origin,
        destination: data.destination,
        month: data.month,
        tripDuration: data.tripDuration ?? 0,
        currency: data.currency ?? "EUR",
        mode: data.mode ?? "departure",
        departureAt: data.departureAt ?? null,
      });
      return { days, error: null as string | null, debug: debugOf(raw), cached };
    } catch (error) {
      return { days: [], error: messageOf(error), debug: null, cached: false };
    }
  });

export const monthlyHistory = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ origin: iata, destination: iata }).parse(data))
  .handler(async ({ data }) => {
    const { months } = await fetchMonthlyHistory(data);
    return { months };
  });

export const subscribeToAlert = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        email: z.string().trim().email().max(180),
        origin: iata,
        destination: iata,
        departDate: isoDate.nullish(),
        returnDate: isoDate.nullish(),
        referencePrice: z.number().positive().max(100000),
      })
      .parse(data),
  )
  .handler(async ({ data }) =>
    createAlert({
      email: data.email,
      origin: data.origin,
      destination: data.destination,
      departDate: data.departDate ?? null,
      returnDate: data.returnDate ?? null,
      referencePrice: data.referencePrice,
    }),
  );

export const unsubscribeAlert = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: z.string().trim().min(8).max(128) }).parse(data))
  .handler(async ({ data }) => ({ ok: await deactivateAlert(data.token) }));
