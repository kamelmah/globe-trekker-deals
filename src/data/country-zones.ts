/**
 * Zones de voyage et frontières terrestres, écrites à la main.
 *
 * Sert au maillage interne : depuis une page /vols/<origine>-<destination>,
 * savoir quelles autres destinations de la même origine sont proches de celle
 * qu'on regarde — le même pays d'abord, puis la même zone ou un pays
 * limitrophe.
 *
 * Volontairement EN DUR et non en base : ce sont des faits de géographie, pas
 * des données d'exploitation. Ils ne changent pas d'un déploiement à l'autre,
 * n'ont pas à être relus à chaque rendu de page, et une table Supabase de plus
 * ajouterait une requête (et un mode de panne) à une page qui n'en a pas besoin.
 *
 * Les clés sont normalisées (minuscules, sans accents) : les données du site
 * écrivent tantôt « République tchèque », tantôt « Tchéquie », et le
 * référentiel Travelpayouts renvoie parfois les noms en anglais.
 */

export type CountryZone =
  | "maghreb"
  | "peninsule-iberique"
  | "italie"
  | "grece-balkans"
  | "france"
  | "europe-nord"
  | "europe-centrale"
  | "turquie-moyen-orient";

/** Normalise un nom de pays : minuscules, sans accents ni espaces superflus. */
export function normalizeCountry(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
}

/**
 * Zone de rattachement par pays.
 *
 * « europe-centrale » ne figure pas dans les zones d'origine du site (Maghreb,
 * péninsule ibérique, Italie, Grèce/Balkans, France, Europe du Nord,
 * Turquie/Moyen-Orient) : sans elle, Prague, Vienne, Munich et Cracovie
 * n'auraient aucune destination voisine et retomberaient toutes sur « les moins
 * chères », c'est-à-dire sur le Maghreb.
 *
 * Malte est rangée avec l'Italie : 90 km de mer la séparent de la Sicile, et
 * aucune autre zone ne lui va. L'Égypte est rangée avec le Moyen-Orient plutôt
 * qu'avec le Maghreb, dont elle ne fait pas partie.
 */
const ZONE_BY_COUNTRY: Record<string, CountryZone> = {
  // Maghreb
  maroc: "maghreb",
  morocco: "maghreb",
  algerie: "maghreb",
  algeria: "maghreb",
  tunisie: "maghreb",
  tunisia: "maghreb",
  libye: "maghreb",
  libya: "maghreb",
  mauritanie: "maghreb",
  mauritania: "maghreb",
  // Péninsule ibérique
  espagne: "peninsule-iberique",
  spain: "peninsule-iberique",
  portugal: "peninsule-iberique",
  andorre: "peninsule-iberique",
  andorra: "peninsule-iberique",
  gibraltar: "peninsule-iberique",
  // Italie
  italie: "italie",
  italy: "italie",
  malte: "italie",
  malta: "italie",
  "saint-marin": "italie",
  "san marino": "italie",
  // Grèce et Balkans
  grece: "grece-balkans",
  greece: "grece-balkans",
  chypre: "grece-balkans",
  cyprus: "grece-balkans",
  croatie: "grece-balkans",
  croatia: "grece-balkans",
  slovenie: "grece-balkans",
  slovenia: "grece-balkans",
  "bosnie-herzegovine": "grece-balkans",
  "bosnia and herzegovina": "grece-balkans",
  serbie: "grece-balkans",
  serbia: "grece-balkans",
  montenegro: "grece-balkans",
  albanie: "grece-balkans",
  albania: "grece-balkans",
  "macedoine du nord": "grece-balkans",
  "north macedonia": "grece-balkans",
  kosovo: "grece-balkans",
  bulgarie: "grece-balkans",
  bulgaria: "grece-balkans",
  roumanie: "grece-balkans",
  romania: "grece-balkans",
  // France
  france: "france",
  monaco: "france",
  // Europe du Nord
  "royaume-uni": "europe-nord",
  "united kingdom": "europe-nord",
  irlande: "europe-nord",
  ireland: "europe-nord",
  "pays-bas": "europe-nord",
  netherlands: "europe-nord",
  belgique: "europe-nord",
  belgium: "europe-nord",
  luxembourg: "europe-nord",
  danemark: "europe-nord",
  denmark: "europe-nord",
  suede: "europe-nord",
  sweden: "europe-nord",
  norvege: "europe-nord",
  norway: "europe-nord",
  finlande: "europe-nord",
  finland: "europe-nord",
  islande: "europe-nord",
  iceland: "europe-nord",
  estonie: "europe-nord",
  estonia: "europe-nord",
  lettonie: "europe-nord",
  latvia: "europe-nord",
  lituanie: "europe-nord",
  lithuania: "europe-nord",
  // Europe centrale
  allemagne: "europe-centrale",
  germany: "europe-centrale",
  autriche: "europe-centrale",
  austria: "europe-centrale",
  suisse: "europe-centrale",
  switzerland: "europe-centrale",
  "republique tcheque": "europe-centrale",
  tchequie: "europe-centrale",
  "czech republic": "europe-centrale",
  czechia: "europe-centrale",
  slovaquie: "europe-centrale",
  slovakia: "europe-centrale",
  pologne: "europe-centrale",
  poland: "europe-centrale",
  hongrie: "europe-centrale",
  hungary: "europe-centrale",
  liechtenstein: "europe-centrale",
  // Turquie et Moyen-Orient
  turquie: "turquie-moyen-orient",
  turkey: "turquie-moyen-orient",
  egypte: "turquie-moyen-orient",
  egypt: "turquie-moyen-orient",
  israel: "turquie-moyen-orient",
  jordanie: "turquie-moyen-orient",
  jordan: "turquie-moyen-orient",
  liban: "turquie-moyen-orient",
  lebanon: "turquie-moyen-orient",
  "emirats arabes unis": "turquie-moyen-orient",
  "united arab emirates": "turquie-moyen-orient",
  "arabie saoudite": "turquie-moyen-orient",
  "saudi arabia": "turquie-moyen-orient",
  qatar: "turquie-moyen-orient",
  oman: "turquie-moyen-orient",
  koweit: "turquie-moyen-orient",
  kuwait: "turquie-moyen-orient",
  bahrein: "turquie-moyen-orient",
  bahrain: "turquie-moyen-orient",
};

/**
 * Frontières terrestres, déclarées une seule fois par paire (l'index construit
 * plus bas les rend symétriques). Seuls les pays desservis par le site et leurs
 * voisins immédiats figurent ici : la liste sert à rapprocher deux
 * destinations, pas à décrire le monde.
 */
const LAND_BORDERS: Record<string, string[]> = {
  france: [
    "espagne",
    "italie",
    "suisse",
    "allemagne",
    "belgique",
    "luxembourg",
    "andorre",
    "monaco",
  ],
  espagne: ["portugal", "andorre", "maroc"],
  maroc: ["algerie", "mauritanie"],
  algerie: ["tunisie", "libye", "maroc", "mauritanie"],
  tunisie: ["libye"],
  italie: ["suisse", "autriche", "slovenie", "saint-marin"],
  grece: ["albanie", "macedoine du nord", "bulgarie", "turquie"],
  turquie: ["bulgarie", "georgie", "armenie", "iran", "irak", "syrie"],
  allemagne: [
    "belgique",
    "pays-bas",
    "danemark",
    "pologne",
    "republique tcheque",
    "autriche",
    "suisse",
    "luxembourg",
  ],
  autriche: ["republique tcheque", "slovaquie", "hongrie", "slovenie", "suisse", "liechtenstein"],
  suisse: ["liechtenstein"],
  belgique: ["pays-bas", "luxembourg"],
  croatie: ["slovenie", "hongrie", "serbie", "bosnie-herzegovine", "montenegro"],
  hongrie: ["slovaquie", "ukraine", "roumanie", "serbie", "slovenie"],
  pologne: ["republique tcheque", "slovaquie", "ukraine", "bielorussie", "lituanie"],
  "republique tcheque": ["slovaquie"],
  roumanie: ["serbie", "bulgarie", "ukraine", "moldavie"],
  "royaume-uni": ["irlande"],
  egypte: ["libye", "soudan", "israel"],
  "emirats arabes unis": ["oman", "arabie saoudite"],
  "arabie saoudite": ["jordanie", "irak", "koweit", "qatar", "oman", "yemen"],
  israel: ["jordanie", "liban", "egypte"],
};

/** Index symétrique des frontières, construit une fois au chargement du module. */
const BORDERS: Map<string, Set<string>> = (() => {
  const index = new Map<string, Set<string>>();
  const link = (a: string, b: string) => {
    const set = index.get(a) ?? new Set<string>();
    set.add(b);
    index.set(a, set);
  };
  for (const [country, neighbours] of Object.entries(LAND_BORDERS)) {
    for (const neighbour of neighbours) {
      link(country, neighbour);
      link(neighbour, country);
    }
  }
  // « Tchéquie » et « République tchèque » désignent le même pays : les deux
  // formes circulent dans les données du site.
  const tcheque = index.get("republique tcheque");
  if (tcheque) index.set("tchequie", tcheque);
  return index;
})();

/** Zone d'un pays, ou null quand nous ne l'avons pas rangé (long-courrier). */
export function countryZone(country: string | null | undefined): CountryZone | null {
  if (!country) return null;
  return ZONE_BY_COUNTRY[normalizeCountry(country)] ?? null;
}

/** Les deux pays partagent-ils une frontière terrestre ? */
export function shareLandBorder(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  if (!a || !b) return false;
  return BORDERS.get(normalizeCountry(a))?.has(normalizeCountry(b)) ?? false;
}

/**
 * Deux pays sont-ils « voisins » au sens du maillage : même zone de voyage, ou
 * frontière commune. Un pays comparé à lui-même ne l'est pas — c'est la
 * priorité 1, traitée à part.
 */
export function areNeighbourCountries(
  a: string | null | undefined,
  b: string | null | undefined,
): boolean {
  if (!a || !b) return false;
  if (normalizeCountry(a) === normalizeCountry(b)) return false;
  const zoneA = countryZone(a);
  if (zoneA && zoneA === countryZone(b)) return true;
  return shareLandBorder(a, b);
}

/**
 * Article défini d'un pays, pour écrire « vers l'Italie », « vers le Maroc »,
 * « vers les Pays-Bas » ou « vers Malte ». Stocké plutôt que deviné : aucune
 * règle ne dit qu'« Islande » est féminin et « Israël » sans article.
 */
const COUNTRY_ARTICLE: Record<string, "le " | "la " | "l'" | "les " | ""> = {
  algerie: "l'",
  allemagne: "l'",
  andorre: "l'",
  "arabie saoudite": "l'",
  autriche: "l'",
  bahrein: "le ",
  belgique: "la ",
  bulgarie: "la ",
  canada: "le ",
  chypre: "",
  "coree du sud": "la ",
  croatie: "la ",
  danemark: "le ",
  egypte: "l'",
  "emirats arabes unis": "les ",
  espagne: "l'",
  "etats-unis": "les ",
  finlande: "la ",
  france: "la ",
  grece: "la ",
  "hong kong": "",
  hongrie: "la ",
  indonesie: "l'",
  irlande: "l'",
  islande: "l'",
  israel: "",
  italie: "l'",
  japon: "le ",
  jordanie: "la ",
  liban: "le ",
  libye: "la ",
  luxembourg: "le ",
  malte: "",
  maroc: "le ",
  mexique: "le ",
  monaco: "",
  norvege: "la ",
  oman: "",
  "pays-bas": "les ",
  pologne: "la ",
  portugal: "le ",
  qatar: "le ",
  "republique tcheque": "la ",
  roumanie: "la ",
  "royaume-uni": "le ",
  senegal: "le ",
  serbie: "la ",
  slovaquie: "la ",
  slovenie: "la ",
  suede: "la ",
  suisse: "la ",
  tchequie: "la ",
  thailande: "la ",
  tunisie: "la ",
  turquie: "la ",
};

/**
 * Nom d'un pays précédé de son article, prêt à suivre « vers » : « vers
 * l'Italie », « vers le Maroc », « vers Malte ». Un pays inconnu sort sans
 * article plutôt qu'avec un article faux.
 */
export function countryWithArticle(country: string): string {
  const article = COUNTRY_ARTICLE[normalizeCountry(country)] ?? "";
  return `${article}${country}`;
}
