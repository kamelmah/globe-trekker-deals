import { useQuery } from "@tanstack/react-query";
import { formatDateLong, formatMonthLong } from "@/lib/dates";
import { useServerFn } from "@tanstack/react-start";
import { CalendarIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Skeleton } from "@/components/ui/skeleton";
import { useCurrency } from "@/lib/currency-context";
import { calendarPrices } from "@/lib/flights.functions";
import { cn } from "@/lib/utils";
import { currentMonth } from "@/lib/search-params";

const WEEKDAYS = ["L", "M", "M", "J", "V", "S", "D"];

function monthOf(date: string): string {
  return /^\d{4}-\d{2}/.test(date) ? date.slice(0, 7) : currentMonth();
}

function shiftMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(Date.UTC(y!, (m ?? 1) - 1 + delta, 1));
  return d.toISOString().slice(0, 7);
}

function daysInMonth(month: string): string[] {
  const [y, m] = month.split("-").map(Number);
  const total = new Date(Date.UTC(y!, m!, 0)).getUTCDate();
  return Array.from({ length: total }, (_, i) => `${month}-${String(i + 1).padStart(2, "0")}`);
}

const monthLabel = formatMonthLong;

function level(price: number, min: number, max: number): "low" | "mid" | "high" {
  if (max === min) return "mid";
  const ratio = (price - min) / (max - min);
  if (ratio <= 0.33) return "low";
  if (ratio <= 0.66) return "mid";
  return "high";
}

export function PriceDatePicker({
  value,
  onChange,
  origin,
  destination,
  tripDuration,
  minDate,
  mode = "departure",
  departureAt = null,
  id = "depart",
  label = "Date de départ",
  hint,
}: {
  value: string;
  onChange: (date: string) => void;
  origin: string;
  destination: string;
  tripDuration: number;
  minDate: string;
  mode?: "departure" | "return";
  departureAt?: string | null;
  id?: string;
  label?: string;
  /**
   * Remplace la phrase d'explication au-dessus du calendrier. Là où le champ ne
   * sert pas à choisir un vol — la page hébergement — parler de « prix aller
   * simple par jour de départ » n'aurait aucun sens.
   */
  hint?: string;
}) {
  const [open, setOpen] = useState(false);
  const [month, setMonth] = useState(() => monthOf(value || departureAt || ""));
  const { formatApi: format } = useCurrency();
  const { currency } = useCurrency();
  const runCalendar = useServerFn(calendarPrices);

  const canFetch =
    open &&
    Boolean(origin) &&
    Boolean(destination) &&
    (mode === "departure" || Boolean(departureAt));
  const pricesQuery = useQuery({
    queryKey: [
      "date-picker-calendar",
      mode,
      origin,
      destination,
      month,
      tripDuration,
      currency,
      departureAt,
    ],
    queryFn: () =>
      runCalendar({
        data: {
          origin,
          destination,
          month,
          tripDuration: mode === "return" ? 0 : tripDuration,
          currency,
          mode,
          departureAt: mode === "return" ? departureAt : null,
        },
      }),
    enabled: canFetch,
  });

  const priceByDate = new Map<string, number>();
  for (const day of pricesQuery.data?.days ?? []) priceByDate.set(day.date, day.priceEur);
  const prices = [...priceByDate.values()];
  const min = prices.length ? Math.min(...prices) : 0;
  const max = prices.length ? Math.max(...prices) : 0;

  const days = daysInMonth(month);
  const firstWeekday = (new Date(`${month}-01T00:00:00Z`).getUTCDay() + 6) % 7;

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className={cn("w-full justify-start overflow-hidden text-left font-normal")}
          >
            <CalendarIcon className="size-4" aria-hidden />
            {/* Le champ porte une valeur ISO, mais on n'affiche jamais l'ISO. */}
            <span className="truncate">{formatDateLong(value) || "Choisir une date"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="z-50 w-[320px] p-3 pointer-events-auto">
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
            {hint
              ? hint
              : !destination
                ? "Indiquez une destination pour voir les prix par jour."
                : mode === "return"
                  ? departureAt
                    ? `Prix aller-retour le plus bas pour un retour ce jour-là (départ le ${formatDateLong(departureAt)}).`
                    : "Choisissez d'abord une date de départ pour voir les prix de retour."
                  : tripDuration > 0
                    ? `Prix aller-retour le plus bas (séjour de ${tripDuration} nuits).`
                    : "Prix aller simple le plus bas par jour de départ."}
          </p>

          <div className="mt-3 grid grid-cols-7 gap-1 text-center text-[11px] font-medium text-muted-foreground">
            {WEEKDAYS.map((d, i) => (
              <span key={`${d}-${i}`}>{d}</span>
            ))}
          </div>

          {canFetch && pricesQuery.isPending ? (
            <Skeleton className="mt-2 h-56 w-full" />
          ) : (
            <div className="mt-1 grid grid-cols-7 gap-1">
              {Array.from({ length: firstWeekday }).map((_, i) => (
                <span key={`empty-${i}`} aria-hidden />
              ))}
              {days.map((date) => {
                const price = priceByDate.get(date);
                const disabled = date < minDate;
                const l = price === undefined ? null : level(price, min, max);
                return (
                  <button
                    key={date}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      onChange(date);
                      setOpen(false);
                    }}
                    aria-label={
                      price === undefined
                        ? formatDateLong(date)
                        : `${formatDateLong(date)} : ${format(price)}`
                    }
                    className={cn(
                      "flex min-h-11 flex-col items-center justify-center rounded-md border p-0.5 text-center transition-colors",
                      l === null && "border-border hover:bg-muted",
                      l === "low" && "border-success/40 bg-success/10 hover:bg-success/20",
                      l === "mid" && "border-warning/40 bg-warning/10 hover:bg-warning/20",
                      l === "high" &&
                        "border-destructive/30 bg-destructive/10 hover:bg-destructive/20",
                      value === date && "ring-2 ring-ring",
                      disabled && "cursor-not-allowed opacity-40",
                    )}
                  >
                    <span className="text-[11px] leading-none text-muted-foreground">
                      {Number(date.slice(8))}
                    </span>
                    {price !== undefined && (
                      <span className="text-[10px] font-semibold leading-tight">
                        {format(price)}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {pricesQuery.data?.error && (
            <p className="mt-2 text-xs text-destructive">{pricesQuery.data.error}</p>
          )}

          {/* `canFetch` : sans trajet, aucun prix n'a été demandé — annoncer
              qu'il n'y en a « aucun sur ce trajet » serait faux, et se
              contredisait déjà avec la phrase d'explication au-dessus. */}
          {canFetch &&
            !pricesQuery.isFetching &&
            !pricesQuery.data?.error &&
            (pricesQuery.data?.days?.length ?? 0) === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Aucun prix disponible pour ce mois sur ce trajet. Essayez un autre mois.
              </p>
            )}

          {/* La légende ne s'affiche que s'il y a des prix à légender : sans
              trajet (page hébergement), elle annoncerait un code couleur que
              rien dans le calendrier n'utilise. */}
          <div
            className="mt-3 flex flex-wrap gap-3 text-[11px] text-muted-foreground"
            hidden={priceByDate.size === 0}
          >
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded bg-success/40" aria-hidden /> Bas
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded bg-warning/40" aria-hidden /> Moyen
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2.5 rounded bg-destructive/30" aria-hidden /> Élevé
            </span>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}

/** Compatibilité : le champ de départ garde son nom historique. */
export function DepartureDatePicker(
  props: Omit<Parameters<typeof PriceDatePicker>[0], "mode" | "id" | "label">,
) {
  return <PriceDatePicker {...props} mode="departure" id="depart" label="Date de départ" />;
}
