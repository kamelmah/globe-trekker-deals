/**
 * Nombre d'alertes prix actives sur une liaison.
 *
 * Sert la mention « N personnes suivent ce trajet » à côté du formulaire
 * d'alerte. Une seule requête, en COMPTAGE : aucune ligne de `price_alerts`
 * n'est ramenée, et surtout aucune adresse e-mail ne quitte la base — la table
 * en contient, et une page publique n'a rien à en connaître.
 */

/**
 * Seuil d'affichage.
 *
 * En dessous, la mention est absente : « 1 personne suit ce trajet » décourage
 * l'inscription au lieu de l'encourager. Le seuil ne change pas le chiffre
 * affiché, il décide seulement de l'afficher ou non — un compte au-dessus du
 * seuil est toujours le compte réel.
 */
export const ALERT_COUNT_THRESHOLD = 5;

/**
 * Compte les alertes actives d'une liaison, ou null si la lecture échoue.
 *
 * Null et 0 sont deux choses différentes et le rendu les traite pareil (rien
 * d'affiché) : dans les deux cas nous ne pouvons pas affirmer un nombre.
 */
export async function countActiveAlerts(route: {
  origin: string;
  destination: string;
}): Promise<number | null> {
  try {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count, error } = await supabaseAdmin
      .from("price_alerts")
      .select("id", { count: "exact", head: true })
      .eq("origin", route.origin.toUpperCase())
      .eq("destination", route.destination.toUpperCase())
      .eq("active", true);
    if (error) throw error;
    return typeof count === "number" ? count : null;
  } catch (error) {
    console.error("Comptage des alertes impossible", error);
    return null;
  }
}

/**
 * Le compte à afficher, ou null quand il ne doit pas l'être.
 *
 * Aucun arrondi, aucun « plus de 10 » : le compte réel ou rien. Arrondir vers le
 * haut serait un chiffre inventé, et c'est exactement ce que cette page promet
 * de ne pas faire pour les prix.
 */
export function displayableAlertCount(count: number | null): number | null {
  if (count === null || count < ALERT_COUNT_THRESHOLD) return null;
  return count;
}
