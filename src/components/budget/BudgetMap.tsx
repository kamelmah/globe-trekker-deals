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
    };
  }, [originLat, originLng]);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;
    layer.clearLayers();

    for (const price of prices) {
      const affordable = price.priceEur <= budget;
      const isSelected = selected === price.destination;
      const marker = L.circleMarker([price.lat, price.lng], {
        radius: isSelected ? 9 : 7,
        weight: 2,
        color: affordable ? "#1d6fd0" : "#94a3b8",
        fillColor: affordable ? "#2f8ae0" : "#cbd5e1",
        fillOpacity: affordable ? 0.9 : 0.4,
      });
      marker.bindTooltip(
        `${price.city} (${price.country}) — ${formatPrice(price.priceEur, currency)}${
          affordable ? "" : " · au-dessus du budget"
        }`,
        { direction: "top", opacity: 1 },
      );
      if (isSelected) marker.bindTooltip(marker.getTooltip()!.getContent() as string, { permanent: true, direction: "top" });
      marker.on("click", () => onSelect(price.destination));
      marker.addTo(layer);
    }
  }, [prices, budget, currency, onSelect, selected]);

  return <div ref={containerRef} className="h-full w-full" aria-label="Carte des destinations" />;
}
