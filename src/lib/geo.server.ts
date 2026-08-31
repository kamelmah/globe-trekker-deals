/**
 * Référentiel mondial des villes (coordonnées + noms) fourni par Travelpayouts.
 * Sert uniquement à localiser sur la carte les codes IATA renvoyés par l'API
 * de prix : aucun prix n'est inventé ici.
 */

type CityRecord = { code: string; city: string; country: string; lat: number; lng: number };

type RawCity = {
  code?: string;
  name?: string;
  country_code?: string;
  coordinates?: { lat?: number | null; lon?: number | null } | null;
};

type RawCountry = { code?: string; name?: string };

const DATA_BASE = "https://api.travelpayouts.com/data/fr";

let citiesPromise: Promise<Map<string, CityRecord>> | null = null;

async function loadJson<T>(url: string): Promise<T> {
  // Sans timeout, une requête qui traîne peut bloquer le rendu SSR de toute
  // page destination jusqu'à ce que la plateforme d'hébergement la tue elle-même.
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    signal: AbortSignal.timeout(8000),
  });
  if (!res.ok) throw new Error(`Référentiel indisponible (${res.status}) : ${url}`);
  return (await res.json()) as T;
}

async function buildCityIndex(): Promise<Map<string, CityRecord>> {
  const [cities, countries] = await Promise.all([
    loadJson<RawCity[]>(`${DATA_BASE}/cities.json`),
    loadJson<RawCountry[]>(`${DATA_BASE}/countries.json`).catch(() => [] as RawCountry[]),
  ]);

  const countryNames = new Map<string, string>();
  for (const country of countries) {
    if (country.code && country.name) countryNames.set(country.code.toUpperCase(), country.name);
  }

  const index = new Map<string, CityRecord>();
  for (const city of cities) {
    const code = city.code?.toUpperCase();
    const lat = city.coordinates?.lat;
    const lng = city.coordinates?.lon;
    if (!code || typeof lat !== "number" || typeof lng !== "number") continue;
    const countryCode = (city.country_code ?? "").toUpperCase();
    index.set(code, {
      code,
      city: city.name ?? code,
      country: countryNames.get(countryCode) ?? countryCode,
      lat,
      lng,
    });
  }
  return index;
}

/** Index mémorisé pour la durée de vie de l'instance serveur. */
export function getCityIndex(): Promise<Map<string, CityRecord>> {
  if (!citiesPromise) {
    citiesPromise = buildCityIndex().catch((error) => {
      citiesPromise = null;
      throw error;
    });
  }
  return citiesPromise;
}

export type { CityRecord };
