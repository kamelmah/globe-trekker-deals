import { useCurrency } from "@/lib/currency-context";
import type { CalendarDayPrice } from "@/lib/flights.types";
import { cn } from "@/lib/utils";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function level(price: number, min: number, max: number): "low" | "mid" | "high" {
  if (max === min) return "mid";
  const ratio = (price - min) / (max - min);
  if (ratio <= 0.33) return "low";
  if (ratio <= 0.66) return "mid";
  return "high";
}

export function PriceCalendar({
  days,
  month,
  onSelect,
  selected,
}: {
  days: CalendarDayPrice[];
  month: string;
  onSelect?: (date: string) => void;
  selected?: string;
}) {
  const { format } = useCurrency();
  if (days.length === 0) {
    return <p className="text-sm text-muted-foreground">Aucun prix disponible pour ce mois.</p>;
  }

  const prices = days.map((d) => d.priceEur);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const firstDay = new Date(`${month}-01T00:00:00Z`).getUTCDay();
  const leading = (firstDay + 6) % 7;

  return (
    <div>
      <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs font-medium text-muted-foreground">
        {WEEKDAYS.map((d, i) => (
          <span key={`${d}-${i}`}>{d}</span>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: leading }).map((_, i) => (
          <span key={`empty-${i}`} aria-hidden />
        ))}
        {days.map((day) => {
          const l = level(day.priceEur, min, max);
          const isSelected = selected === day.date;
          return (
            <button
              key={day.date}
              type="button"
              onClick={() => onSelect?.(day.date)}
              aria-label={`${day.date} : ${format(day.priceEur)}`}
              className={cn(
                "flex min-h-16 flex-col items-center justify-center rounded-lg border p-1 text-center transition-colors",
                l === "low" && "border-success/40 bg-success/10 hover:bg-success/20",
                l === "mid" && "border-warning/40 bg-warning/10 hover:bg-warning/20",
                l === "high" && "border-destructive/30 bg-destructive/10 hover:bg-destructive/20",
                isSelected && "ring-2 ring-ring",
              )}
            >
              <span className="text-xs text-muted-foreground">{Number(day.date.slice(8))}</span>
              <span className="text-xs font-semibold">{format(day.priceEur)}</span>
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-success/40" aria-hidden /> Prix bas
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-warning/40" aria-hidden /> Prix moyen
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="size-3 rounded bg-destructive/30" aria-hidden /> Prix élevé
        </span>
      </div>
    </div>
  );
}
