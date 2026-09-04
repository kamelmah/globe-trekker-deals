import { createServerFn } from "@tanstack/react-start";

/**
 * L'origine déduite de la requête en cours.
 *
 * Passe par une fonction serveur pour que la lecture de l'en-tête reste côté
 * serveur : le HTML servi porte déjà la bonne ville, sans étape client qui la
 * remplacerait après affichage.
 */
export const detectedOrigin = createServerFn({ method: "GET" }).handler(async () => {
  const { getRequest } = await import("@tanstack/react-start/server");
  const { originFromGeoHeader, FALLBACK_ORIGIN } = await import("@/lib/geo-origin");
  try {
    // `x-nf-geo` est ajouté par Netlify. En local il est absent : le repli
    // s'applique, ce qui est exactement le comportement voulu.
    const header = getRequest()?.headers.get("x-nf-geo") ?? null;
    return { origin: originFromGeoHeader(header) };
  } catch (error) {
    console.error("Détection de l'origine impossible", error);
    return { origin: FALLBACK_ORIGIN };
  }
});
