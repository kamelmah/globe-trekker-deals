import { Link } from "@tanstack/react-router";

import { useCurrency } from "@/lib/currency-context";
import type { DestinationPrice } from "@/lib/flights.types";

export function DestinationPriceGrid({
  prices,
  origin,
  demo,
}: {
  prices: DestinationPrice[];
  origin: string;
  demo: boolean;
}) {
  const { format } = useCurrency();
  const sorted = [...prices].sort((a, b) => a.priceEur - b.priceEur);

  return (
    <div>
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
      {demo && (
        <p className="mt-4 text-xs text-muted-foreground">
          Prix de démonstration : la connexion au partenaire de distribution n'est pas encore
          configurée sur cet environnement.
        </p>
      )}
    </div>
  );
}
