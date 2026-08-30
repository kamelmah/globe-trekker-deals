import alg from "@/assets/dest/alg.jpg";
import ath from "@/assets/dest/ath.jpg";
import bcn from "@/assets/dest/bcn.jpg";
import bkk from "@/assets/dest/bkk.jpg";
import bud from "@/assets/dest/bud.jpg";
import cmn from "@/assets/dest/cmn.jpg";
import defaultImg from "@/assets/dest/default.jpg";
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

/** Retourne un visuel pour une destination (code IATA et/ou nom de ville). */
export function getDestinationImage(code?: string | null, city?: string | null): DestinationImage {
  if (code) {
    const hit = BY_CODE[code.toUpperCase()];
    if (hit) return hit;
  }
  if (city) {
    const hit = BY_CITY[normalize(city)];
    if (hit) return hit;
  }
  const label = city ? `Vue de ${city}` : "Destination de voyage";
  return { src: defaultImg, alt: `${label} — panorama urbain au bord de l'eau à l'heure dorée` };
}
