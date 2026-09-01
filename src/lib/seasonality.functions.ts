import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const iata = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/);

/**
 * Saisonnalité d'un trajet, lue en base uniquement.
 *
 * Aucun appel à la source tarifaire n'est fait ici : les relevés sont produits
 * hors ligne par la tâche planifiée. Une page vue par un robot ne consomme donc
 * rien.
 */
export const routeSeasonality = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ origin: iata, destination: iata }).parse(data))
  .handler(async ({ data }) => {
    const { fetchSeasonalityPoints } = await import("@/lib/seasonality.server");
    return { points: await fetchSeasonalityPoints(data) };
  });
