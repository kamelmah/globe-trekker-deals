import { CalendarIcon } from "lucide-react";
import { formatMonthLong } from "@/lib/dates";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const MONTHS_AHEAD = 12;

/**
 * Mois courant décalé de `offset`, au format AAAA-MM.
 *
 * L'ancienne version produisait « Août 2026 » un 2 septembre, et sautait
 * octobre. Deux effets du même `toISOString()`, qui bascule en UTC :
 *
 *  — à 01 h 30 CEST, le 1er septembre local est le 31 août à Greenwich, d'où
 *    un mois déjà passé en tête de liste ;
 *  — le 1er novembre est en CET (+1), pas CEST (+2) : le décalage d'une seule
 *    heure ne suffit plus à reculer d'un jour, et octobre disparaît.
 *
 * Le mois courant est lu en heure locale, puis l'arithmétique se fait en UTC
 * sur le 1er du mois — où aucun changement d'heure ne peut la faire déborder.
 */
function monthKey(offset: number): string {
  const maintenant = new Date();
  const d = new Date(Date.UTC(maintenant.getFullYear(), maintenant.getMonth() + offset, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}`;
}

function monthLabel(month: string): string {
  const label = formatMonthLong(month);
  return label.charAt(0).toUpperCase() + label.slice(1);
}

/** Sélecteur de mois en popover, pour remplacer le rendu natif disgracieux de <input type="month">. */
export function MonthPicker({
  value,
  onChange,
  id = "month",
  label = "Mois de départ (facultatif)",
}: {
  value: string;
  onChange: (month: string) => void;
  id?: string;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const months = Array.from({ length: MONTHS_AHEAD }, (_, i) => monthKey(i));

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            id={id}
            type="button"
            variant="outline"
            className="w-full justify-start text-left font-normal"
          >
            <CalendarIcon className="size-4 shrink-0" aria-hidden />
            <span className="truncate">{value ? monthLabel(value) : "Tous les mois"}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="z-[1000] w-72 p-3 pointer-events-auto">
          <button
            type="button"
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            className={cn(
              "mb-2 w-full rounded-md border p-2 text-center text-sm transition-colors hover:bg-muted",
              value === "" ? "border-primary bg-primary/10 font-medium" : "border-border",
            )}
          >
            Tous les mois
          </button>
          <div className="grid grid-cols-3 gap-1.5">
            {months.map((month) => (
              <button
                key={month}
                type="button"
                onClick={() => {
                  onChange(month);
                  setOpen(false);
                }}
                className={cn(
                  "rounded-md border p-2 text-center text-xs transition-colors hover:bg-muted",
                  value === month ? "border-primary bg-primary/10 font-medium" : "border-border",
                )}
              >
                {monthLabel(month)}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
