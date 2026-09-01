/**
 * Pages de liaison générées dynamiquement côté serveur pour n'importe quel
 * couple ville de départ / destination issu du mode budget.
 *
 * Aucun appel à l'API de prix n'est fait ici : seuls les prix DÉJÀ observés
 * (cache du balayage mondial + table price_history) sont relus, pour ne jamais
 * consommer le quota Travelpayouts avec les robots et ne jamais inventer un prix.
 */

import { AIRPORTS } from "@/data/airports";
import { formatDateMedium, formatMonthLong } from "@/lib/dates";
import { DESTINATIONS, type DestinationRoute } from "@/data/destinations";
import { PRUNED_ROUTE_SLUGS, withoutPruned } from "@/data/pruned-pages";
import {
  AIRPORT_NAMES_FR,
  COUNTRY_NAMES_FR,
  findWhitelistedRoute,
  frenchName,
  routesFrom,
} from "@/data/route-whitelist";
import { getCityIndex, type CityRecord } from "@/lib/geo.server";
import { routeSlug, slugify } from "@/lib/slug";

type SlugIndex = Map<string, CityRecord>;

let slugIndexPromise: Promise<SlugIndex> | null = null;

/**
 * Nom d'affichage d'une ville : le nom français d'usage quand nous le
 * connaissons, sinon celui du référentiel. C'est ce dernier qui produisait
 * « Ville de Madrid », « Buda » ou « dème de Thera » dans les URL et les titres.
 */
function displayCity(record: CityRecord): string {
  return frenchName(record.code) ?? record.city;
}

function displayCountry(record: CityRecord): string {
  return COUNTRY_NAMES_FR[record.code.toUpperCase()] ?? record.country;
}

async function buildSlugIndex(): Promise<SlugIndex> {
  const cities = await getCityIndex();
  const index: SlugIndex = new Map();
  // Les noms français d'usage priment sur tout : sans eux, /vols/marseille-palma
  // ne résoudrait pas (le référentiel dit « Palma de Mallorca »).
  for (const [code, french] of Object.entries(AIRPORT_NAMES_FR)) {
    const slug = slugify(french);
    const city = cities.get(code.toUpperCase());
    if (!slug || !city) continue;
    index.set(slug, { ...city, city: french, country: displayCountry(city) });
  }
  // Puis les aéroports curés : ils tranchent les homonymes
  // (Paris, France plutôt que Paris, Texas).
  for (const airport of AIRPORTS) {
    const city = cities.get(airport.code.toUpperCase());
    const slug = slugify(city?.city ?? airport.city);
    if (!slug || index.has(slug)) continue;
    index.set(
      slug,
      city ?? {
        code: airport.code,
        city: airport.city,
        country: airport.country,
        lat: airport.lat,
        lng: airport.lng,
      },
    );
  }
  for (const city of cities.values()) {
    const slug = slugify(city.city);
    if (!slug) continue;
    if (!index.has(slug)) index.set(slug, city);
  }
  // Les codes IATA restent utilisables directement (ex. /vols/par-rak).
  for (const city of cities.values()) {
    const code = city.code.toLowerCase();
    if (!index.has(code)) index.set(code, city);
  }
  return index;
}

function getSlugIndex(): Promise<SlugIndex> {
  if (!slugIndexPromise) {
    slugIndexPromise = buildSlugIndex().catch((error) => {
      slugIndexPromise = null;
      throw error;
    });
  }
  return slugIndexPromise;
}

type CachedEntry = {
  destination: string;
  city: string;
  country: string;
  lat: number;
  lng: number;
  priceEur: number;
  airline?: string;
  departureAt?: string;
};

/**
 * Relit le balayage mondial déjà en cache pour une origine (aucun appel API).
 * Les lignes périmées sont conservées comme fallback SEO ; une revalidation en
 * arrière-plan est déclenchée pour rafraîchir les prix.
 */
async function readWorldCache(origin: string): Promise<CachedEntry[]> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data } = await supabaseAdmin
      .from("price_cache")
      .select("cache_key,payload,expires_at")
      .like("cache_key", `world-destinations:${origin}:%`)
      .order("expires_at", { ascending: false })
      .limit(4);
    const entries: CachedEntry[] = [];
    let allStale = (data?.length ?? 0) > 0;
    let freshestKey: string | null = null;
    for (const row of data ?? []) {
      if (Date.parse(row.expires_at) >= Date.now()) allStale = false;
      freshestKey ??= row.cache_key;
      const prices = (row.payload as { prices?: unknown } | null)?.prices;
      if (!Array.isArray(prices)) continue;
      for (const entry of prices as CachedEntry[]) {
        if (entry?.destination && entry?.city && Number.isFinite(Number(entry.priceEur))) {
          entries.push(entry);
        }
      }
    }
    if (allStale && freshestKey) void revalidateWorldCache(origin, freshestKey);
    return entries;
  } catch (error) {
    console.error("Lecture du cache des destinations impossible", error);
    return [];
  }
}

const revalidating = new Set<string>();

/** Relance le balayage mondial quand le cache 6 h a expiré (sans bloquer la page). */
async function revalidateWorldCache(origin: string, cacheKey: string): Promise<void> {
  if (revalidating.has(cacheKey)) return;
  revalidating.add(cacheKey);
  try {
    const month = cacheKey.split(":")[2];
    const { fetchCheapestDestinations } = await import("@/lib/travelpayouts.server");
    await fetchCheapestDestinations({
      origin,
      world: true,
      forceRefresh: true,
      ...(month && month !== "any" ? { month } : {}),
    });
  } catch (error) {
    console.error("Revalidation des destinations impossible", error);
  } finally {
    revalidating.delete(cacheKey);
  }
}

/** Découpe "paris-new-york" en (origine, destination) en testant chaque césure. */
export async function resolveRouteSlug(slug: string): Promise<{
  origin: CityRecord;
  destination: CityRecord;
  cached: CachedEntry | null;
} | null> {
  const clean = slugify(slug);
  if (!clean.includes("-")) return null;
  let index: SlugIndex;
  try {
    index = await getSlugIndex();
  } catch (error) {
    // Le référentiel de villes vient d'une API externe (pas de nos propres
    // serveurs) : une panne ou une lenteur là-bas ne doit jamais faire planter
    // une page destination, seulement empêcher de résoudre celle-ci.
    console.error("Référentiel de villes indisponible, page destination non résolue", error);
    return null;
  }
  const parts = clean.split("-");
  for (let cut = 1; cut < parts.length; cut += 1) {
    const origin = index.get(parts.slice(0, cut).join("-"));
    if (!origin) continue;
    const destSlug = parts.slice(cut).join("-");

    // Priorité au balayage budget déjà en cache : c'est lui qui donne le bon
    // code IATA (homonymes de villes) et le prix réellement observé. Le cache
    // porte les noms du référentiel, on teste donc aussi le nom français —
    // sinon /vols/marseille-palma raterait l'entrée « Palma de Mallorca ».
    const matchesDestination = (entry: CachedEntry) =>
      slugify(entry.city) === destSlug || slugify(frenchName(entry.destination) ?? "") === destSlug;
    const cached = (await readWorldCache(origin.code))
      .filter((e) => matchesDestination(e) && e.destination !== origin.code)
      .sort((a, b) => Number(a.priceEur) - Number(b.priceEur))[0];
    if (cached) {
      return {
        origin,
        destination: {
          code: cached.destination,
          city: cached.city,
          country: cached.country,
          lat: cached.lat,
          lng: cached.lng,
        },
        cached,
      };
    }

    const destination = index.get(destSlug);
    if (destination && destination.code !== origin.code) {
      return { origin, destination, cached: null };
    }
  }
  return null;
}

type ObservedPrice = {
  priceEur: number;
  airline: string | null;
  departureAt: string | null;
  /**
   * Date à laquelle ce prix a été relevé — à ne pas confondre avec
   * `departureAt`, qui est la date de départ du vol. Nulle quand le prix vient
   * du cache du balayage mondial, qui ne conserve pas cette information : on
   * préfère alors ne pas dater le prix plutôt que d'inventer une date.
   */
  observedAt: string | null;
};

/** Prix le plus bas déjà relevé sur ce trajet (cache mondial, puis historique). */
async function readObservedPrice(
  origin: string,
  destination: string,
  cached: CachedEntry | null,
): Promise<ObservedPrice | null> {
  let best: ObservedPrice | null = cached
    ? {
        priceEur: Math.round(Number(cached.priceEur)),
        airline: cached.airline ?? null,
        departureAt: cached.departureAt ?? null,
        observedAt: null,
      }
    : null;
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: history } = await supabaseAdmin
      .from("price_history")
      .select("lowest_price,updated_at")
      .eq("origin", origin)
      .eq("destination", destination)
      .order("lowest_price", { ascending: true })
      .limit(1);
    const historyLow = history?.[0] ? Math.round(Number(history[0].lowest_price)) : null;
    if (historyLow && historyLow > 0 && (!best || historyLow < best.priceEur)) {
      best = {
        priceEur: historyLow,
        airline: best?.airline ?? null,
        departureAt: null,
        observedAt: history?.[0]?.updated_at ?? null,
      };
    }
  } catch (error) {
    console.error("Lecture de l'historique impossible", error);
  }
  return best;
}

function distanceKm(a: CityRecord, b: CityRecord): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
}

function durationLabel(km: number): string {
  // Estimation transparente : distance orthodromique / 800 km/h + 30 min de manœuvres.
  const hours = km / 800 + 0.5;
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `≈ ${h} h ${String(m).padStart(2, "0")} estimé (${km.toLocaleString("fr-FR")} km)`;
}

/** Date complète en toutes lettres, ex. « 28 août 2026 ». */
function frenchDay(iso: string | null): string | null {
  return iso ? formatDateMedium(iso.slice(0, 10)) || null : null;
}

function frenchMonth(iso: string | null): string | null {
  return iso ? formatMonthLong(iso.slice(0, 7)) || null : null;
}

/**
 * Construit une page de liaison complète (métadonnées, H1 et texte uniques,
 * basés sur le prix réellement observé quand il existe).
 */
export async function buildDynamicRoutePage(slug: string): Promise<DestinationRoute | null> {
  const pair = await resolveRouteSlug(slug);
  if (!pair) return null;
  const { cached } = pair;

  // Tout ce qui suit — H1, titre, texte, slug canonique — part du nom français
  // d'usage. Le référentiel n'est plus qu'une source de coordonnées.
  const origin: CityRecord = {
    ...pair.origin,
    city: displayCity(pair.origin),
    country: displayCountry(pair.origin),
  };
  const destination: CityRecord = {
    ...pair.destination,
    city: displayCity(pair.destination),
    country: displayCountry(pair.destination),
  };

  const observed = await readObservedPrice(origin.code, destination.code, cached);
  const km = distanceKm(origin, destination);
  const priceLabel = observed ? `${observed.priceEur} €` : null;
  const observedMonth = frenchMonth(observed?.departureAt ?? null);

  // Quelques liaisons de la liste blanche n'existent qu'avec escale : la page ne
  // doit pas leur annoncer une durée de vol direct.
  const whitelisted = findWhitelistedRoute(routeSlug(origin.city, destination.city));
  const nonstop = whitelisted?.nonstop ?? true;
  const distanceSentence = nonstop
    ? `La distance entre ${origin.city} et ${destination.city} (${destination.country}) est d'environ ${km.toLocaleString("fr-FR")} km, soit ${durationLabel(km)} pour un vol direct. Les itinéraires avec une ou deux escales sont souvent moins chers mais rallongent sensiblement le trajet : nos filtres vous permettent d'exclure les escales trop longues en un clic.`
    : `Aucune compagnie n'assure ${origin.city} — ${destination.city} sans escale : tous les itinéraires passent par une correspondance. La distance à vol d'oiseau est d'environ ${km.toLocaleString("fr-FR")} km, mais comptez sensiblement plus que les ${durationLabel(km)} théoriques, selon la durée de l'escale. Nos filtres permettent d'écarter les correspondances les plus longues.`;

  // Ni le H1 ni la balise title ne sont portés par les données : tous deux sont
  // calculés au rendu depuis le gabarit unique (`routeHeading`,
  // `routeMetaTitle`), pour les pages générées comme pour les éditoriales.

  const metaDescription = priceLabel
    ? `Prix le plus bas relevé sur ${origin.city} — ${destination.city} (${destination.country}) : ${priceLabel}, taxes incluses, vendeur affiché. Comparez sans frais cachés ni faux compte à rebours.`
    : `Comparez les vols ${origin.city} — ${destination.city} (${destination.country}) : prix total taxes incluses, vendeur réel identifié et lien direct, sans frais cachés.`;

  // Un prix affirmé sans date n'est pas vérifiable : quand nous connaissons la
  // date du relevé, elle accompagne le montant.
  const observedDay = frenchDay(observed?.observedAt ?? null);

  const intro = priceLabel
    ? `Le prix le plus bas que nous avons relevé sur la liaison ${origin.city} — ${destination.city} est de ${priceLabel} taxes incluses${observedMonth ? `, pour un départ en ${observedMonth}` : ""}${observed?.airline ? `, opéré par ${observed.airline}` : ""}${observedDay ? `, relevé le ${observedDay}` : ""}. Ce montant provient de nos relevés de prix réels : il n'est ni arrondi, ni simulé.`
    : `Aucun relevé de prix n'est encore enregistré sur ${origin.city} — ${destination.city}. Lancez une recherche en direct pour obtenir les tarifs réels du jour, taxes incluses et vendeur identifié.`;

  const sections = [
    {
      heading: `Combien coûte un vol ${origin.city} — ${destination.city} ?`,
      paragraphs: [
        priceLabel
          ? `Sur ce trajet, notre plancher observé est de ${priceLabel} taxes comprises. Les prix affichés sur TrouveMonVol sont ceux réellement renvoyés par les vendeurs : vous voyez le montant total dès la liste de résultats, sans supplément découvert au moment du paiement. Chaque offre indique qui vend le billet — la compagnie elle-même ou l'agence précise — et le bouton de réservation ouvre en un clic le lien de réservation de ce vendeur, sans comparateur intermédiaire caché.`
          : `Les tarifs de cette liaison varient fortement selon la saison, le jour de la semaine et l'anticipation. Nous n'affichons aucun prix estimé : tant qu'aucun relevé n'existe sur ${origin.city} — ${destination.city}, seule une recherche en direct vous donnera un montant, toujours taxes incluses et avec le vendeur réel identifié.`,
        distanceSentence,
      ],
    },
    {
      heading: `Quand réserver pour ${destination.city} ?`,
      paragraphs: [
        `Comme sur la plupart des liaisons, les meilleures occasions apparaissent en dehors des vacances scolaires et des week-ends de grands départs. Un départ en milieu de semaine, un mardi ou un mercredi, est en général moins cher qu'un vendredi ou un dimanche. Le calendrier des prix intégré au formulaire de recherche affiche, pour chaque jour du mois, le prix le plus bas réellement trouvé : les jours sans donnée restent volontairement vides plutôt que remplis d'une estimation.`,
        `Si vos dates sont souples, activez l'option « dates flexibles ± 3 jours » : la recherche interroge alors plusieurs journées autour de la date choisie et conserve la meilleure offre. Vous pouvez aussi créer une alerte prix sans créer de compte : nous vous prévenons par e-mail dès que le tarif de ${origin.city} — ${destination.city} baisse.`,
      ],
    },
    {
      heading: `Réserver ${origin.city} — ${destination.city} en toute transparence`,
      paragraphs: [
        `TrouveMonVol ne diffuse aucune publicité tierce, aucun faux compte à rebours et ne met en avant aucune offre payée. Le classement se fait par prix total réel. Chaque résultat affiche l'empreinte carbone estimée du vol ; pour les bagages, nous vous renvoyons vers la page du vendeur plutôt que d'afficher une inclusion que notre source de prix ne garantit pas.`,
        `Notre rémunération vient d'une commission versée par le vendeur lorsque vous réservez, sans surcoût pour vous et sans influence sur l'ordre des résultats. Le trajet ${origin.city} — ${destination.city} est comparé avec exactement les mêmes règles que tous les autres.`,
      ],
    },
  ];

  const faq = [
    {
      question: `Quel est le prix le plus bas relevé sur un vol ${origin.city} — ${destination.city} ?`,
      answer: priceLabel
        ? `Notre plus bas relevé sur ce trajet est de ${priceLabel} taxes incluses${observedMonth ? ` pour un départ en ${observedMonth}` : ""}. Ce prix provient d'un relevé réel et évolue selon les dates : lancez une recherche en direct pour connaître le tarif du jour.`
        : `Aucun relevé n'est encore enregistré sur cette liaison. Lancez une recherche en direct : les prix affichés proviennent uniquement des offres réelles renvoyées par les vendeurs.`,
    },
    {
      question: `Combien de temps dure le vol ${origin.city} — ${destination.city} ?`,
      answer: nonstop
        ? `La distance est d'environ ${km.toLocaleString("fr-FR")} km, ce qui représente ${durationLabel(km)} sur un vol direct. Avec escale, comptez plusieurs heures supplémentaires selon la correspondance.`
        : `Cette liaison n'est pas desservie sans escale. La distance est d'environ ${km.toLocaleString("fr-FR")} km, soit ${durationLabel(km)} de vol pur, auxquelles s'ajoute la correspondance — souvent plusieurs heures selon l'itinéraire retenu.`,
    },
    {
      question: "Chez qui vais-je réserver mon billet ?",
      answer: `Chaque résultat affiche le vendeur réel du billet — la compagnie aérienne ou l'agence nommée — et le bouton de réservation vous envoie directement chez ce vendeur, sans page intermédiaire ni redirection en cascade.`,
    },
  ];

  return {
    slug: routeSlug(origin.city, destination.city),
    origin: origin.code,
    originCity: origin.city,
    destination: destination.code,
    destinationCity: destination.city,
    country: destination.country,
    metaDescription,
    intro,
    sections,
    bestMonths: "Hors vacances scolaires et week-ends de départs",
    averageDuration: durationLabel(km),
    faq,
    ...(observed ? { observedLowestPrice: observed.priceEur } : {}),
    ...(observed?.airline ? { observedAirline: observed.airline } : {}),
    ...(observed?.departureAt ? { observedDepartureAt: observed.departureAt } : {}),
    ...(observed?.observedAt ? { observedPriceAt: observed.observedAt } : {}),
  };
}

// `listWorldRouteSlugs` a été supprimée : elle alimentait le sitemap depuis le
// balayage mondial en cache et produisait à elle seule le millier de pages de
// liaisons inexistantes. Le sitemap part maintenant de la liste blanche.

export type RelatedRoute = {
  slug: string;
  city: string;
  country: string;
  priceEur: number | null;
};

/**
 * Autres destinations proposées depuis la même ville de départ, pour renforcer
 * le maillage interne des pages /vols/<origine>-<destination>.
 *
 * La liste vient de la LISTE BLANCHE, jamais du balayage mondial : un lien
 * interne vers une page en `noindex` gaspille du budget de crawl et signale à
 * Google une page que nous ne voulons pas voir évaluée. Les prix, eux, restent
 * ceux déjà relevés en cache — aucun appel API, aucun prix inventé.
 *
 * Les départs absents de la liste blanche (Paris, Lyon) retombent sur les pages
 * éditoriales de la même origine : elles sont indexables, et sans ce repli ces
 * pages perdraient tout maillage sortant.
 */
export async function listRelatedRoutes(params: {
  origin: string;
  originCity: string;
  exclude?: string | undefined;
  limit?: number | undefined;
}): Promise<RelatedRoute[]> {
  const limit = params.limit ?? 12;
  const origin = params.origin.toUpperCase();
  const exclude = params.exclude?.toUpperCase();

  const whitelisted = routesFrom(origin)
    .filter((route) => route.destination !== exclude)
    .map((route) => ({
      destination: route.destination,
      slug: route.slug,
      city: route.destinationCity,
      country: route.country,
    }));
  const siblings =
    whitelisted.length > 0
      ? whitelisted
      : withoutPruned(DESTINATIONS, PRUNED_ROUTE_SLUGS)
          .filter((route) => route.origin.toUpperCase() === origin && route.destination !== exclude)
          .map((route) => ({
            destination: route.destination,
            slug: route.slug,
            city: route.destinationCity,
            country: route.country,
          }));
  if (siblings.length === 0) return [];

  // Plancher déjà observé par destination, s'il existe.
  const observed = new Map<string, number>();
  for (const entry of await readWorldCache(origin)) {
    const price = Math.round(Number(entry.priceEur));
    if (!Number.isFinite(price)) continue;
    const current = observed.get(entry.destination);
    if (current === undefined || price < current) observed.set(entry.destination, price);
  }

  return siblings
    .map((route) => ({
      slug: route.slug,
      city: route.city,
      country: route.country,
      priceEur: observed.get(route.destination) ?? null,
    }))
    .sort((a, b) => (a.priceEur ?? Infinity) - (b.priceEur ?? Infinity))
    .slice(0, limit);
}
