import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import { PlacesError, fetchPlaces, type Place } from "@/lib/places.server";

export type PlacesResult = { places: Place[]; error: string | null };

export const searchPlaces = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z.object({ term: z.string().trim().max(80) }).parse(data),
  )
  .handler(async ({ data }): Promise<PlacesResult> => {
    if (data.term.length < 2) return { places: [], error: null };
    try {
      return { places: await fetchPlaces(data.term), error: null };
    } catch (error) {
      const message =
        error instanceof PlacesError
          ? error.message
          : "Une erreur est survenue lors de la recherche de villes.";
      if (!(error instanceof PlacesError)) console.error("Erreur autocomplete", error);
      return { places: [], error: message };
    }
  });

export const resolvePlace = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ term: z.string().trim().max(80) }).parse(data))
  .handler(async ({ data }): Promise<{ place: Place | null; error: string | null }> => {
    try {
      return { place: await resolveBestPlace(data.term), error: null };
    } catch (error) {
      const message =
        error instanceof PlacesError
          ? error.message
          : "Une erreur est survenue lors de la recherche de villes.";
      if (!(error instanceof PlacesError)) console.error("Erreur résolution ville", error);
      return { place: null, error: message };
    }
  });
