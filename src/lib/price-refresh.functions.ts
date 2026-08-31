import { createServerFn } from "@tanstack/react-start";

import {
  MANUAL_REFRESH_COOLDOWN_MS,
  REFRESH_INTERVAL_MS,
  type PriceRefreshState,
} from "@/lib/price-refresh.shared";

/** État public de la mise à jour des prix (dernière et prochaine échéance). */
export const priceRefreshState = createServerFn({ method: "GET" }).handler(async () => {
  const { readPriceRefreshState } = await import("@/lib/price-refresh.server");
  const state = await readPriceRefreshState();
  return { state, intervalMs: REFRESH_INTERVAL_MS };
});

/**
 * Rafraîchissement immédiat déclenché par un clic humain. Un délai minimum est
 * appliqué pour ne pas gaspiller le quota de l'API de prix.
 */
export const refreshPricesNow = createServerFn({ method: "POST" }).handler(async () => {
  const { readPriceRefreshState, refreshFlightPrices } = await import(
    "@/lib/price-refresh.server"
  );
  const current = await readPriceRefreshState();
  const last = current.lastAt ? Date.parse(current.lastAt) : 0;
  if (last && Date.now() - last < MANUAL_REFRESH_COOLDOWN_MS) {
    const minutes = Math.ceil((MANUAL_REFRESH_COOLDOWN_MS - (Date.now() - last)) / 60000);
    return {
      state: current as PriceRefreshState,
      refreshed: false as const,
      message: `Les prix viennent d'être mis à jour. Nouvelle actualisation possible dans ${minutes} min.`,
    };
  }

  const state = await refreshFlightPrices("manuel");
  return {
    state,
    refreshed: true as const,
    message: state.ok
      ? `Prix mis à jour depuis Travelpayouts : ${state.priceCount} tarifs relevés.`
      : "La source de prix n'a rien renvoyé pour le moment. Réessayez dans quelques minutes.",
  };
});
