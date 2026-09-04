/**
 * Largeur d'une vignette Wikimedia, lue et réécrite dans l'URL.
 *
 * Les fichiers de `city-photos` ont une vignette dédiée, pour la raison écrite
 * là-bas : une liste de huit destinations ne doit pas télécharger huit images
 * pleine taille pour les afficher en 48 px. Les URL relevées n'ont pas ce
 * second fichier — mais Wikimedia porte la largeur demandée dans le dernier
 * segment de l'URL (« …/1280px-Fichier.jpg »). Une carte peut donc demander la
 * taille qu'elle affiche plutôt que celle d'une bannière.
 *
 * MAIS PAS N'IMPORTE LAQUELLE. Wikimedia ne rend plus une vignette à la demande
 * dans une largeur arbitraire : elle sert un jeu fixe de tailles et répond 400
 * pour toutes les autres. Mesuré sur un fichier de Commons, une largeur à la
 * fois : 120, 250, 330, 500, 960, 1280 et 1920 passent ; 160, 320, 512, 640,
 * 800, 1024 et 1200 sont refusées. Une URL construite à la main doit donc
 * tomber sur une de ces valeurs, sinon elle est cassée — silencieusement, car
 * rien ne vérifie une image avant de l'écrire en base.
 *
 * Module partagé et non `.server` : le serveur s'en sert pour agrandir au
 * relevé, le composant pour réduire à l'affichage. Les fonctions sont pures.
 *
 * Les URL Pexels ne sont pas concernées : leur taille passe par des paramètres
 * de requête que la banque fait varier, et une réécriture à l'aveugle y
 * risquerait la même image absente. Elles sont rendues inchangées.
 */

const MOTIF_LARGEUR = /\/(\d+)px-([^/]+)$/;

/** Les seules largeurs que Wikimedia rend. Toute autre valeur reçoit un 400. */
export const LARGEURS_WIKIMEDIA = [120, 250, 330, 500, 960, 1280, 1920] as const;

/** Largeur portée par une URL de vignette Wikimedia, ou null si l'URL n'en porte pas. */
export function largeurWikimedia(url: string): number | null {
  const trouve = MOTIF_LARGEUR.exec(url);
  if (!trouve?.[1]) return null;
  const largeur = Number(trouve[1]);
  return Number.isFinite(largeur) && largeur > 0 ? largeur : null;
}

/**
 * La plus grande largeur servie qui ne dépasse pas `plafond`, ou null.
 *
 * Sert à agrandir sans dépasser le fichier d'origine : une photo de 900 px de
 * large donne 500, pas 960 — Wikimedia refuse d'agrandir au-delà de l'original,
 * et 900 n'est de toute façon pas une largeur servie.
 */
export function plusGrandeLargeurJusqua(plafond: number): number | null {
  let choisie: number | null = null;
  for (const largeur of LARGEURS_WIKIMEDIA) {
    if (largeur <= plafond) choisie = largeur;
  }
  return choisie;
}

/**
 * La plus petite largeur servie qui couvre `minimum`, ou null si aucune ne le
 * couvre. Sert à réduire une image d'affichage sans la rendre floue.
 */
export function plusPetiteLargeurCouvrant(minimum: number): number | null {
  for (const largeur of LARGEURS_WIKIMEDIA) {
    if (largeur >= minimum) return largeur;
  }
  return null;
}

/**
 * La même image dans une autre largeur.
 *
 * URL non Wikimedia, ou largeur qui n'est pas servie : l'URL est rendue
 * inchangée plutôt que réécrite en une adresse qui répondrait 400.
 */
export function imageWikimediaALargeur(url: string, largeur: number): string {
  if (!LARGEURS_WIKIMEDIA.includes(largeur as (typeof LARGEURS_WIKIMEDIA)[number])) return url;
  if (!MOTIF_LARGEUR.test(url)) return url;
  return url.replace(MOTIF_LARGEUR, `/${largeur}px-$2`);
}
