import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const iata = z
  .string()
  .trim()
  .toUpperCase()
  .regex(/^[A-Z]{3}$/);

export type GuidePriceSnapshot = {
  /** Prix le plus bas réellement relevé (€), null si aucun relevé en base. */
  lowestEur: number | null;
  /** Mois du relevé (YYYY-MM), null si inconnu. */
  month: string | null;
  /** Date du dernier relevé Travelpayouts enregistré (ISO), null si aucun. */
  updatedAt: string | null;
};

/**
 * Relit le prix le plus bas déjà observé pour un trajet (table price_history,
 * alimentée par les appels Travelpayouts). Aucun appel API n'est fait ici :
 * les robots et les visiteurs ne consomment jamais le quota, et aucun prix
 * n'est estimé — sans relevé, on renvoie null.
 */
export const guidePriceSnapshot = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ origin: iata, destination: iata }).parse(data))
  .handler(async ({ data }): Promise<GuidePriceSnapshot> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: rows, error } = await supabaseAdmin
        .from("price_history")
        .select("month,lowest_price,updated_at")
        .eq("origin", data.origin)
        .eq("destination", data.destination)
        .order("lowest_price", { ascending: true })
        .limit(24);
      if (error) throw error;
      if (!rows?.length) return { lowestEur: null, month: null, updatedAt: null };
      const cheapest = rows[0]!;
      const updatedAt = rows
        .map((row) => row.updated_at)
        .filter((value): value is string => Boolean(value))
        .sort()
        .at(-1);
      return {
        lowestEur: Math.round(Number(cheapest.lowest_price)),
        month: cheapest.month ? cheapest.month.slice(0, 7) : null,
        updatedAt: updatedAt ?? null,
      };
    } catch (error) {
      console.error("Lecture du prix relevé impossible", error);
      return { lowestEur: null, month: null, updatedAt: null };
    }
  });
