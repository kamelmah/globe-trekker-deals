import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { createAlert } from "@/lib/alerts.server";
import {
  fetchCalendarPrices,
  fetchCheapestDestinations,
  fetchMonthlyHistory,
  fetchOffers,
  hasApiCredentials,
  shiftDates,
} from "@/lib/travelpayouts.server";

const iata = z.string().trim().min(3).max(3).toUpperCase();
const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

export const searchFlights = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: iata,
        destination: iata,
        departureAt: isoDate,
        returnAt: isoDate.nullish(),
        flexible: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const dates = data.flexible ? shiftDates(data.departureAt, 3) : [data.departureAt];
    const batches = await Promise.all(
      dates.map((departureAt) =>
        fetchOffers({
          origin: data.origin,
          destination: data.destination,
          departureAt,
          returnAt: data.returnAt ?? null,
        }),
      ),
    );
    const offers = batches.flat().sort((a, b) => a.priceEur - b.priceEur).slice(0, 40);
    return { offers, demo: !hasApiCredentials() };
  });

export const cheapestDestinations = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: iata,
        month: z.string().regex(/^\d{4}-\d{2}$/).nullish(),
        destinations: z.array(iata).min(1).max(80),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const prices = await fetchCheapestDestinations({
      origin: data.origin,
      destinations: data.destinations,
      month: data.month ?? undefined,
    });
    return { prices, demo: !hasApiCredentials() };
  });

export const calendarPrices = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: iata,
        destination: iata,
        month: z.string().regex(/^\d{4}-\d{2}$/),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const days = await fetchCalendarPrices(data);
    return { days, demo: !hasApiCredentials() };
  });

export const monthlyHistory = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ origin: iata, destination: iata }).parse(data))
  .handler(async ({ data }) => {
    const months = await fetchMonthlyHistory(data);
    return { months, demo: !hasApiCredentials() };
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
