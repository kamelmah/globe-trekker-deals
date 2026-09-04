/**
 * Coordonnées des villes desservies, pour mesurer une distance sans appeler le
 * référentiel géographique distant.
 *
 * Sert au maillage interne : sur une page /vols/<origine>-<destination>, les
 * « autres destinations » proposées sont celles proches de la destination
 * affichée. C'est le seul signal propre à CHAQUE page — sans lui, les sept
 * pages algériennes au départ de Marseille tirent la même liste du même vivier,
 * trié de la même façon, et se recopient à sept ou huit liens sur huit.
 *
 * `AIRPORTS` en porte déjà une bonne partie ; ce module la complète pour les
 * villes de la liste blanche qui n'y figurent pas, et expose un accès par code
 * IATA. Les coordonnées sont celles du centre-ville ou de l'aéroport : seul
 * l'ordre relatif des distances compte ici, pas la précision au kilomètre.
 */

import { AIRPORTS } from "@/data/airports";

export type Coordinates = { lat: number; lng: number };

/** Villes de la liste blanche absentes d'`AIRPORTS`. */
const EXTRA_COORDINATES: Record<string, Coordinates> = {
  AJA: { lat: 41.93, lng: 8.74 },
  ALC: { lat: 38.35, lng: -0.48 },
  AYT: { lat: 36.9, lng: 30.79 },
  BES: { lat: 48.39, lng: -4.49 },
  BIA: { lat: 42.7, lng: 9.45 },
  BUH: { lat: 44.43, lng: 26.1 },
  CFU: { lat: 39.62, lng: 19.92 },
  CLY: { lat: 42.57, lng: 8.76 },
  CTA: { lat: 37.5, lng: 15.09 },
  DBV: { lat: 42.65, lng: 18.09 },
  FAO: { lat: 37.02, lng: -7.93 },
  FRA: { lat: 50.11, lng: 8.68 },
  FSC: { lat: 41.5, lng: 9.1 },
  HRG: { lat: 27.18, lng: 33.8 },
  IBZ: { lat: 38.91, lng: 1.43 },
  JED: { lat: 21.49, lng: 39.19 },
  KRK: { lat: 50.06, lng: 19.94 },
  LIL: { lat: 50.63, lng: 3.06 },
  MIL: { lat: 45.46, lng: 9.19 },
  MLA: { lat: 35.9, lng: 14.51 },
  MPL: { lat: 43.61, lng: 3.88 },
  MUC: { lat: 48.14, lng: 11.58 },
  NAP: { lat: 40.85, lng: 14.27 },
  OLB: { lat: 40.92, lng: 9.5 },
  PMO: { lat: 38.12, lng: 13.36 },
  SPU: { lat: 43.51, lng: 16.44 },
  SSH: { lat: 27.86, lng: 34.29 },
  SVQ: { lat: 37.39, lng: -5.98 },
  SXB: { lat: 48.58, lng: 7.75 },
  VCE: { lat: 45.44, lng: 12.33 },
  ZRH: { lat: 47.38, lng: 8.54 },
};

const INDEX: Map<string, Coordinates> = (() => {
  const index = new Map<string, Coordinates>();
  for (const airport of AIRPORTS)
    index.set(airport.code.toUpperCase(), { lat: airport.lat, lng: airport.lng });
  for (const [code, point] of Object.entries(EXTRA_COORDINATES))
    index.set(code.toUpperCase(), point);
  return index;
})();

/** Coordonnées d'une ville par code IATA, ou null si nous ne les avons pas. */
export function cityCoordinates(code: string | null | undefined): Coordinates | null {
  if (!code) return null;
  return INDEX.get(code.toUpperCase()) ?? null;
}

/** Distance orthodromique en kilomètres, arrondie. */
export function haversineKm(a: Coordinates, b: Coordinates): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.min(1, Math.sqrt(h))));
}

/** Distance entre deux villes par code IATA, ou null si l'une est inconnue. */
export function distanceBetweenCities(
  a: string | null | undefined,
  b: string | null | undefined,
): number | null {
  const from = cityCoordinates(a);
  const to = cityCoordinates(b);
  if (!from || !to) return null;
  return haversineKm(from, to);
}
