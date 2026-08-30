import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { useEffect, useRef } from "react";

import { formatPrice, type CurrencyCode } from "@/lib/currency";
import type { DestinationPrice } from "@/lib/flights.types";

export type BudgetMapProps = {
  prices: DestinationPrice[];
  budget: number;
  currency: CurrencyCode;
  originLat: number;
  originLng: number;
  onSelect: (code: string) => void;
  selected?: string;
};

export default function BudgetMap({
  prices,
  budget,
  currency,
  originLat,
  originLng,
  onSelect,
  selected,
}: BudgetMapProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<L.Map | null>(null);
  const layerRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;
    const map = L.map(containerRef.current, {
      center: [originLat, originLng],
      zoom: 3,
      worldCopyJump: true,
      scrollWheelZoom: true,
    });
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      attribution: "&copy; OpenStreetMap, &copy; CARTO",
      maxZoom: 18,
    }).addTo(map);
    layerRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      layerRef.current = null;
    };
  }, [originLat, originLng]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    for (const price of prices) {
      const affordable = price.priceEur <= budget;
      const isSelected = selected === price.destination;
      const marker = L.marker([price.lat, price.lng], {
        opacity: affordable ? 1 : 0.45,
        icon: L.divIcon({
          className: "",
          html: `<div class="rounded-full border px-2 py-1 text-xs font-semibold shadow-sm ${
            affordable
              ? "border-primary/40 bg-white text-primary"
              : "border-slate-300 bg-white/70 text-slate-400"
          } ${isSelected ? "ring-2 ring-sky-500" : ""}">${price.city} · ${formatPrice(
            price.priceEur,
            currency,
          )}</div>`,
          iconSize: [0, 0],
          iconAnchor: [0, 0],
        }),
      });
      marker.on("click", () => onSelect(price.destination));
      marker.bindTooltip(
        `${price.city} (${price.country}) — ${formatPrice(price.priceEur, currency)}${
          affordable ? "" : " · au-dessus du budget"
        }`,
      );
      marker.addTo(layer);
    }
  }, [prices, budget, currency, onSelect, selected]);

  return <div ref={containerRef} className="h-full w-full" aria-label="Carte des destinations" />;
}
