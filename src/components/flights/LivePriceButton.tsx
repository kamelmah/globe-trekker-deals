import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";

import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { Button } from "@/components/ui/button";
import { useCurrency } from "@/lib/currency-context";
import { cheapestDestinations } from "@/lib/flights.functions";
import type { ApiDebugInfo } from "@/lib/flights.types";

type Props = {
  origin: string;
  destination: string;
  originCity: string;
  destinationCity: string;
};

/**
 * Aucun appel API au chargement de la page : le tarif temps réel n'est demandé
 * qu'après un clic humain explicite (économie de quota et pages plus rapides).
 */
export function LivePriceButton({ origin, destination, originCity, destinationCity }: Props) {
  const fetchCheapest = useServerFn(cheapestDestinations);
  const { currency, format } = useCurrency();
  const [state, setState] = useState<"idle" | "loading" | "done">("idle");
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<ApiDebugInfo | null>(null);

  async function load() {
    setState("loading");
    setError(null);
    try {
      const result = await fetchCheapest({
        data: { origin, destinations: [destination], currency },
      });
      setPrice(result.prices[0]?.priceEur ?? null);
      setError(result.error);
      setDebug(result.debug ?? null);
    } catch {
      setError("Impossible de charger les tarifs pour le moment, réessayez plus tard.");
      setPrice(null);
    } finally {
      setState("done");
    }
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <p className="text-xs text-muted-foreground">Tarif en direct</p>
      {state !== "done" && (
        <>
          <p className="mt-1 text-sm text-muted-foreground">
            Les tarifs {originCity} — {destinationCity} sont interrogés uniquement à votre demande.
          </p>
          <Button className="mt-3" onClick={load} disabled={state === "loading"}>
            {state === "loading" ? "Recherche en cours…" : "Voir les tarifs en direct aujourd'hui"}
          </Button>
        </>
      )}

      {state === "done" && (
        <>
          {price !== null ? (
            <p className="mt-1 font-display text-2xl font-semibold text-primary">{format(price)}</p>
          ) : (
            <p className="mt-1 text-sm text-muted-foreground">
              Aucun vol trouvé pour cette recherche, essayez d'autres dates.
            </p>
          )}
          {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
          <Button variant="outline" size="sm" className="mt-3" onClick={load}>
            Actualiser
          </Button>
          <ApiDebugPanel debug={debug} />
        </>
      )}
    </div>
  );
}
