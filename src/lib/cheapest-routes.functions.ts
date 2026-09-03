import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Les planchers les plus bas du site, lus en base uniquement. Aucun appel à la
 * source tarifaire au chargement de la page.
 */
export const cheapestRoutes = createServerFn({ method: "GET" })
  .inputValidator((data) =>
    z
      .object({
        limit: z.number().int().min(1).max(50).optional(),
        maxAgeDays: z.number().int().min(1).max(365).optional(),
      })
      .parse(data ?? {}),
  )
  .handler(async ({ data }) => {
    const { fetchCheapestRoutes } = await import("@/lib/cheapest-routes.server");
    return { routes: await fetchCheapestRoutes(data) };
  });
