/**
 * Lecture des relevés servant à mesurer la variation de prix d'une route.
 *
 * Aucun appel à la source tarifaire : comme le reste des pages de liaison, on
 * relit ce que la tâche planifiée a déjà écrit.
 */

import { computePriceTrend, type ObservationRow, type PriceTrend } from "@/lib/price-trend";

/**
 * Assez de lignes pour couvrir plusieurs jours de relevé.
 *
 * Un passage écrit douze mois d'un coup : seize jours de relevés tiennent dans
 * 200 lignes, et deux suffisent. La marge absorbe les passages partiels, où
 * certains mois n'ont pas renvoyé d'offre.
 */
const ROWS_LIMIT = 200;

export async function fetchPriceTrend(route: {
  origin: string;
  destination: string;
}): Promise<PriceTrend | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("price_observations")
      .select("departure_month,lowest_price,observed_on")
      .eq("origin", route.origin.toUpperCase())
      .eq("destination", route.destination.toUpperCase())
      .order("observed_on", { ascending: false })
      .limit(ROWS_LIMIT);
    if (error) throw error;

    const rows: ObservationRow[] = (data ?? []).map((row) => ({
      month: String(row.departure_month).slice(0, 7),
      priceEur: Number(row.lowest_price),
      observedOn: String(row.observed_on).slice(0, 10),
    }));
    return computePriceTrend(rows);
  } catch (error) {
    // Une lecture qui échoue rend la variation absente, jamais fausse.
    console.error("Lecture de la variation de prix impossible", error);
    return null;
  }
}
