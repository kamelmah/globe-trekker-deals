/**
 * Photo de la ville de destination : URL, vignette et texte alternatif.
 *
 * C'est la « colonne image_url » des villes de destination. Elle vit dans un
 * module et non dans Supabase pour la même raison que hotel-relevance.ts et
 * hotel-night-prices.ts : il n'y a pas de table des villes dans la base — les
 * villes viennent de route-whitelist.ts (généré, donc écrasé à chaque
 * régénération) et de destinations.ts. Un module tient le même rôle, avec la
 * relecture en revue de code en plus.
 *
 * TROIS CHAMPS, ET LES TROIS OBLIGATOIRES.
 *
 * L'alt ne se déduit pas de la ville : « Oran, Algérie » sur une photo de la
 * chapelle Santa Cruz décrit le sujet du voyage, pas ce qu'on voit. Il est donc
 * écrit avec la photo, pour cette photo, et il vaut partout où elle sort —
 * bannière de guide comme vignette de 48 px.
 *
 * La vignette est un fichier distinct et non la grande image redimensionnée par
 * le navigateur : une liste de huit destinations téléchargerait sinon huit
 * images pleine taille pour les afficher en 48 px.
 *
 * PAS DE SÉLECTION AUTOMATIQUE. Le fallback de getDestinationImage est un
 * visuel neutre unique, identique pour toutes les villes non renseignées.
 * L'ancien mécanisme choisissait une « ambiance » d'après le pays et un hachage
 * du nom : il produisait des photos qui n'étaient pas celles de la ville tout
 * en portant son nom en alt. Une image neutre assumée dit la vérité ; une photo
 * de médina marocaine étiquetée « Sétif, Algérie » ne la disait pas.
 *
 * Ajouter une ville : déposer les deux fichiers dans public/images/, puis une
 * entrée ici. Rien d'autre à toucher.
 */

export type PhotoVille = {
  /** Chemin public de l'image pleine taille, ex. « /images/oran-santa-cruz.webp ». */
  imageUrl: string;
  /** Chemin public de la vignette. Servie dans les listes et les grilles. */
  imageThumbUrl: string;
  /** Ce que la photo MONTRE, pas la ville qu'elle illustre. */
  imageAlt: string;
};

/** Clé : code IATA de la ville, comme partout ailleurs dans le site. */
export const CITY_PHOTOS: Record<string, PhotoVille> = {
  ORN: {
    imageUrl: "/images/oran-santa-cruz.webp",
    imageThumbUrl: "/images/oran-santa-cruz-thumb.webp",
    imageAlt: "Chapelle Santa Cruz dominant la baie et le port d'Oran, Algérie",
  },
};

export function photoVille(code: string | null | undefined): PhotoVille | null {
  if (!code) return null;
  return CITY_PHOTOS[code.toUpperCase()] ?? null;
}
