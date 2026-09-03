import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef } from "react";

import { formatAmount, type CurrencyCode } from "@/lib/currency";
import { formatDateLong } from "@/lib/dates";
import type { DestinationPrice } from "@/lib/flights.types";

export type BudgetMapProps = {
  prices: DestinationPrice[];
  budget: number;
  currency: CurrencyCode;
  originLat: number;
  originLng: number;
  onSelect: (code: string) => void;
  /** Lien vers la page de résultats pour ce trajet précis. */
  hrefFor: (price: DestinationPrice) => string;
  selected?: string;
};

/** Motif du pointillé des routes, en unités SVG. La période vaut 1 + 8 = 9. */
const DASH_PATTERN = "1 8";
/** Multiple de la période : le décalage boucle sans saut visible. */
const DASH_CYCLE = 900;
/** Vitesse du défilement, en unités SVG par image. */
const DASH_STEP = 0.4;

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );
}

/**
 * Approxime un grand cercle par une courbe de Bézier quadratique : le point
 * de contrôle est décalé perpendiculairement au milieu du segment. Suffisant
 * visuellement à l'échelle d'une carte de destinations — inutile d'ajouter
 * une dépendance (turf/great-circle) pour ça.
 */
function arcLatLngs(
  from: [number, number],
  to: [number, number],
  segments = 64,
): [number, number][] {
  const [lat1, lng1] = from;
  const [lat2, lng2Raw] = to;

  // Passer par la copie du monde la plus proche : sans ça, une destination à
  // l'est de l'antiméridien (Auckland depuis Marseille) traverse toute la
  // carte au lieu de prendre le chemin court. Leaflet accepte les longitudes
  // hors [-180, 180] et les projette dans la copie voisine.
  let lng2 = lng2Raw;
  if (lng2 - lng1 > 180) lng2 -= 360;
  else if (lng2 - lng1 < -180) lng2 += 360;

  const midLat = (lat1 + lat2) / 2;
  const midLng = (lng1 + lng2) / 2;

  const dLat = lat2 - lat1;
  const dLng = lng2 - lng1;
  const distance = Math.sqrt(dLat * dLat + dLng * dLng);

  // Décalage perpendiculaire, borné pour rester lisible sur les longues routes.
  const bow = Math.min(distance * 0.15, 6);
  const perpLat = -dLng;
  const perpLng = dLat;
  const norm = Math.sqrt(perpLat * perpLat + perpLng * perpLng) || 1;
  const controlLat = midLat + (perpLat / norm) * bow;
  const controlLng = midLng + (perpLng / norm) * bow;

  const points: [number, number][] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const lat = (1 - t) * (1 - t) * lat1 + 2 * (1 - t) * t * controlLat + t * t * lat2;
    const lng = (1 - t) * (1 - t) * lng1 + 2 * (1 - t) * t * controlLng + t * t * lng2;
    points.push([lat, lng]);
  }
  return points;
}

export default function BudgetMap({
  prices,
  budget,
  currency,
  originLat,
  originLng,
  onSelect,
  hrefFor,
  selected,
}: BudgetMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);
  const routesLayerRef = useRef<L.LayerGroup | null>(null);
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [originLat, originLng],
      zoom: 3,
      worldCopyJump: true,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap",
      maxZoom: 18,
    }).addTo(map);
    // Sous les marqueurs : les routes animées Marseille → chaque destination.
    routesLayerRef.current = L.layerGroup().addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    const markers = markersRef.current;
    return () => {
      if (animationRef.current !== null) cancelAnimationFrame(animationRef.current);
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      routesLayerRef.current = null;
      markers.clear();
    };
  }, [originLat, originLng]);

  useEffect(() => {
    const layer = layerRef.current;
    const routesLayer = routesLayerRef.current;
    if (!layer || !routesLayer) return;
    layer.clearLayers();
    routesLayer.clearLayers();
    markersRef.current.clear();

    // Repère d'origine (Marseille) : décor, pas une cible de clic.
    L.circleMarker([originLat, originLng], {
      radius: 5,
      weight: 2,
      color: "#f97316",
      fillColor: "#f97316",
      fillOpacity: 1,
      interactive: false,
    }).addTo(routesLayer);

    // Les <path> SVG sont relevés une fois : la boucle d'animation n'a plus
    // qu'à écrire un décalage, sans retraverser les objets Leaflet.
    const dashedPaths: SVGPathElement[] = [];

    for (const price of prices) {
      const affordable = price.priceEur <= budget;
      const isSelected = selected === price.destination;
      const priceLabel = formatAmount(price.priceEur, currency);

      const route = L.polyline(arcLatLngs([originLat, originLng], [price.lat, price.lng]), {
        color: affordable ? "#1d6fd0" : "#cbd5e1",
        weight: isSelected ? 2.5 : 1.5,
        opacity: affordable ? 0.7 : 0.35,
        dashArray: DASH_PATTERN,
        interactive: false,
      }).addTo(routesLayer);

      // `_path` est l'élément <path> sous-jacent du rendu SVG de Leaflet (le
      // rendu par défaut, la carte n'active pas `preferCanvas`).
      const path = (route as unknown as { _path?: SVGPathElement })._path;
      if (path) dashedPaths.push(path);

      const marker = L.circleMarker([price.lat, price.lng], {
        radius: isSelected ? 9 : 7,
        weight: 2,
        color: affordable ? "#1d6fd0" : "#94a3b8",
        fillColor: affordable ? "#2f8ae0" : "#cbd5e1",
        fillOpacity: affordable ? 0.9 : 0.4,
      });

      marker.bindTooltip(
        `${escapeHtml(price.city)} (${escapeHtml(price.country)}) — ${priceLabel}${
          affordable ? "" : " · au-dessus du budget"
        }`,
        { direction: "top", opacity: 1 },
      );

      marker.bindPopup(
        `<div class="min-w-[190px] space-y-1">
           <p class="text-sm font-semibold">${escapeHtml(price.city)}</p>
           <p class="text-xs text-muted-foreground">${escapeHtml(price.country)} · ${escapeHtml(
             price.airline,
           )}</p>
           <p class="text-lg font-semibold text-primary">${priceLabel}</p>
           <p class="text-xs text-muted-foreground">Départ le ${escapeHtml(
             // Les bulles Leaflet sont construites en HTML brut : le helper de
             // formatage n'y avait jamais été appliqué, d'où la date machine.
             formatDateLong(price.departureAt.slice(0, 10)),
           )}${affordable ? "" : " · au-dessus du budget"}</p>
            <a href="${escapeHtml(hrefFor(price))}"
               class="mt-1 inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium hover:opacity-90"
               style="color: var(--primary-foreground);"
               data-destination="${escapeHtml(price.destination)}">Voir les vols</a>
         </div>`,
        { closeButton: true, autoPan: true },
      );

      marker.on("click", () => {
        onSelect(price.destination);
        marker.openPopup();
      });
      marker.addTo(layer);
      markersRef.current.set(price.destination, marker);
    }

    // "Marching ants" : fait glisser le pointillé des routes pour évoquer un
    // survol, sans dépendance d'animation externe. Le pointillé reste figé si
    // l'utilisateur a demandé moins d'animations.
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion || dashedPaths.length === 0) return;

    let dashOffset = 0;
    const animate = () => {
      dashOffset = (dashOffset - DASH_STEP + DASH_CYCLE) % DASH_CYCLE;
      for (const path of dashedPaths) path.style.strokeDashoffset = String(dashOffset);
      animationRef.current = requestAnimationFrame(animate);
    };
    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current !== null) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
    };
  }, [prices, budget, currency, onSelect, selected, hrefFor, originLat, originLng]);

  /** Sélection venue du panneau latéral : on centre et on ouvre la même popup. */
  useEffect(() => {
    if (!selected) return;
    const marker = markersRef.current.get(selected);
    const map = mapRef.current;
    if (!marker || !map) return;
    map.panTo(marker.getLatLng(), { animate: true });
    marker.openPopup();
  }, [selected, prices]);

  return <div ref={containerRef} className="h-full w-full" aria-label="Carte des destinations" />;
}
