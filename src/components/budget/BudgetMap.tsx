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

function escapeHtml(value: string): string {
  return value.replace(
    /[&<>"']/g,
    (char) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char] ?? char,
  );
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
  const markersRef = useRef<Map<string, L.CircleMarker>>(new Map());

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
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
      markersRef.current.clear();
    };
  }, [originLat, originLng]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();
    markersRef.current.clear();

    for (const price of prices) {
      const affordable = price.priceEur <= budget;
      const isSelected = selected === price.destination;
      const priceLabel = formatAmount(price.priceEur, currency);
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
  }, [prices, budget, currency, onSelect, selected, hrefFor]);

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
