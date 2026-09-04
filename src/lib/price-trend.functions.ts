import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const iata = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/);

/**
 * Variation du prix d'une route entre ses deux derniers relevés, lue en base
 * uniquement. Aucun appel à la source tarifaire au chargement d'une page.
 */
export const routePriceTrend = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ origin: iata, destination: iata }).parse(data))
  .handler(async ({ data }) => {
    const { fetchPriceTrend } = await import("@/lib/price-trend.server");
    return { trend: await fetchPriceTrend(data) };
  });
