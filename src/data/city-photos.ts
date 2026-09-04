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
  ALC: {
    imageUrl: "/images/alicante-santa-barbara.webp",
    imageThumbUrl: "/images/alicante-santa-barbara-thumb.webp",
    imageAlt:
      "Château de Santa Bárbara sur son rocher au-dessus des toits d'Alicante et de la Méditerranée",
  },
  BIA: {
    imageUrl: "/images/bastia-vieux-port.webp",
    imageThumbUrl: "/images/bastia-vieux-port-thumb.webp",
    imageAlt:
      "Vue aérienne de la vieille ville et du vieux port de Bastia, du phare de la jetée aux montagnes du Cap Corse",
  },
  BJA: {
    imageUrl: "/images/bejaia-baie.webp",
    imageThumbUrl: "/images/bejaia-baie-thumb.webp",
    imageAlt: "Baie et port de Béjaïa au pied des montagnes de Kabylie, vus des hauteurs boisées",
  },
  ORN: {
    imageUrl: "/images/oran-santa-cruz.webp",
    imageThumbUrl: "/images/oran-santa-cruz-thumb.webp",
    imageAlt: "Chapelle Santa Cruz dominant la baie et le port d'Oran, Algérie",
  },
  SSH: {
    imageUrl: "/images/charm-el-cheikh-plage.webp",
    imageThumbUrl: "/images/charm-el-cheikh-plage-thumb.webp",
    imageAlt:
      "Paillotes de chaume et parasols sur une plage de Charm el-Cheikh, au-dessus d'un lagon turquoise bordé de récifs",
  },
  TNG: {
    imageUrl: "/images/tanger-kasbah.webp",
    imageThumbUrl: "/images/tanger-kasbah-thumb.webp",
    imageAlt:
      "Remparts crénelés de la kasbah de Tanger au-dessus des toits de la médina, du port et de la baie",
  },
};

export function photoVille(code: string | null | undefined): PhotoVille | null {
  if (!code) return null;
  return CITY_PHOTOS[code.toUpperCase()] ?? null;
}
