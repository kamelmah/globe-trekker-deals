/**
 * Les planchers les plus bas du site, toutes routes confondues.
 *
 * Alimente /moins-cher. Aucun appel à la source tarifaire : les relevés
 * viennent de `price_observations`, écrits par la tâche planifiée.
 *
 * Une route n'apparaît que si elle a été relevée dans les trente derniers
 * jours. Un plancher de mars affiché en septembre n'est pas une bonne affaire,
 * c'est une donnée périmée — et cette page ne vaut que par la fraîcheur de ce
 * qu'elle montre.
 */

import { DESTINATIONS } from "@/data/destinations";
import { PRUNED_ROUTE_SLUGS, withoutPruned } from "@/data/pruned-pages";
import { ROUTE_WHITELIST } from "@/data/route-whitelist";

/** Au-delà, un relevé ne dit plus rien du prix d'aujourd'hui. */
export const MAX_AGE_DAYS = 30;

/** Nombre de lignes affichées. */
export const CHEAPEST_LIMIT = 20;

/**
 * Lignes lues avant regroupement.
 *
 * La requête trie par prix croissant : les vingt couples les moins chers ont
 * forcément leur plancher parmi les toutes premières lignes. Deux mille laissent
 * une marge très large sans ramener la fenêtre entière.
 */
const ROWS_LIMIT = 2000;

export type CheapestRoute = {
  slug: string;
  originCity: string;
  destinationCity: string;
  country: string;
  priceEur: number;
  /** Jour du relevé qui porte ce plancher, AAAA-MM-JJ. */
  observedOn: string;
};

/**
 * Index des routes ayant une page /vols indexable, par couple IATA.
 *
 * Les pages élaguées en sont exclues : cette page est un point d'entrée, et y
 * envoyer un lien interne vers une page en `noindex` gaspille du crawl.
 */
function routeIndex(): Map<
  string,
  { slug: string; originCity: string; destinationCity: string; country: string }
> {
  const index = new Map<
    string,
    { slug: string; originCity: string; destinationCity: string; country: string }
  >();
  for (const r of ROUTE_WHITELIST) {
    index.set(`${r.origin.toUpperCase()}-${r.destination.toUpperCase()}`, {
      slug: r.slug,
      originCity: r.originCity,
      destinationCity: r.destinationCity,
      country: r.country,
    });
  }
  for (const d of withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS)) {
    const cle = `${d.origin.toUpperCase()}-${d.destination.toUpperCase()}`;
    if (index.has(cle)) continue;
    index.set(cle, {
      slug: d.slug,
      originCity: d.originCity,
      destinationCity: d.destinationCity,
      country: d.country,
    });
  }
  return index;
}

/** Date limite de fraîcheur, au format AAAA-MM-JJ. */
function cutoffDate(days: number): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

export async function fetchCheapestRoutes(params?: {
  limit?: number | undefined;
  maxAgeDays?: number | undefined;
}): Promise<CheapestRoute[]> {
  const limit = params?.limit ?? CHEAPEST_LIMIT;
  const cutoff = cutoffDate(params?.maxAgeDays ?? MAX_AGE_DAYS);

  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data, error } = await supabaseAdmin
      .from("price_observations")
      .select("origin,destination,lowest_price,observed_on")
      .gte("observed_on", cutoff)
      .order("lowest_price", { ascending: true })
      .limit(ROWS_LIMIT);
    if (error) throw error;

    const index = routeIndex();
    // Un plancher par couple : la première ligne rencontrée est la moins chère,
    // la requête étant déjà triée par prix.
    const parCouple = new Map<string, CheapestRoute>();
    for (const row of data ?? []) {
      const cle = `${String(row.origin).toUpperCase()}-${String(row.destination).toUpperCase()}`;
      if (parCouple.has(cle)) continue;
      const route = index.get(cle);
      if (!route) continue;
      const priceEur = Math.round(Number(row.lowest_price));
      if (!Number.isFinite(priceEur) || priceEur <= 0) continue;
      parCouple.set(cle, { ...route, priceEur, observedOn: String(row.observed_on).slice(0, 10) });
    }

    return [...parCouple.values()]
      .sort((a, b) => a.priceEur - b.priceEur || a.slug.localeCompare(b.slug, "fr"))
      .slice(0, limit);
  } catch (error) {
    // Lecture impossible : la page s'affiche sans tableau plutôt qu'avec des
    // prix inventés.
    console.error("Lecture des planchers les plus bas impossible", error);
    return [];
  }
}
