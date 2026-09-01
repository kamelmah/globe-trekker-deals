/**
 * Saisonnalité : relevé du prix le plus bas par mois de départ, route par route.
 *
 * Pourquoi route par route, alors qu'un balayage par ville de départ coûterait
 * douze appels au lieu de 1 536 : mesuré, le balayage renvoie les meilleures
 * affaires de l'origine, pas une matrice par mois. Il donne une médiane d'un
 * seul mois par route, et trois routes marseillaises sur soixante-quatre
 * atteignent six mois. Il ne peut donc pas produire une saisonnalité. Le coût
 * plus élevé achète la seule donnée qui existe.
 *
 * Ces appels sont hors ligne et périodiques : aucun n'est déclenché par le
 * chargement d'une page.
 */

import { DESTINATIONS } from "@/data/destinations";
import { ROUTE_WHITELIST } from "@/data/route-whitelist";
import type { SeasonPoint } from "@/lib/seasonality";

const API = "https://api.travelpayouts.com/aviasales/v3/prices_for_dates";

/** Mois couverts par un relevé complet. */
const MOIS_COUVERTS = 12;

/** Routes traitées par invocation, pour que le travail soit étalé. */
const ROUTES_PAR_PASSAGE = 8;

/** Requêtes simultanées vers la source tarifaire. */
const PARALLELISME = 4;

type Route = { origin: string; destination: string };

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/* -------------------------------------------------------------------------- */
/* Lecture                                                                     */
/* -------------------------------------------------------------------------- */

/**
 * Saisonnalité courante d'un trajet : le relevé le plus RÉCENT pour chaque mois
 * de départ.
 *
 * Volontairement pas le minimum absolu de `price_history` : celui-ci ne se
 * révise qu'à la baisse et finit par décrire un prix que plus personne ne
 * trouve. Pour répondre à « quand partir », c'est le dernier prix constaté qui
 * compte, et il est daté.
 */
export async function fetchSeasonalityPoints(route: Route): Promise<SeasonPoint[]> {
  try {
    const db = await admin();
    const { data, error } = await db
      .from("price_observations")
      .select("departure_month,lowest_price,observed_at")
      .eq("origin", route.origin)
      .eq("destination", route.destination)
      .order("departure_month", { ascending: true })
      .order("observed_on", { ascending: false })
      .limit(400);
    if (error) throw error;

    // Une ligne par mois : la première rencontrée est la plus récente.
    const parMois = new Map<string, SeasonPoint>();
    for (const row of data ?? []) {
      const month = String(row.departure_month).slice(0, 7);
      if (parMois.has(month)) continue;
      parMois.set(month, {
        month,
        priceEur: Math.round(Number(row.lowest_price)),
        ...(row.observed_at ? { observedAt: String(row.observed_at) } : {}),
      });
    }
    return [...parMois.values()];
  } catch (error) {
    console.error("Lecture de la saisonnalité impossible", error);
    return [];
  }
}

/* -------------------------------------------------------------------------- */
/* Relevé                                                                      */
/* -------------------------------------------------------------------------- */

function prochainsMois(count: number): string[] {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
  });
}

/** Prix le plus bas d'un mois, ou null. Aucune valeur n'est inventée ni lissée. */
async function lowestForMonth(route: Route, month: string, token: string): Promise<number | null> {
  const url = new URL(API);
  for (const [key, value] of Object.entries({
    origin: route.origin,
    destination: route.destination,
    departure_at: month,
    one_way: "true",
    direct: "false",
    sorting: "price",
    limit: "30",
    currency: "eur",
    token,
  })) {
    url.searchParams.set(key, value);
  }

  for (let essai = 0; essai < 3; essai += 1) {
    try {
      const res = await fetch(url, {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(20000),
      });
      if (res.status === 429 || res.status >= 500) {
        await new Promise((r) => setTimeout(r, 1200 * (essai + 1)));
        continue;
      }
      if (!res.ok) return null;
      const json = (await res.json()) as { data?: { price?: unknown; departure_at?: unknown }[] };
      const prix = (Array.isArray(json.data) ? json.data : [])
        .filter((o) => String(o.departure_at ?? "").startsWith(month))
        .map((o) => Number(o.price))
        .filter((p) => Number.isFinite(p) && p > 0);
      return prix.length ? Math.min(...prix) : null;
    } catch {
      await new Promise((r) => setTimeout(r, 1000 * (essai + 1)));
    }
  }
  return null;
}

/* -------------------------------------------------------------------------- */
/* Choix des routes                                                            */
/* -------------------------------------------------------------------------- */

/** Toutes les pages /vols : liste blanche et pages éditoriales, dédoublonnées. */
function allRoutes(): Route[] {
  const parCle = new Map<string, Route>();
  for (const r of [...ROUTE_WHITELIST, ...DESTINATIONS]) {
    const origin = r.origin.toUpperCase();
    const destination = r.destination.toUpperCase();
    const cle = `${origin}-${destination}`;
    if (!parCle.has(cle)) parCle.set(cle, { origin, destination });
  }
  return [...parCle.values()];
}

/**
 * Les routes les plus anciennement relevées d'abord, celles jamais relevées
 * avant tout.
 *
 * C'est ce qui rend le travail reprenable sans curseur à tenir : un échec au
 * milieu ne laisse aucun état à réparer, il laisse simplement des routes
 * anciennes, que le passage suivant reprendra en premier. Rien n'oblige jamais
 * à tout relancer.
 */
async function stalestRoutes(limit: number): Promise<{ routes: Route[]; restantes: number }> {
  const toutes = allRoutes();
  const vues = new Map<string, string>();
  try {
    const db = await admin();
    const { data } = await db
      .from("price_observations")
      .select("origin,destination,observed_on")
      .order("observed_on", { ascending: false })
      .limit(5000);
    for (const row of data ?? []) {
      const cle = `${row.origin}-${row.destination}`;
      if (!vues.has(cle)) vues.set(cle, String(row.observed_on));
    }
  } catch (error) {
    // Base illisible : on traite quand même, dans l'ordre naturel.
    console.error("Ordre de fraîcheur indisponible", error);
  }

  const triees = [...toutes].sort((a, b) => {
    const va = vues.get(`${a.origin}-${a.destination}`) ?? "";
    const vb = vues.get(`${b.origin}-${b.destination}`) ?? "";
    return va.localeCompare(vb);
  });
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const restantes = triees.filter(
    (r) => (vues.get(`${r.origin}-${r.destination}`) ?? "") < aujourdhui,
  ).length;
  return { routes: triees.slice(0, limit), restantes };
}

/* -------------------------------------------------------------------------- */
/* Écriture                                                                    */
/* -------------------------------------------------------------------------- */

async function record(route: Route, month: string, priceEur: number): Promise<void> {
  const db = await admin();
  const departureMonth = `${month}-01`;
  const maintenant = new Date().toISOString();

  // 1) Suite en ajout seul : c'est elle qui rendra l'évolution lisible plus
  //    tard. Un second passage le même jour corrige la valeur du jour.
  const { error: erreurObservation } = await db.from("price_observations").upsert(
    {
      origin: route.origin,
      destination: route.destination,
      departure_month: departureMonth,
      lowest_price: priceEur,
      currency: "eur",
      observed_at: maintenant,
    },
    { onConflict: "origin,destination,departure_month,observed_on" },
  );
  if (erreurObservation) throw erreurObservation;

  // 2) price_history garde son sens : le plus bas JAMAIS vu sur ce mois de
  //    départ. On ne le redate que lorsqu'il change réellement — sinon
  //    `observed_at` prétendrait dater un relevé qui n'a rien produit.
  const { data: existante } = await db
    .from("price_history")
    .select("id,lowest_price")
    .eq("origin", route.origin)
    .eq("destination", route.destination)
    .eq("month", departureMonth)
    .maybeSingle();

  if (!existante) {
    const { error } = await db.from("price_history").insert({
      origin: route.origin,
      destination: route.destination,
      month: departureMonth,
      lowest_price: priceEur,
      currency: "eur",
      updated_at: maintenant,
      observed_at: maintenant,
    });
    if (error) throw error;
    return;
  }

  if (priceEur < Number(existante.lowest_price)) {
    const { error } = await db
      .from("price_history")
      .update({ lowest_price: priceEur, updated_at: maintenant, observed_at: maintenant })
      .eq("id", existante.id);
    if (error) throw error;
  }
}

/* -------------------------------------------------------------------------- */
/* Passage                                                                     */
/* -------------------------------------------------------------------------- */

export type IngestReport = {
  routesTraitees: number;
  routesRestantes: number;
  appels: number;
  moisEcrits: number;
  echecs: number;
  dureeMs: number;
};

/**
 * Un passage : les `routes` les plus anciennement relevées, douze mois chacune.
 * Par défaut huit routes, soit environ 96 appels et une vingtaine de secondes —
 * de quoi couvrir les 128 routes du site en seize invocations.
 */
export async function ingestSeasonality(params?: {
  routes?: number;
  months?: number;
}): Promise<IngestReport> {
  const debut = Date.now();
  const token = process.env["TRAVELPAYOUTS_TOKEN"];
  if (!token) {
    throw new Error("TRAVELPAYOUTS_TOKEN absent : aucun relevé possible.");
  }

  const { routes, restantes } = await stalestRoutes(params?.routes ?? ROUTES_PAR_PASSAGE);
  const mois = prochainsMois(params?.months ?? MOIS_COUVERTS);

  let appels = 0;
  let moisEcrits = 0;
  let echecs = 0;

  for (const route of routes) {
    // Les mois d'une même route en parallèle mesuré, les routes en série :
    // le débit reste modeste et un échec ne concerne qu'une route.
    let curseur = 0;
    const files = Array.from({ length: PARALLELISME }, async () => {
      for (;;) {
        const month = mois[curseur++];
        if (!month) return;
        const prix = await lowestForMonth(route, month, token);
        appels += 1;
        if (prix === null) continue;
        try {
          await record(route, month, prix);
          moisEcrits += 1;
        } catch (error) {
          echecs += 1;
          console.error(
            `Relevé non enregistré ${route.origin}-${route.destination} ${month}`,
            error,
          );
        }
      }
    });
    await Promise.all(files);
  }

  return {
    routesTraitees: routes.length,
    routesRestantes: Math.max(0, restantes - routes.length),
    appels,
    moisEcrits,
    echecs,
    dureeMs: Date.now() - debut,
  };
}
