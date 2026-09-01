/**
 * Anciennes URL de pages de liaison, redirigées en 301 vers leur URL actuelle.
 *
 * Ce fichier est un registre HISTORIQUE, pas une donnée dérivée : il ne doit
 * jamais être régénéré ni vidé quand la liste blanche change. Une URL qui a été
 * servie un jour doit continuer à mener quelque part.
 *
 * Les slugs de départ venaient du référentiel géographique de Travelpayouts,
 * qui renvoie des libellés administratifs plutôt que le nom d'usage : « Ville de
 * Madrid » pour MAD, « Buda » pour BUD, « Palma de Mallorca » pour PMI.
 *
 * Seules les routes CONSERVÉES sont listées. Les liaisons écartées de la liste
 * blanche ne sont pas redirigées : elles passent en `noindex` et restent
 * servies telles quelles tant que l'indexation n'est pas stabilisée.
 */
export const LEGACY_ROUTE_REDIRECTS: Readonly<Record<string, string>> = {
  "marseille-ville-de-madrid": "marseille-madrid",
  "marseille-palma-de-mallorca": "marseille-palma",
  "marseille-buda": "marseille-budapest",
};

/** URL de destination pour un ancien slug, ou null s'il n'a pas changé. */
export function legacyRedirectTarget(slug: string): string | null {
  return LEGACY_ROUTE_REDIRECTS[slug] ?? null;
}
