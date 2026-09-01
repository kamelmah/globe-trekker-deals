/**
 * Pages éditoriales retirées de l'index — deuxième vague d'élagage.
 *
 * La première vague (voir `route-whitelist.ts`) a désindexé les pages de
 * liaison GÉNÉRÉES hors liste blanche. Restaient des pages ÉDITORIALES, écrites
 * à la main, sur des long-courriers au départ de Paris : elles ne sont ni dans
 * la liste blanche — le site est recentré sur Marseille et le Sud — ni dans
 * l'index Google après plusieurs mois. Elles diluent l'évaluation du domaine
 * sans rien rapporter.
 *
 * Les pages ne sont ni supprimées ni mises en 404 : elles passent en
 * `noindex, follow` et sortent du sitemap, comme à l'étape 2. Le contenu reste
 * disponible et la décision reste réversible en retirant une ligne d'ici.
 *
 * RÈGLE ABSOLUE : rien de ce qui figure déjà dans l'index Google n'entre ici.
 * C'est pourquoi Bangkok est absent des trois listes alors qu'il appartient au
 * même lot de long-courriers : `/vols/paris-bangkok` et le guide Bangkok sont
 * indexés. On ne retire jamais de l'index une page qui y figure déjà.
 */

/** Pages de liaison éditoriales désindexées. */
export const PRUNED_ROUTE_SLUGS: readonly string[] = [
  "paris-tokyo",
  "paris-seoul",
  "paris-hong-kong",
  "paris-bali",
  "paris-los-angeles",
  "paris-mexico",
  "paris-new-york",
  "paris-montreal",
  "paris-miami",
  "paris-dakar",
  "paris-doha",
  "paris-reykjavik",
];

/**
 * Guides destinations désindexés : ceux qui ne portent que sur les
 * destinations ci-dessus. Le guide Bangkok reste indexable.
 */
export const PRUNED_GUIDE_SLUGS: readonly string[] = [
  "tokyo",
  "seoul",
  "hong-kong",
  "bali",
  "los-angeles",
  "mexico",
  "new-york",
  "montreal",
  "miami",
  "dakar",
  "doha",
  "reykjavik",
];

/**
 * Comparatifs désindexés : uniquement ceux dont les DEUX destinations sont
 * élaguées. `bangkok-ou-bali` et `dubai-ou-doha` gardent chacun une destination
 * conservée ou indexée, ils restent donc indexables — mais leurs liens vers les
 * pages élaguées sont coupés (voir `comparatifs.$slug.tsx`).
 */
export const PRUNED_COMPARISON_SLUGS: readonly string[] = ["new-york-ou-miami"];

export function isRoutePruned(slug: string): boolean {
  return PRUNED_ROUTE_SLUGS.includes(slug);
}

export function isGuidePruned(slug: string): boolean {
  return PRUNED_GUIDE_SLUGS.includes(slug);
}

export function isComparisonPruned(slug: string): boolean {
  return PRUNED_COMPARISON_SLUGS.includes(slug);
}

/**
 * Filtre générique pour toute liste de pages portant un `slug` : sert à retirer
 * les pages élaguées du sitemap ET des listes qui les énumèrent, pour qu'aucun
 * lien interne ne pointe vers une page en `noindex`.
 */
export function withoutPruned<T extends { slug: string }>(
  items: readonly T[],
  pruned: readonly string[],
): T[] {
  return items.filter((item) => !pruned.includes(item.slug));
}
