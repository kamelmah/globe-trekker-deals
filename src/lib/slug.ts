/** Slugs SEO partagés client/serveur pour les pages /vols/<origine>-<destination>. */

export function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/['’]/g, " ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Slug canonique d'un trajet, ex. "paris-marrakech". */
export function routeSlug(originCity: string, destinationCity: string): string {
  return `${slugify(originCity)}-${slugify(destinationCity)}`;
}
