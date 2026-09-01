import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/currency-context";
import { calendarPrices } from "@/lib/flights.functions";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function monthOf(date: string): string {
  return /^\d{4}-\d{2}/.test(date) ? date.slice(0, 7) : new Date().toISOString().slice(0, 7);
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  return new Date(Date.UTC(y!, (m ?? 1) - 1 + delta, 1)).toISOString().slice(0, 7);
}

function daysInMonth(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const total = new Date(Date.UTC(y!, m!, 0)).getUTCDate();
  return Array.from({ length: total }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
}

function monthLabel(month: string): string {
  return new Date(`${month}-01T00:00:00Z`).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function level(price: number, min: number, max: number): "low" | "mid" | "high" {
  if (max === min) return "mid";
  const ratio = (price - min) / (max - min);
  if (ratio <= 0.33) return "low";
  if (ratio <= 0.66) return "mid";
  return "high";
}

/** Vue calendrier des prix affichée uniquement quand l'utilisateur la demande. */
export function ResultsPriceCalendar({
  origin,
  destination,
  departureAt,
  tripDuration,
  passengers,
  onSelectDate,
}: {
  origin: string;
  destination: string;
  departureAt: string;
  tripDuration: number;
  passengers: { adults: number; children: number; infants: number };
  onSelectDate: (date: string) => void;
}) {
  const [month, setMonth] = useState(() => monthOf(departureAt));
  const { formatApi: format, currency } = useCurrency();
  const runCalendar = useServerFn(calendarPrices);

  const pricesQuery = useQuery({
    queryKey: [
      "results-calendar",
      origin,
      destination,
      month,
      tripDuration,
      passengers.adults,
      passengers.children,
      passengers.infants,
      currency,
    ],
    queryFn: () =>
      runCalendar({
        data: {
          origin,
          destination,
          month,
          tripDuration,
          currency,
          mode: "departure",
          adults: passengers.adults,
          children: passengers.children,
          infants: passengers.infants,
        },
      }),
  });

  const priceByDate = new Map<string, number>();
  for (const day of pricesQuery.data?.days ?? []) priceByDate.set(day.date, day.priceEur);
  const prices = [...priceByDate.values()];
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  const days = daysInMonth(month);
  const firstWeekday = (new Date(`${month}-01T00:00:00Z`).getUTCDay() + 6) % 7;
  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Mois précédent"
          onClick={() => setMonth((m) => shiftMonth(m, -1))}
        >
          <ChevronLeft className="size-4" aria-hidden />
        </Button>
        <span className="text-sm font-medium capitalize">{monthLabel(month)}</span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          aria-label="Mois suivant"
          onClick={() => setMonth((m) => shiftMonth(m, 1))}
        >
          <ChevronRight className="size-4" aria-hidden />
        </Button>
      </div>

      <p className="mt-1 text-xs text-muted-foreground">
        {tripDuration > 0
          ? `Prix aller-retour le plus bas par jour de départ (séjour de ${tripDuration} nuits).`
          : "Prix aller simple le plus bas par jour de départ."}
      </p>

      <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>

      {pricesQuery.isPending ? (
        <Skeleton className="mt-2 h-56 w-full" />
      ) : (
        <div className="mt-1 grid grid-cols-7 gap-1">
          {Array.from({ length: firstWeekday }).map((_, i) => (
            <span key={`empty-${i}`} aria-hidden />
          ))}
          {days.map((date) => {
            const price = priceByDate.get(date);
            const disabled = date < today;
            const l = price === undefined ? null : level(price, min, max);
            return (
              <button
                key={date}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(date)}
                aria-label={price === undefined ? date : `${date} : ${format(price)}`}
                className={cn(
                  "flex min-h-12 flex-col items-center justify-center rounded-md border p-0.5 text-center transition-colors",
                  l === null && "border-border hover:bg-muted",
                  l === "low" && "border-success/40 bg-success/10 hover:bg-success/20",
                  l === "mid" && "border-warning/40 bg-warning/10 hover:bg-warning/20",
                  l === "high" && "border-destructive/30 bg-destructive/10 hover:bg-destructive/20",
                  departureAt === date && "ring-2 ring-ring",
                  disabled && "cursor-not-allowed opacity-40",
                )}
              >
                <span className="text-[11px] leading-none text-muted-foreground">
                  {Number(date.slice(8))}
                </span>
                {price !== undefined && (
                  <span className="text-[10px] font-semibold leading-tight">{format(price)}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {pricesQuery.data?.error && (
        <p className="mt-2 text-xs text-destructive">
          Impossible de charger les prix pour ce mois, réessayez plus tard.
        </p>
      )}

      {!pricesQuery.isPending &&
        !pricesQuery.data?.error &&
        (pricesQuery.data?.days?.length ?? 0) === 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Aucun prix disponible pour ce mois sur ce trajet. Essayez un autre mois.
          </p>
        )}
    </div>
  );
}
