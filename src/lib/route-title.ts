/**
 * Gabarit UNIQUE du titre des pages de liaison /vols/<origine>-<destination>.
 *
 * Les titres étaient écrits à deux endroits — à la main pour les 38 pages
 * éditoriales, par le générateur pour les autres — et avaient divergé :
 * « Vol Marseille Agadir pas cher » d'un côté, « Vol pas cher Paris Porto :
 * prix, compagnies, questions » de l'autre. Sur un site dont toutes les pages
 * répondent à la même intention de recherche, ces titres doivent suivre une
 * seule forme.
 *
 * Aucun prix dans le titre : il change tous les jours alors que Google ne
 * recrawle pas la page à ce rythme, ce qui garantit un titre périmé en SERP.
 * Le prix a sa place dans la page, pas dans la balise.
 */

/**
 * Le modèle. Un seul endroit à modifier pour changer le titre de toutes les
 * pages de liaison du site.
 */
export function routeMetaTitle(originCity: string, destinationCity: string): string {
  return `Vol pas cher ${originCity} ${destinationCity} : prix et meilleure période`;
}
