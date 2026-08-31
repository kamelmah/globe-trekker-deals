import { useQuery } from "@tanstack/react-query";
import { useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { priceRefreshState, refreshPricesNow } from "@/lib/price-refresh.functions";
import { formatParisDateTime, type PriceRefreshState } from "@/lib/price-refresh.shared";

/**
 * Bandeau de transparence : quand les prix ont été relevés auprès de
 * Travelpayouts, quand la prochaine mise à jour automatique est prévue, et
 * possibilité d'en déclencher une immédiatement.
 */
export function PriceRefreshStatus() {
  const readState = useServerFn(priceRefreshState);
  const runRefresh = useServerFn(refreshPricesNow);
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [manual, setManual] = useState<PriceRefreshState | null>(null);

  const query = useQuery({
    queryKey: ["price-refresh-state"],
    queryFn: () => readState(),
    staleTime: 60_000,
  });

  const state = manual ?? query.data?.state ?? null;

  async function refresh() {
    setPending(true);
    setFeedback(null);
    try {
      const result = await runRefresh();
      setManual(result.state);
      setFeedback(result.message);
      if (result.refreshed) await router.invalidate();
    } catch {
      setFeedback("Mise à jour impossible pour le moment, réessayez dans quelques minutes.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-6 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 text-sm sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="font-medium">Prix mis à jour automatiquement toutes les heures</p>
        <p className="mt-1 text-muted-foreground">
          {state?.lastAt ? (
            <>
              Dernière mise à jour : {formatParisDateTime(state.lastAt)} (heure de Paris) ·
              prochaine mise à jour prévue vers {formatParisDateTime(state.nextAt)}
            </>
          ) : query.isPending ? (
            "Chargement de l'état de mise à jour…"
          ) : (
            "Aucune mise à jour automatique enregistrée pour l'instant : lancez-en une maintenant."
          )}
        </p>
        {feedback && <p className="mt-1 text-muted-foreground">{feedback}</p>}
      </div>
      <Button variant="outline" onClick={refresh} disabled={pending} className="shrink-0">
        <RefreshCw className={pending ? "animate-spin" : undefined} aria-hidden />
        {pending ? "Mise à jour en cours…" : "Actualiser les prix maintenant"}
      </Button>
    </div>
  );
}
