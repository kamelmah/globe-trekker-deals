import alg from "@/assets/dest/alg.jpg";
import algWebp from "@/assets/dest/alg.webp";
import ams from "@/assets/dest/ams.jpg";
import amsWebp from "@/assets/dest/ams.webp";
import ath from "@/assets/dest/ath.jpg";
import athWebp from "@/assets/dest/ath.webp";
import bcn from "@/assets/dest/bcn.jpg";
import bcnWebp from "@/assets/dest/bcn.webp";
import bkk from "@/assets/dest/bkk.jpg";
import bkkWebp from "@/assets/dest/bkk.webp";
import ber from "@/assets/dest/ber.jpg";
import berWebp from "@/assets/dest/ber.webp";
import bud from "@/assets/dest/bud.jpg";
import budWebp from "@/assets/dest/bud.webp";
import cmn from "@/assets/dest/cmn.jpg";
import cmnWebp from "@/assets/dest/cmn.webp";
import cph from "@/assets/dest/cph.jpg";
import cphWebp from "@/assets/dest/cph.webp";
import defaultImg from "@/assets/dest/default.jpg";
import defaultImgWebp from "@/assets/dest/default.webp";
import genericCoast from "@/assets/dest/generic/coast.jpg";
import genericCoastWebp from "@/assets/dest/generic/coast.webp";
import genericHarbour from "@/assets/dest/generic/harbour.jpg";
import genericHarbourWebp from "@/assets/dest/generic/harbour.webp";
import genericLake from "@/assets/dest/generic/lake.jpg";
import genericLakeWebp from "@/assets/dest/generic/lake.webp";
import genericMedina from "@/assets/dest/generic/medina.jpg";
import genericMedinaWebp from "@/assets/dest/generic/medina.webp";
import genericMountain from "@/assets/dest/generic/mountain.jpg";
import genericMountainWebp from "@/assets/dest/generic/mountain.webp";
import genericNightCity from "@/assets/dest/generic/nightcity.jpg";
import genericNightCityWebp from "@/assets/dest/generic/nightcity.webp";
import genericOldTown from "@/assets/dest/generic/oldtown.jpg";
import genericOldTownWebp from "@/assets/dest/generic/oldtown.webp";
import genericSkyline from "@/assets/dest/generic/skyline.jpg";
import genericSkylineWebp from "@/assets/dest/generic/skyline.webp";
import genericTropical from "@/assets/dest/generic/tropical.jpg";
import genericTropicalWebp from "@/assets/dest/generic/tropical.webp";
import dxb from "@/assets/dest/dxb.jpg";
import dxbWebp from "@/assets/dest/dxb.webp";
import ist from "@/assets/dest/ist.jpg";
import istWebp from "@/assets/dest/ist.webp";
import lis from "@/assets/dest/lis.jpg";
import lisWebp from "@/assets/dest/lis.webp";
import lon from "@/assets/dest/lon.jpg";
import lonWebp from "@/assets/dest/lon.webp";
import mad from "@/assets/dest/mad.jpg";
import madWebp from "@/assets/dest/mad.webp";
import mil from "@/assets/dest/mil.jpg";
import milWebp from "@/assets/dest/mil.webp";
import nyc from "@/assets/dest/nyc.jpg";
import nycWebp from "@/assets/dest/nyc.webp";
import opo from "@/assets/dest/opo.jpg";
import opoWebp from "@/assets/dest/opo.webp";
import prg from "@/assets/dest/prg.jpg";
import prgWebp from "@/assets/dest/prg.webp";
import rak from "@/assets/dest/rak.jpg";
import rakWebp from "@/assets/dest/rak.webp";
import rom from "@/assets/dest/rom.jpg";
import romWebp from "@/assets/dest/rom.webp";
import svq from "@/assets/dest/svq.jpg";
import svqWebp from "@/assets/dest/svq.webp";
import tun from "@/assets/dest/tun.jpg";
import tunWebp from "@/assets/dest/tun.webp";
import tyo from "@/assets/dest/tyo.jpg";
import tyoWebp from "@/assets/dest/tyo.webp";
import vie from "@/assets/dest/vie.jpg";
import vieWebp from "@/assets/dest/vie.webp";

export type DestinationImage = { src: string; webp: string; alt: string };

/** Visuels curés par code IATA de ville. Fallback générique sinon. */
const BY_CODE: Record<string, DestinationImage> = {
  RAK: { src: rak, webp: rakWebp, alt: "Minaret de la Koutoubia et toits ocre de la médina de Marrakech au coucher du soleil" },
  LIS: { src: lis, webp: lisWebp, alt: "Tramway jaune dans une rue en pente de Lisbonne avec vue sur le Tage" },
  BCN: { src: bcn, webp: bcnWebp, alt: "Sagrada Familia et toits de Barcelone face à la mer Méditerranée" },
  NYC: { src: nyc, webp: nycWebp, alt: "Skyline de Manhattan à New York au coucher du soleil depuis Brooklyn" },
  IST: { src: ist, webp: istWebp, alt: "Mosquées et bateaux sur le Bosphore à Istanbul au crépuscule" },
  ROM: { src: rom, webp: romWebp, alt: "Colisée de Rome illuminé par la lumière dorée du soir" },
  ATH: { src: ath, webp: athWebp, alt: "Acropole et Parthénon surplombant les maisons blanches d'Athènes" },
  MAD: { src: mad, webp: madWebp, alt: "Architecture historique du centre de Madrid sous un ciel bleu" },
  PRG: { src: prg, webp: prgWebp, alt: "Château de Prague et pont sur la Vltava à l'aube" },
  BUD: { src: bud, webp: budWebp, alt: "Parlement de Budapest illuminé au bord du Danube" },
  OPO: { src: opo, webp: opoWebp, alt: "Maisons colorées du quartier de la Ribeira à Porto au bord du Douro" },
  CMN: { src: cmn, webp: cmnWebp, alt: "Mosquée Hassan II de Casablanca au bord de l'océan Atlantique" },
  BKK: { src: bkk, webp: bkkWebp, alt: "Temple Wat Arun de Bangkok au coucher du soleil sur le fleuve Chao Phraya" },
  DXB: { src: dxb, webp: dxbWebp, alt: "Burj Khalifa et gratte-ciels de Dubaï à l'heure dorée" },
  TYO: { src: tyo, webp: tyoWebp, alt: "Temple japonais, cerisiers en fleurs et mont Fuji au-dessus de Tokyo" },
  ALG: { src: alg, webp: algWebp, alt: "Front de mer blanc de la baie d'Alger sur la Méditerranée" },
  LON: { src: lon, webp: lonWebp, alt: "Tower Bridge enjambant la Tamise à Londres à l'heure dorée" },
  AMS: { src: ams, webp: amsWebp, alt: "Canal d'Amsterdam bordé de maisons à pignons et vélos sur un pont" },
  MIL: { src: mil, webp: milWebp, alt: "Façade de marbre du Duomo de Milan et sa piazza au coucher du soleil" },
  BER: { src: ber, webp: berWebp, alt: "Porte de Brandebourg illuminée et tour de télévision de Berlin au crépuscule" },
  VIE: { src: vie, webp: vieWebp, alt: "Palais de Schönbrunn à Vienne et ses jardins baroques fleuris" },
  SVQ: { src: svq, webp: svqWebp, alt: "Arcades et ponts de céramique de la Plaza de España à Séville au soleil du soir" },
  CPH: { src: cph, webp: cphWebp, alt: "Maisons colorées et voiliers en bois du port de Nyhavn à Copenhague" },
  TUN: { src: tun, webp: tunWebp, alt: "Maisons blanches et bleues de Sidi Bou Saïd près de Tunis face à la mer" },
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
  londres: BY_CODE["LON"]!,
  london: BY_CODE["LON"]!,
  amsterdam: BY_CODE["AMS"]!,
  milan: BY_CODE["MIL"]!,
  milano: BY_CODE["MIL"]!,
  berlin: BY_CODE["BER"]!,
  vienne: BY_CODE["VIE"]!,
  vienna: BY_CODE["VIE"]!,
  wien: BY_CODE["VIE"]!,
  seville: BY_CODE["SVQ"]!,
  sevilla: BY_CODE["SVQ"]!,
  copenhague: BY_CODE["CPH"]!,
  copenhagen: BY_CODE["CPH"]!,
};

function normalize(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

/**
 * Visuels génériques d'ambiance : aucun visuel curé n'existant pour les ~680
 * destinations du catalogue, on choisit une scène cohérente avec la région
 * (ou, à défaut, de façon déterministe) au lieu d'afficher la même image
 * pour toutes les villes.
 */
type Scene = { src: string; webp: string; description: string };

const SCENES: Record<string, Scene> = {
  oldtown: { src: genericOldTown, webp: genericOldTownWebp, description: "ruelle pavée bordée de façades colorées d'un centre historique européen" },
  coast: { src: genericCoast, webp: genericCoastWebp, description: "port méditerranéen aux eaux turquoise et aux toits de tuiles" },
  harbour: { src: genericHarbour, webp: genericHarbourWebp, description: "quartier portuaire d'Europe du Nord, canal et bateaux amarrés" },
  mountain: { src: genericMountain, webp: genericMountainWebp, description: "vallée verdoyante dominée par des sommets enneigés" },
  lake: { src: genericLake, webp: genericLakeWebp, description: "lac au lever du soleil au milieu de collines" },
  skyline: { src: genericSkyline, webp: genericSkylineWebp, description: "skyline de gratte-ciels au crépuscule au bord de l'eau" },
  medina: { src: genericMedina, webp: genericMedinaWebp, description: "ruelle voûtée aux murs ocre éclairée par des lanternes" },
  tropical: { src: genericTropical, webp: genericTropicalWebp, description: "plage de sable blanc bordée de cocotiers et de lagon turquoise" },
  nightcity: { src: genericNightCity, webp: genericNightCityWebp, description: "avenue animée d'une grande ville asiatique illuminée de néons" },
};

const SCENE_KEYS = Object.keys(SCENES);

/** Ambiances alternatives cohérentes avec une ambiance régionale donnée. */
const SCENE_VARIANTS: Record<string, string[]> = {
  oldtown: ["harbour", "lake"],
  coast: ["oldtown", "harbour"],
  harbour: ["oldtown", "lake"],
  mountain: ["lake", "oldtown"],
  lake: ["mountain", "oldtown"],
  skyline: ["nightcity"],
  medina: ["coast", "oldtown"],
  tropical: ["coast"],
  nightcity: ["skyline"],
};

/** Scène privilégiée selon le pays (français ou anglais, sans accents). */
const SCENE_BY_COUNTRY: Record<string, string> = {
  // Bassin méditerranéen
  espagne: "coast", spain: "coast", italie: "coast", italy: "coast",
  grece: "coast", greece: "coast", portugal: "coast", croatie: "coast",
  croatia: "coast", chypre: "coast", cyprus: "coast", malte: "coast", malta: "coast",
  // Villes historiques d'Europe centrale et de l'Ouest
  france: "oldtown", allemagne: "oldtown", germany: "oldtown",
  autriche: "oldtown", austria: "oldtown", "republique tcheque": "oldtown",
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
  const hash = hashOf(normalize(city ?? "destination"));
  const regional = country ? SCENE_BY_COUNTRY[normalize(country)] : undefined;
  // Deux ambiances possibles par région : deux villes voisines n'ont pas le même visuel.
  const pool = regional ? [regional, ...(SCENE_VARIANTS[regional] ?? [])] : SCENE_KEYS;
  const key = pool[hash % pool.length]!;
  const scene = SCENES[key] ?? SCENES["oldtown"]!;
  const label = city ? `Ambiance de voyage évoquant ${city}` : "Ambiance de voyage";
  return { src: scene.src, webp: scene.webp, alt: `${label} : ${scene.description}` };
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
  return { src: defaultImg, webp: defaultImgWebp, alt: "Destination de voyage — panorama urbain à l'heure dorée" };
}
