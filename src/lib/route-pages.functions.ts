import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const dynamicRoutePage = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().trim().min(3).max(80) }).parse(data))
  .handler(async ({ data }) => {
    const { buildDynamicRoutePage } = await import("@/lib/route-pages.server");
    const route = await buildDynamicRoutePage(data.slug);
    return { route };
  });

export const relatedRoutePages = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: z.string().trim().min(3).max(3),
        originCity: z.string().trim().min(1).max(80),
        exclude: z.string().trim().max(3).optional(),
        // Pays de la destination affichée : sert à remonter en tête les autres
        // liaisons vers ce pays, puis vers ses voisins.
        country: z.string().trim().min(1).max(80).optional(),
        limit: z.number().int().min(1).max(24).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { listRelatedRoutes } = await import("@/lib/route-pages.server");
    return { related: await listRelatedRoutes(data) };
  });

/**
 * Liaisons les moins chères au départ d'une ville, d'après les seuls relevés
 * déjà enregistrés (aucun appel à l'API tarifaire). Alimente la section
 * « Les moins chers depuis … » de la page d'accueil.
 */
export const cheapestWhitelistedRoutes = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: z.string().trim().min(3).max(3),
        limit: z.number().int().min(1).max(12).optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { listCheapestWhitelistedRoutes } = await import("@/lib/route-pages.server");
    return { routes: await listCheapestWhitelistedRoutes(data) };
  });

/**
 * Plancher déjà relevé pour une poignée de destinations depuis une même
 * origine. Aucun appel à l'API tarifaire : sans relevé, la valeur est absente
 * et l'appelant n'affiche rien plutôt qu'un prix inventé.
 */
export const observedLowestPrices = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        origin: z.string().trim().min(3).max(3),
        destinations: z.array(z.string().trim().min(3).max(3)).min(1).max(40),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const { readHistoryLows } = await import("@/lib/route-pages.server");
    const lows = await readHistoryLows(data.origin, data.destinations);
    return { prices: Object.fromEntries(lows) as Record<string, { priceEur: number }> };
  });
