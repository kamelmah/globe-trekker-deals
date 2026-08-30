import { Minus, Plus, Users } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

export type Passengers = { adults: number; children: number; infants: number };

export const MAX_ADULTS = 9;
export const MAX_CHILDREN = 8;

export function passengersSummary({ adults, children, infants }: Passengers): string {
  const parts = [`${adults} adulte${adults > 1 ? "s" : ""}`];
  if (children > 0) parts.push(`${children} enfant${children > 1 ? "s" : ""}`);
  if (infants > 0) parts.push(`${infants} bébé${infants > 1 ? "s" : ""}`);
  return parts.join(", ");
}

type RowProps = {
  id: string;
  title: string;
  hint: string;
  value: number;
  min: number;
  max: number;
  disabledPlusReason?: string;
  onChange: (value: number) => void;
};

function CounterRow({
  id,
  title,
  hint,
  value,
  min,
  max,
  disabledPlusReason,
  onChange,
}: RowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium" id={`${id}-label`}>
          {title}
        </p>
        <p className="text-xs text-muted-foreground">{hint}</p>
        {value >= max && disabledPlusReason ? (
          <p className="mt-1 text-xs text-primary">{disabledPlusReason}</p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label={`Retirer un passager : ${title}`}
          disabled={value <= min}
          onClick={() => onChange(Math.max(min, value - 1))}
        >
          <Minus className="size-4" aria-hidden />
        </Button>
        <span
          className="w-6 text-center text-sm font-semibold tabular-nums"
          aria-live="polite"
          aria-labelledby={`${id}-label`}
        >
          {value}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="size-8"
          aria-label={`Ajouter un passager : ${title}`}
          disabled={value >= max}
          onClick={() => onChange(Math.min(max, value + 1))}
        >
          <Plus className="size-4" aria-hidden />
        </Button>
      </div>
    </div>
  );
}

export type PassengerSelectorProps = {
  value: Passengers;
  onChange: (value: Passengers) => void;
};

export function PassengerSelector({ value, onChange }: PassengerSelectorProps) {
  const summary = passengersSummary(value);

  function setAdults(adults: number) {
    onChange({ ...value, adults, infants: Math.min(value.infants, adults) });
  }

  return (
    <div className="space-y-1.5">
      <Label htmlFor="passagers">Nombre de passagers</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="passagers"
            type="button"
            variant="outline"
            className="h-9 w-full justify-start font-normal"
          >
            <Users className="size-4 text-muted-foreground" aria-hidden />
            {summary}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-80 p-4">
          <div className="divide-y divide-border">
            <CounterRow
              id="adultes"
              title="Adultes"
              hint="12 ans et plus"
              value={value.adults}
              min={1}
              max={MAX_ADULTS}
              onChange={setAdults}
            />
            <CounterRow
              id="enfants"
              title="Enfants"
              hint="2 à 11 ans — siège propre, tarif enfant"
              value={value.children}
              min={0}
              max={MAX_CHILDREN}
              onChange={(children) => onChange({ ...value, children })}
            />
            <CounterRow
              id="bebes"
              title="Bébés"
              hint="0 à 23 mois — sur les genoux d'un adulte, sans siège"
              value={value.infants}
              min={0}
              max={value.adults}
              disabledPlusReason="Un bébé par adulte maximum, comme l'exigent les compagnies aériennes."
              onChange={(infants) => onChange({ ...value, infants })}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
