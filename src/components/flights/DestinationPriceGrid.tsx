import { Link } from "@tanstack/react-router";

import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { useCurrency } from "@/lib/currency-context";
import type { ApiDebugInfo, DestinationPrice } from "@/lib/flights.types";

export function DestinationPriceGrid({
  prices,
  origin,
  error,
  debug,
}: {
  prices: DestinationPrice[];
  origin: string;
  error?: string | null;
  debug?: ApiDebugInfo | null;
}) {
  const { format } = useCurrency();
  const sorted = [...prices].sort((a, b) => a.priceEur - b.priceEur);

  return (
    <div>
      {error && (
        <p className="rounded-xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
          {error}
        </p>
      )}

      {!error && sorted.length === 0 && (
        <p className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
          Aucun prix disponible pour le moment sur ces destinations. Essayez d'autres dates depuis le
          formulaire de recherche.
        </p>
      )}

      {sorted.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((price) => (
            <li key={price.destination}>
              <Link
                to="/recherche"
                search={{
                  origin,
                  destination: price.destination,
                  depart: price.departureAt.slice(0, 10),
                  retour: "",
                  flexible: 1,
                  budget: 0,
                  vue: "liste",
                }}
                className="flex items-center justify-between gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              >
                <span>
                  <span className="block text-sm font-semibold">{price.city}</span>
                  <span className="block text-xs text-muted-foreground">
                    {price.country} · {price.airline}
                  </span>
                </span>
                <span className="font-display text-lg font-semibold text-primary">
                  {format(price.priceEur)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}

      <ApiDebugPanel debug={debug} label="Destinations les moins chères" />
    </div>
  );
}
