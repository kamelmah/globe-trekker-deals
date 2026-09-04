import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const iata = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/);

/**
 * Nombre d'alertes actives sur une liaison, déjà filtré par le seuil
 * d'affichage : le client ne reçoit jamais un compte qu'il ne doit pas montrer.
 */
export const activeAlertCount = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ origin: iata, destination: iata }).parse(data))
  .handler(async ({ data }) => {
    const { countActiveAlerts, displayableAlertCount } = await import("@/lib/alert-count.server");
    return { count: displayableAlertCount(await countActiveAlerts(data)) };
  });
