import alg from "@/assets/dest/alg.jpg";
import ath from "@/assets/dest/ath.jpg";
import bcn from "@/assets/dest/bcn.jpg";
import bkk from "@/assets/dest/bkk.jpg";
import bud from "@/assets/dest/bud.jpg";
import cmn from "@/assets/dest/cmn.jpg";
import defaultImg from "@/assets/dest/default.jpg";
import genericCoast from "@/assets/dest/generic/coast.jpg";
import genericHarbour from "@/assets/dest/generic/harbour.jpg";
import genericLake from "@/assets/dest/generic/lake.jpg";
import genericMedina from "@/assets/dest/generic/medina.jpg";
import genericMountain from "@/assets/dest/generic/mountain.jpg";
import genericNightCity from "@/assets/dest/generic/nightcity.jpg";
import genericOldTown from "@/assets/dest/generic/oldtown.jpg";
import genericSkyline from "@/assets/dest/generic/skyline.jpg";
import genericTropical from "@/assets/dest/generic/tropical.jpg";
import dxb from "@/assets/dest/dxb.jpg";
import ist from "@/assets/dest/ist.jpg";
import lis from "@/assets/dest/lis.jpg";
import mad from "@/assets/dest/mad.jpg";
import nyc from "@/assets/dest/nyc.jpg";
import opo from "@/assets/dest/opo.jpg";
import prg from "@/assets/dest/prg.jpg";
import rak from "@/assets/dest/rak.jpg";
import rom from "@/assets/dest/rom.jpg";
import tun from "@/assets/dest/tun.jpg";
import tyo from "@/assets/dest/tyo.jpg";

export type DestinationImage = { src: string; alt: string };

/** Visuels curés par code IATA de ville. Fallback générique sinon. */
const BY_CODE: Record<string, DestinationImage> = {
  RAK: { src: rak, alt: "Minaret de la Koutoubia et toits ocre de la médina de Marrakech au coucher du soleil" },
  LIS: { src: lis, alt: "Tramway jaune dans une rue en pente de Lisbonne avec vue sur le Tage" },
  BCN: { src: bcn, alt: "Sagrada Familia et toits de Barcelone face à la mer Méditerranée" },
  NYC: { src: nyc, alt: "Skyline de Manhattan à New York au coucher du soleil depuis Brooklyn" },
  IST: { src: ist, alt: "Mosquées et bateaux sur le Bosphore à Istanbul au crépuscule" },
  ROM: { src: rom, alt: "Colisée de Rome illuminé par la lumière dorée du soir" },
  ATH: { src: ath, alt: "Acropole et Parthénon surplombant les maisons blanches d'Athènes" },
  MAD: { src: mad, alt: "Architecture historique du centre de Madrid sous un ciel bleu" },
  PRG: { src: prg, alt: "Château de Prague et pont sur la Vltava à l'aube" },
  BUD: { src: bud, alt: "Parlement de Budapest illuminé au bord du Danube" },
  OPO: { src: opo, alt: "Maisons colorées du quartier de la Ribeira à Porto au bord du Douro" },
  CMN: { src: cmn, alt: "Mosquée Hassan II de Casablanca au bord de l'océan Atlantique" },
  BKK: { src: bkk, alt: "Temple Wat Arun de Bangkok au coucher du soleil sur le fleuve Chao Phraya" },
  DXB: { src: dxb, alt: "Burj Khalifa et gratte-ciels de Dubaï à l'heure dorée" },
  TYO: { src: tyo, alt: "Temple japonais, cerisiers en fleurs et mont Fuji au-dessus de Tokyo" },
  ALG: { src: alg, alt: "Front de mer blanc de la baie d'Alger sur la Méditerranée" },
  TUN: { src: tun, alt: "Maisons blanches et bleues de Sidi Bou Saïd près de Tunis face à la mer" },
};

const BY_CITY: Record<string, DestinationImage> = {
  marrakech: BY_CODE["RAK"]!,
  lisbonne: BY_CODE["LIS"]!,
  lisbon: BY_CODE["LIS"]!,
  barcelone: BY_CODE["BCN"]!,
  barcelona: BY_CODE["BCN"]!,
  "new york": BY_CODE["NYC"]!,
  istanbul: BY_CODE["IST"]!,
  rome: BY_CODE["ROM"]!,
  athenes: BY_CODE["ATH"]!,
  madrid: BY_CODE["MAD"]!,
  prague: BY_CODE["PRG"]!,
  budapest: BY_CODE["BUD"]!,
  porto: BY_CODE["OPO"]!,
  casablanca: BY_CODE["CMN"]!,
  bangkok: BY_CODE["BKK"]!,
  dubai: BY_CODE["DXB"]!,
  tokyo: BY_CODE["TYO"]!,
  alger: BY_CODE["ALG"]!,
  algiers: BY_CODE["ALG"]!,
  tunis: BY_CODE["TUN"]!,
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Visuels génériques d'ambiance : aucun visuel curé n'existant pour les ~680
 * destinations du catalogue, on choisit une scène cohérente avec la région
 * (ou, à défaut, de façon déterministe) au lieu d'afficher la même image
 * pour toutes les villes.
 */
type Scene = { src: string; description: string };

const SCENES: Record<string, Scene> = {
  oldtown: { src: genericOldTown, description: "ruelle pavée bordée de façades colorées d'un centre historique européen" },
  coast: { src: genericCoast, description: "port méditerranéen aux eaux turquoise et aux toits de tuiles" },
  harbour: { src: genericHarbour, description: "quartier portuaire d'Europe du Nord, canal et bateaux amarrés" },
  mountain: { src: genericMountain, description: "vallée verdoyante dominée par des sommets enneigés" },
  lake: { src: genericLake, description: "lac au lever du soleil au milieu de collines" },
  skyline: { src: genericSkyline, description: "skyline de gratte-ciels au crépuscule au bord de l'eau" },
  medina: { src: genericMedina, description: "ruelle voûtée aux murs ocre éclairée par des lanternes" },
  tropical: { src: genericTropical, description: "plage de sable blanc bordée de cocotiers et de lagon turquoise" },
  nightcity: { src: genericNightCity, description: "avenue animée d'une grande ville asiatique illuminée de néons" },
};

const SCENE_KEYS = Object.keys(SCENES);

/** Scène privilégiée selon le pays (français ou anglais, sans accents). */
const SCENE_BY_COUNTRY: Record<string, string> = {
  // Bassin méditerranéen
  espagne: "coast", spain: "coast", italie: "coast", italy: "coast",
  grece: "coast", greece: "coast", portugal: "coast", croatie: "coast",
  croatia: "coast", chypre: "coast", cyprus: "coast", malte: "coast", malta: "coast",
  // Villes historiques d'Europe centrale et de l'Ouest
  france: "oldtown", allemagne: "oldtown", germany: "oldtown",
  autriche: "oldtown", austria: "oldtown", republique tcheque: "oldtown",
  hongrie: "oldtown", hungary: "oldtown", pologne: "oldtown", poland: "oldtown",
  roumanie: "oldtown", romania: "oldtown", bulgarie: "oldtown", bulgaria: "oldtown",
  serbie: "oldtown", slovaquie: "oldtown", slovenie: "oldtown", belgique: "oldtown",
  belgium: "oldtown", luxembourg: "oldtown",
  // Europe du Nord
  "royaume-uni": "harbour", "united kingdom": "harbour", irlande: "harbour",
  ireland: "harbour", "pays-bas": "harbour", netherlands: "harbour",
  danemark: "harbour", denmark: "harbour", suede: "harbour", sweden: "harbour",
  norvege: "harbour", norway: "harbour", finlande: "harbour", finland: "harbour",
  estonie: "harbour", lettonie: "harbour", lituanie: "harbour", islande: "harbour",
  // Montagnes
  suisse: "mountain", switzerland: "mountain",
  // Afrique du Nord et Moyen-Orient
  maroc: "medina", morocco: "medina", tunisie: "medina", tunisia: "medina",
  algerie: "medina", algeria: "medina", egypte: "medina", egypt: "medina",
  jordanie: "medina", jordan: "medina", turquie: "medina", turkey: "medina",
  israel: "medina", liban: "medina",
  "emirats arabes unis": "skyline", "united arab emirates": "skyline",
  qatar: "skyline", "arabie saoudite": "skyline", oman: "medina", bahrein: "skyline",
  // Amériques
  "etats-unis": "skyline", "united states": "skyline", canada: "skyline",
  mexique: "tropical", mexico: "tropical", bresil: "tropical", brazil: "tropical",
  cuba: "tropical", "republique dominicaine": "tropical",
  argentine: "skyline", argentina: "skyline", chili: "mountain", chile: "mountain",
  perou: "mountain", peru: "mountain", colombie: "mountain", colombia: "mountain",
  // Asie / Océanie
  japon: "nightcity", japan: "nightcity", "coree du sud": "nightcity",
  "south korea": "nightcity", chine: "nightcity", china: "nightcity",
  "hong kong": "nightcity", taiwan: "nightcity", singapour: "skyline",
  singapore: "skyline", thailande: "tropical", thailand: "tropical",
  vietnam: "tropical", indonesie: "tropical", indonesia: "tropical",
  malaisie: "tropical", malaysia: "tropical", philippines: "tropical",
  maldives: "tropical", "sri lanka": "tropical", inde: "medina", india: "medina",
  nepal: "mountain", australie: "coast", australia: "coast",
  "nouvelle-zelande": "mountain", "new zealand": "mountain",
  // Afrique subsaharienne
  senegal: "coast", "afrique du sud": "coast", "south africa": "coast",
  kenya: "lake", tanzanie: "lake", tanzania: "lake", ethiopie: "lake",
  maurice: "tropical", mauritius: "tropical", seychelles: "tropical",
  "cap-vert": "tropical", reunion: "tropical",
};

/** Hachage stable d'une chaîne, pour répartir les villes sans pays connu. */
function hashOf(value: string): number {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) hash = (hash * 31 + value.charCodeAt(i)) % 1000003;
  return hash;
}

function genericImage(city?: string | null, country?: string | null): DestinationImage {
  const key =
    (country ? SCENE_BY_COUNTRY[normalize(country)] : undefined) ??
    SCENE_KEYS[hashOf(normalize(city ?? "destination")) % SCENE_KEYS.length]!;
  const scene = SCENES[key] ?? SCENES["oldtown"]!;
  const label = city ? `Ambiance de voyage évoquant ${city}` : "Ambiance de voyage";
  return { src: scene.src, alt: `${label} : ${scene.description}` };
}

/** Retourne un visuel pour une destination (code IATA, nom de ville, pays). */
export function getDestinationImage(
  code?: string | null,
  city?: string | null,
  country?: string | null,
): DestinationImage {
  if (code) {
    const hit = BY_CODE[code.toUpperCase()];
    if (hit) return hit;
  }
  if (city) {
    const hit = BY_CITY[normalize(city)];
    if (hit) return hit;
  }
  if (city || country) return genericImage(city, country);
  return { src: defaultImg, alt: "Destination de voyage — panorama urbain à l'heure dorée" };
}
