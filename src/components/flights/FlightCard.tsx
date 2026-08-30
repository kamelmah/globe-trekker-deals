import { Luggage, Leaf, Plane, Store } from "lucide-react";

import { co2Label } from "@/lib/co2";
import { useCurrency } from "@/lib/currency-context";
import type { FlightOffer } from "@/lib/flights.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDuration(minutes: number): string {
  if (!minutes) return "Durée non communiquée";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

function formatTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function stopsLabel(stops: number): string {
  if (stops === 0) return "Vol direct";
  return stops === 1 ? "1 escale" : `${stops} escales`;
}

export function FlightCard({
  offer,
  greenest = false,
}: {
  offer: FlightOffer;
  greenest?: boolean;
}) {
  const { format } = useCurrency();

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Plane className="size-4 text-primary" aria-hidden />
              {offer.airline}
            </span>
            <Badge variant="secondary">{stopsLabel(offer.stops)}</Badge>
            <Badge variant="outline">{formatDuration(offer.durationMinutes)}</Badge>
            {greenest && (
              <Badge className="bg-success text-success-foreground">
                <Leaf className="mr-1 size-3" aria-hidden />
                Vol plus écologique
              </Badge>
            )}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Départ {formatTime(offer.departureAt)}
            {offer.returnAt ? ` · retour ${formatTime(offer.returnAt)}` : " · aller simple"} · vol{" "}
            {offer.flightNumber}
          </p>

          <p className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-sm font-medium">
            <Store className="size-4 text-primary" aria-hidden />
            Vendu par {offer.seller}
          </p>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <li className="inline-flex items-center gap-1">
              <Luggage className="size-3.5" aria-hidden />
              Bagage cabine {offer.cabinBag ? "inclus" : "en option"}
            </li>
            <li>
              Bagage en soute {offer.checkedBag ? "inclus" : "en option payante"}
            </li>
            <li>Empreinte estimée : {co2Label(offer.co2Kg)}</li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-2 sm:items-end">
          <p className="font-display text-2xl font-semibold">{format(offer.priceEur)}</p>
          <p className="text-xs text-muted-foreground">Prix total, taxes incluses</p>
          <Button asChild>
            <a href={offer.bookingUrl} target="_blank" rel="noopener noreferrer nofollow sponsored">
              Réserver chez {offer.seller}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
