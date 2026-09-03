/**
 * Texte alternatif des vignettes de ville, écrit ville par ville.
 *
 * Forme retenue : « <Ville>, <Pays> ». Court, factuel, vérifiable — c'est ce
 * qu'un lecteur d'écran doit entendre à la place d'une vignette qui n'illustre
 * qu'un lien vers la fiche du trajet.
 *
 * ÉCRIT, PAS CALCULÉ. Le gabarit précédent produisait « Ambiance de voyage
 * évoquant Ibiza : quartier portuaire d'Europe du Nord, canal et bateaux
 * amarrés » — une trentaine de mots recyclés d'une ville à l'autre, et faux :
 * Ibiza et Venise n'ont pas de canal nordique. Une valeur écrite se corrige ;
 * un gabarit se contente de propager son erreur. C'est aussi pour cela que MLA
 * porte « Malte » et non « Malte, Malte », et HKG « Hong Kong » tout court.
 *
 * Pourquoi ici et pas en base : il n'existe aucune table de villes dans
 * Supabase (le référentiel vient de l'API Travelpayouts, les villes desservies
 * de `route-whitelist.ts`). Créer une table pour 90 chaînes constantes
 * ajouterait une requête au rendu de chaque page. Pourquoi pas dans
 * `route-whitelist.ts`, où vivent les noms français : ce fichier est GÉNÉRÉ,
 * tout ajout à la main y serait écrasé au prochain `refresh-route-whitelist`.
 *
 * Clé : code IATA de ville, comme partout ailleurs dans le site.
 */
export const CITY_PHOTO_ALT: Record<string, string> = {
  AAE: "Annaba, Algérie",
  AGA: "Agadir, Maroc",
  AGP: "Malaga, Espagne",
  AJA: "Ajaccio, France",
  ALC: "Alicante, Espagne",
  ALG: "Alger, Algérie",
  AMS: "Amsterdam, Pays-Bas",
  ARN: "Stockholm, Suède",
  ATH: "Athènes, Grèce",
  AYT: "Antalya, Turquie",
  BCN: "Barcelone, Espagne",
  BER: "Berlin, Allemagne",
  BES: "Brest, France",
  BIA: "Bastia, France",
  BJA: "Béjaïa, Algérie",
  BKK: "Bangkok, Thaïlande",
  BRU: "Bruxelles, Belgique",
  BUD: "Budapest, Hongrie",
  BUH: "Bucarest, Roumanie",
  CAG: "Cagliari, Italie",
  CAI: "Le Caire, Égypte",
  CFU: "Corfou, Grèce",
  CLY: "Calvi, France",
  CMN: "Casablanca, Maroc",
  CPH: "Copenhague, Danemark",
  CTA: "Catane, Italie",
  CZL: "Constantine, Algérie",
  DBV: "Dubrovnik, Croatie",
  DJE: "Djerba, Tunisie",
  DKR: "Dakar, Sénégal",
  DOH: "Doha, Qatar",
  DPS: "Bali, Indonésie",
  DUB: "Dublin, Irlande",
  DXB: "Dubaï, Émirats arabes unis",
  FAO: "Faro, Portugal",
  FEZ: "Fès, Maroc",
  FRA: "Francfort, Allemagne",
  FSC: "Figari, France",
  GVA: "Genève, Suisse",
  HER: "Héraklion, Grèce",
  HKG: "Hong Kong",
  HRG: "Hurghada, Égypte",
  IBZ: "Ibiza, Espagne",
  ICN: "Séoul, Corée du Sud",
  IST: "Istanbul, Turquie",
  IZM: "Izmir, Turquie",
  JED: "Djeddah, Arabie saoudite",
  KEF: "Reykjavik, Islande",
  KRK: "Cracovie, Pologne",
  LAX: "Los Angeles, États-Unis",
  LIL: "Lille, France",
  LIS: "Lisbonne, Portugal",
  LON: "Londres, Royaume-Uni",
  LYS: "Lyon, France",
  MAD: "Madrid, Espagne",
  MEX: "Mexico, Mexique",
  MIA: "Miami, États-Unis",
  MIL: "Milan, Italie",
  MIR: "Monastir, Tunisie",
  MLA: "Malte",
  MPL: "Montpellier, France",
  MRS: "Marseille, France",
  MUC: "Munich, Allemagne",
  NAP: "Naples, Italie",
  NCE: "Nice, France",
  NDR: "Nador, Maroc",
  NTE: "Nantes, France",
  NYC: "New York, États-Unis",
  OLB: "Olbia, Italie",
  OPO: "Porto, Portugal",
  ORN: "Oran, Algérie",
  OUD: "Oujda, Maroc",
  PAR: "Paris, France",
  PMI: "Palma, Espagne",
  PMO: "Palerme, Italie",
  PRG: "Prague, République tchèque",
  QSF: "Sétif, Algérie",
  RAK: "Marrakech, Maroc",
  RHO: "Rhodes, Grèce",
  ROM: "Rome, Italie",
  SPU: "Split, Croatie",
  SSH: "Charm el-Cheikh, Égypte",
  SVQ: "Séville, Espagne",
  SXB: "Strasbourg, France",
  TLM: "Tlemcen, Algérie",
  TLS: "Toulouse, France",
  TNG: "Tanger, Maroc",
  TUN: "Tunis, Tunisie",
  TYO: "Tokyo, Japon",
  VCE: "Venise, Italie",
  VIE: "Vienne, Autriche",
  WAW: "Varsovie, Pologne",
  YUL: "Montréal, Canada",
  ZRH: "Zurich, Suisse",
};

/**
 * Alt d'une vignette de ville. Renvoie la valeur écrite quand la ville est
 * connue — c'est le cas de toutes celles que le site relie aujourd'hui.
 *
 * Le repli « Ville, Pays » ne sert qu'aux villes pas encore inscrites ci-dessus
 * (une route ajoutée à la liste blanche sans passer ici). Il reste court et
 * factuel, mais c'est un dépannage : la bonne correction est d'ajouter la
 * ligne. Sans ville connue, pas d'alt inventé — chaîne vide, l'image est
 * décorative et les lecteurs d'écran l'ignorent au lieu d'annoncer un lieu faux.
 */
export function cityPhotoAlt(
  code?: string | null,
  city?: string | null,
  country?: string | null,
): string {
  const written = code ? CITY_PHOTO_ALT[code.toUpperCase()] : undefined;
  if (written) return written;
  if (city && country) return `${city}, ${country}`;
  return city ?? "";
}
