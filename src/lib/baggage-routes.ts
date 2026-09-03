/**
 * Ce que la soute coûte réellement, compagnie par compagnie, sur les liaisons
 * que le site couvre.
 *
 * C'est le contenu propre de chaque page /bagages/<compagnie> : le tarif publié
 * d'une compagnie est le même partout, mais ce qu'il PÈSE ne l'est pas. Les
 * 19 € de soute de Ryanair valent 106 % du billet sur Marseille — Rome (plancher
 * 18 €) et 12 % sur Marseille — Beyrouth. Ce rapport est calculé, jamais rédigé,
 * et il relie la page bagages aux pages de liaison qu'elle concerne.
 *
 * Aucun appel réseau ni base : la liste blanche porte les compagnies relevées
 * sur chaque route et le plancher renvoyé par l'API lors de sa validation.
 */

import { type AirlineBaggagePolicy } from "@/data/baggage-fees";
import { ROUTE_WHITELIST } from "@/data/route-whitelist";

export type BaggageRouteRow = {
  slug: string;
  originCity: string;
  destinationCity: string;
  country: string;
  /** Plancher relevé sur la liaison lors de la validation de la liste blanche. */
  floorEur: number;
  /**
   * Supplément soute publié par la compagnie. 0 quand elle la comprend, `null`
   * quand nous ne l'avons pas documenté — easyJet vend la soute par tranches de
   * 3 kg, sans tarif unique pour 20 kg. La ligne reste affichée, sans montant :
   * la liaison et son plancher sont vrais, le supplément serait inventé.
   */
  supplementEur: number | null;
  /** Billet soute comprise, ou null quand le supplément est inconnu. */
  totalEur: number | null;
  /** Part du plancher que représente la soute, ou null si inconnue. */
  partPourcent: number | null;
};

/**
 * Liaisons du site desservies par cette compagnie, avec le surcoût soute
 * calculé sur le plancher de chacune.
 *
 * Une route sans plancher relevé est ÉCARTÉE plutôt qu'affichée sans chiffre :
 * la ligne n'aurait alors rien de propre à la route, ce qui est exactement ce
 * que cette page existe pour éviter. En revanche une compagnie dont la soute
 * n'est pas documentée garde ses liaisons, colonnes de surcoût vides : la
 * liaison et son plancher sont vrais, seul le supplément manque.
 */
export function routesForAirline(policy: AirlineBaggagePolicy): BaggageRouteRow[] {
  const supplementEur =
    policy.checkedBag.kind === "inclus"
      ? 0
      : policy.checkedBag.kind === "payant"
        ? policy.checkedBag.minEur
        : null;

  const code = policy.airline.toUpperCase();
  return (
    ROUTE_WHITELIST.filter(
      (route) =>
        route.validation.airlines.some((a) => a.toUpperCase() === code) &&
        route.validation.minPriceEur !== null,
    )
      .map((route) => {
        const floorEur = route.validation.minPriceEur as number;
        return {
          slug: route.slug,
          originCity: route.originCity,
          destinationCity: route.destinationCity,
          country: route.country,
          floorEur,
          supplementEur,
          totalEur: supplementEur === null ? null : Math.round(floorEur + supplementEur),
          partPourcent:
            supplementEur === null ? null : Math.round((supplementEur / floorEur) * 100),
        };
      })
      // Du rapport le plus lourd au plus léger : c'est sur les billets les moins
      // chers que la soute change tout, et c'est ce que le lecteur vient voir.
      // Sans supplément connu, le plancher croissant est le seul ordre honnête.
      .sort(
        (a, b) =>
          (b.partPourcent ?? -1) - (a.partPourcent ?? -1) ||
          a.floorEur - b.floorEur ||
          a.slug.localeCompare(b.slug, "fr"),
      )
  );
}

/** Compagnie par segment d'URL, ou null si l'URL ne correspond à aucune. */
export function airlineBySlug(
  slug: string,
  policies: readonly AirlineBaggagePolicy[],
): AirlineBaggagePolicy | null {
  const clean = slug.trim().toLowerCase();
  return policies.find((p) => p.slug === clean) ?? null;
}
