import { OG_ROUTE_SLUGS } from "@/data/og-routes";
import { absoluteUrl } from "@/lib/site";

/**
 * Carte Open Graph d'un trajet : villes, prix d'appel relevé et date de ce
 * relevé, sur fond de marque. Générée hors ligne par
 * scripts/generate-og-images.mjs, qui écrit aussi la liste des slugs couverts.
 *
 * Le test d'appartenance n'est pas défensif : il évite d'annoncer une image que
 * le serveur n'a pas, ce qui laisserait la vignette vide au partage.
 *
 * Module séparé de site.ts à dessein : la liste pèse une centaine d'entrées et
 * n'a de raison d'être que sur les pages /vols/*, alors que site.ts est importé
 * presque partout.
 */
export function routeOgImage(slug: string): string | null {
  return OG_ROUTE_SLUGS.has(slug) ? absoluteUrl(`/og/routes/${slug}.png`) : null;
}
