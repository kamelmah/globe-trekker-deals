/**
 * Autocomplétion mondiale villes/aéroports via l'API Travelpayouts.
 * Appel exclusivement côté serveur (pas de CORS côté navigateur) + cache mémoire
 * pour les termes fréquents ("paris", "lond"…).
 */

export type Place = {
  /** Code IATA envoyé à l'API de recherche de vols. */
  code: string;
  /** Nom complet (aéroport précis ou ville). */
  name: string;
  city: string;
  country: string;
  type: "city" | "airport";
};

const ENDPOINT = "https://autocomplete.travelpayouts.com/places2";
const CACHE_TTL_MS = 6 * 60 * 60 * 1000;
const CACHE_MAX = 500;

type CacheEntry = { at: number; places: Place[] };
const cache = new Map<string, CacheEntry>();

function readCache(key: string): Place[] | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  // remise en tête (LRU approximatif)
  cache.delete(key);
  cache.set(key, hit);
  return hit.places;
}

function writeCache(key: string, places: Place[]): void {
  cache.set(key, { at: Date.now(), places });
  while (cache.size > CACHE_MAX) {
    const oldest = cache.keys().next().value;
    if (oldest === undefined) break;
    cache.delete(oldest);
  }
}

type RawPlace = {
  type?: string;
  code?: string;
  name?: string;
  country_name?: string;
  city_name?: string;
};

function normalize(raw: RawPlace[]): Place[] {
  const seen = new Set<string>();
  const out: Place[] = [];
  for (const item of raw) {
    const code = typeof item.code === "string" ? item.code.toUpperCase() : "";
    if (code.length !== 3 || seen.has(code)) continue;
    const type = item.type === "airport" ? "airport" : "city";
    const name = (item.name ?? "").trim();
    if (!name) continue;
    seen.add(code);
    out.push({
      code,
      name,
      city: (item.city_name ?? (type === "city" ? name : "")).trim(),
      country: (item.country_name ?? "").trim(),
      type,
    });
  }
  return out;
}

export class PlacesError extends Error {}

/** Recherche des villes et aéroports du monde entier pour un terme saisi. */
export async function fetchPlaces(term: string): Promise<Place[]> {
  const key = term.trim().toLowerCase();
  if (key.length < 2) return [];

  const cached = readCache(key);
  if (cached) return cached;

  const url = `${ENDPOINT}?term=${encodeURIComponent(key)}&locale=fr&types[]=city&types[]=airport`;
  let response: Response;
  try {
    response = await fetch(url, { headers: { Accept: "application/json" } });
  } catch (error) {
    console.error("Autocomplete Travelpayouts injoignable", error);
    throw new PlacesError("Impossible de contacter le service de villes. Réessayez dans un instant.");
  }
  if (!response.ok) {
    throw new PlacesError("Le service de villes est momentanément indisponible.");
  }

  const body = (await response.json()) as unknown;
  if (!Array.isArray(body)) return [];
  const places = normalize(body as RawPlace[]).slice(0, 12);
  writeCache(key, places);
  return places;
}

/**
 * Résout un texte libre (« Marrakech », « rak ») en un lieu unique.
 * Retourne null si aucune correspondance crédible n'est trouvée.
 */
export async function resolveBestPlace(term: string): Promise<Place | null> {
  const cleaned = term.trim();
  if (cleaned.length < 2) return null;
  const places = await fetchPlaces(cleaned);
  if (places.length === 0) return null;

  const upper = cleaned.toUpperCase();
  const lower = cleaned.toLowerCase();
  const byCode = places.find((p) => p.code === upper);
  if (byCode) return byCode;

  const exactName = places.find(
    (p) => p.name.toLowerCase() === lower || p.city.toLowerCase() === lower,
  );
  if (exactName) return exactName;

  const startsWith = places.find(
    (p) => p.name.toLowerCase().startsWith(lower) || p.city.toLowerCase().startsWith(lower),
  );
  if (startsWith) return startsWith;

  // La liste renvoyée par l'API est déjà classée par pertinence : on garde une ville si possible.
  return places.find((p) => p.type === "city") ?? places[0] ?? null;
}
