import { Link } from "@tanstack/react-router";

import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { useCurrency } from "@/lib/currency-context";
import { getDestinationImage } from "@/lib/destination-images";
import type { DestinationPrice } from "@/lib/flights.types";
import { secondaryAirport } from "@/data/airports";

export function DestinationPriceGrid({
  prices,
  origin,
  error,
}: {
  prices: DestinationPrice[];
  origin: string;
  error?: string | null;
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
          Aucun prix disponible pour le moment sur ces destinations. Essayez d'autres dates depuis
          le formulaire de recherche.
        </p>
      )}

      {sorted.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {sorted.map((price) => {
            const image = getDestinationImage(price.destination, price.city);
            // Le tarif d’appel peut partir d’un aéroport éloigné : « Marrakech 50 € »
            // au départ de Beauvais, ce n’est pas le même voyage.
            const depart = secondaryAirport(price.originAirport);
            const arrivee = secondaryAirport(price.destinationAirport);
            return (
              <li key={price.destination}>
                <Link
                  to="/recherche"
                  search={{
                    origin,
                    destination: price.destination,
                    depart: price.departureAt.slice(0, 10),
                    retour: "",
                    duree: 0,
                    flexible: 1,
                    budget: 0,
                    adultes: 1,
                    enfants: 0,
                    bebes: 0,
                  }}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-colors hover:bg-secondary"
                >
                  <ResponsivePicture
                    src={image.thumb}
                    webp={image.thumbWebp}
                    alt={image.alt}
                    loading="lazy"
                    width={112}
                    height={80}
                    className="size-14 shrink-0 rounded-lg object-cover sm:h-16 sm:w-20"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold">{price.city}</span>
                    <span className="block truncate text-xs text-muted-foreground">
                      {price.country} · {price.airline}
                    </span>
                    {(depart || arrivee) && (
                      <span className="mt-0.5 block truncate text-xs text-warning-foreground">
                        <span className="rounded bg-warning px-1 py-0.5">
                          {(depart ?? arrivee)!.code} à {(depart ?? arrivee)!.distanceKm} km de{" "}
                          {(depart ?? arrivee)!.city}
                        </span>
                      </span>
                    )}
                  </span>
                  <span className="font-display text-lg font-semibold text-primary">
                    {format(price.priceEur)}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
