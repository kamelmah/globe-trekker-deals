import alg from "@/assets/dest/alg.jpg";
import algWebp from "@/assets/dest/alg.webp";
import algThumb from "@/assets/dest/alg-thumb.jpg";
import algThumbWebp from "@/assets/dest/alg-thumb.webp";
import ams from "@/assets/dest/ams.jpg";
import amsWebp from "@/assets/dest/ams.webp";
import amsThumb from "@/assets/dest/ams-thumb.jpg";
import amsThumbWebp from "@/assets/dest/ams-thumb.webp";
import ath from "@/assets/dest/ath.jpg";
import athWebp from "@/assets/dest/ath.webp";
import athThumb from "@/assets/dest/ath-thumb.jpg";
import athThumbWebp from "@/assets/dest/ath-thumb.webp";
import bcn from "@/assets/dest/bcn.jpg";
import bcnWebp from "@/assets/dest/bcn.webp";
import bcnThumb from "@/assets/dest/bcn-thumb.jpg";
import bcnThumbWebp from "@/assets/dest/bcn-thumb.webp";
import bkk from "@/assets/dest/bkk.jpg";
import bkkWebp from "@/assets/dest/bkk.webp";
import bkkThumb from "@/assets/dest/bkk-thumb.jpg";
import bkkThumbWebp from "@/assets/dest/bkk-thumb.webp";
import ber from "@/assets/dest/ber.jpg";
import berWebp from "@/assets/dest/ber.webp";
import berThumb from "@/assets/dest/ber-thumb.jpg";
import berThumbWebp from "@/assets/dest/ber-thumb.webp";
import bud from "@/assets/dest/bud.jpg";
import budWebp from "@/assets/dest/bud.webp";
import budThumb from "@/assets/dest/bud-thumb.jpg";
import budThumbWebp from "@/assets/dest/bud-thumb.webp";
import cmn from "@/assets/dest/cmn.jpg";
import cmnWebp from "@/assets/dest/cmn.webp";
import cmnThumb from "@/assets/dest/cmn-thumb.jpg";
import cmnThumbWebp from "@/assets/dest/cmn-thumb.webp";
import cph from "@/assets/dest/cph.jpg";
import cphWebp from "@/assets/dest/cph.webp";
import cphThumb from "@/assets/dest/cph-thumb.jpg";
import cphThumbWebp from "@/assets/dest/cph-thumb.webp";
import { photoVille } from "@/data/city-photos";

import defaultImg from "@/assets/dest/default.jpg";
import defaultImgWebp from "@/assets/dest/default.webp";
import defaultImgThumb from "@/assets/dest/default-thumb.jpg";
import defaultImgThumbWebp from "@/assets/dest/default-thumb.webp";
import dxb from "@/assets/dest/dxb.jpg";
import dxbWebp from "@/assets/dest/dxb.webp";
import dxbThumb from "@/assets/dest/dxb-thumb.jpg";
import dxbThumbWebp from "@/assets/dest/dxb-thumb.webp";
import ist from "@/assets/dest/ist.jpg";
import istWebp from "@/assets/dest/ist.webp";
import istThumb from "@/assets/dest/ist-thumb.jpg";
import istThumbWebp from "@/assets/dest/ist-thumb.webp";
import lis from "@/assets/dest/lis.jpg";
import lisWebp from "@/assets/dest/lis.webp";
import lisThumb from "@/assets/dest/lis-thumb.jpg";
import lisThumbWebp from "@/assets/dest/lis-thumb.webp";
import lon from "@/assets/dest/lon.jpg";
import lonWebp from "@/assets/dest/lon.webp";
import lonThumb from "@/assets/dest/lon-thumb.jpg";
import lonThumbWebp from "@/assets/dest/lon-thumb.webp";
import mad from "@/assets/dest/mad.jpg";
import madWebp from "@/assets/dest/mad.webp";
import madThumb from "@/assets/dest/mad-thumb.jpg";
import madThumbWebp from "@/assets/dest/mad-thumb.webp";
import mil from "@/assets/dest/mil.jpg";
import milWebp from "@/assets/dest/mil.webp";
import milThumb from "@/assets/dest/mil-thumb.jpg";
import milThumbWebp from "@/assets/dest/mil-thumb.webp";
import nyc from "@/assets/dest/nyc.jpg";
import nycWebp from "@/assets/dest/nyc.webp";
import nycThumb from "@/assets/dest/nyc-thumb.jpg";
import nycThumbWebp from "@/assets/dest/nyc-thumb.webp";
import opo from "@/assets/dest/opo.jpg";
import opoWebp from "@/assets/dest/opo.webp";
import opoThumb from "@/assets/dest/opo-thumb.jpg";
import opoThumbWebp from "@/assets/dest/opo-thumb.webp";
import prg from "@/assets/dest/prg.jpg";
import prgWebp from "@/assets/dest/prg.webp";
import prgThumb from "@/assets/dest/prg-thumb.jpg";
import prgThumbWebp from "@/assets/dest/prg-thumb.webp";
import rak from "@/assets/dest/rak.jpg";
import rakWebp from "@/assets/dest/rak.webp";
import rakThumb from "@/assets/dest/rak-thumb.jpg";
import rakThumbWebp from "@/assets/dest/rak-thumb.webp";
import rom from "@/assets/dest/rom.jpg";
import romWebp from "@/assets/dest/rom.webp";
import romThumb from "@/assets/dest/rom-thumb.jpg";
import romThumbWebp from "@/assets/dest/rom-thumb.webp";
import svq from "@/assets/dest/svq.jpg";
import svqWebp from "@/assets/dest/svq.webp";
import svqThumb from "@/assets/dest/svq-thumb.jpg";
import svqThumbWebp from "@/assets/dest/svq-thumb.webp";
import tun from "@/assets/dest/tun.jpg";
import tunWebp from "@/assets/dest/tun.webp";
import tunThumb from "@/assets/dest/tun-thumb.jpg";
import tunThumbWebp from "@/assets/dest/tun-thumb.webp";
import tyo from "@/assets/dest/tyo.jpg";
import tyoWebp from "@/assets/dest/tyo.webp";
import tyoThumb from "@/assets/dest/tyo-thumb.jpg";
import tyoThumbWebp from "@/assets/dest/tyo-thumb.webp";
import vie from "@/assets/dest/vie.jpg";
import vieWebp from "@/assets/dest/vie.webp";
import vieThumb from "@/assets/dest/vie-thumb.jpg";
import vieThumbWebp from "@/assets/dest/vie-thumb.webp";

export type DestinationImage = {
  src: string;
  webp: string;
  thumb: string;
  thumbWebp: string;
  alt: string;
};

/** Visuels curés par code IATA de ville. Fallback générique sinon. */
const BY_CODE: Record<string, DestinationImage> = {
  RAK: {
    src: rak,
    webp: rakWebp,
    thumb: rakThumb,
    thumbWebp: rakThumbWebp,
    alt: "Minaret de la Koutoubia et toits ocre de la médina de Marrakech au coucher du soleil",
  },
  LIS: {
    src: lis,
    webp: lisWebp,
    thumb: lisThumb,
    thumbWebp: lisThumbWebp,
    alt: "Tramway jaune dans une rue en pente de Lisbonne avec vue sur le Tage",
  },
  BCN: {
    src: bcn,
    webp: bcnWebp,
    thumb: bcnThumb,
    thumbWebp: bcnThumbWebp,
    alt: "Sagrada Familia et toits de Barcelone face à la mer Méditerranée",
  },
  NYC: {
    src: nyc,
    webp: nycWebp,
    thumb: nycThumb,
    thumbWebp: nycThumbWebp,
    alt: "Skyline de Manhattan à New York au coucher du soleil depuis Brooklyn",
  },
  IST: {
    src: ist,
    webp: istWebp,
    thumb: istThumb,
    thumbWebp: istThumbWebp,
    alt: "Mosquées et bateaux sur le Bosphore à Istanbul au crépuscule",
  },
  ROM: {
    src: rom,
    webp: romWebp,
    thumb: romThumb,
    thumbWebp: romThumbWebp,
    alt: "Colisée de Rome illuminé par la lumière dorée du soir",
  },
  ATH: {
    src: ath,
    webp: athWebp,
    thumb: athThumb,
    thumbWebp: athThumbWebp,
    alt: "Acropole et Parthénon surplombant les maisons blanches d'Athènes",
  },
  MAD: {
    src: mad,
    webp: madWebp,
    thumb: madThumb,
    thumbWebp: madThumbWebp,
    alt: "Architecture historique du centre de Madrid sous un ciel bleu",
  },
  PRG: {
    src: prg,
    webp: prgWebp,
    thumb: prgThumb,
    thumbWebp: prgThumbWebp,
    alt: "Château de Prague et pont sur la Vltava à l'aube",
  },
  BUD: {
    src: bud,
    webp: budWebp,
    thumb: budThumb,
    thumbWebp: budThumbWebp,
    alt: "Parlement de Budapest illuminé au bord du Danube",
  },
  OPO: {
    src: opo,
    webp: opoWebp,
    thumb: opoThumb,
    thumbWebp: opoThumbWebp,
    alt: "Maisons colorées du quartier de la Ribeira à Porto au bord du Douro",
  },
  CMN: {
    src: cmn,
    webp: cmnWebp,
    thumb: cmnThumb,
    thumbWebp: cmnThumbWebp,
    alt: "Mosquée Hassan II de Casablanca au bord de l'océan Atlantique",
  },
  BKK: {
    src: bkk,
    webp: bkkWebp,
    thumb: bkkThumb,
    thumbWebp: bkkThumbWebp,
    alt: "Temple Wat Arun de Bangkok au coucher du soleil sur le fleuve Chao Phraya",
  },
  DXB: {
    src: dxb,
    webp: dxbWebp,
    thumb: dxbThumb,
    thumbWebp: dxbThumbWebp,
    alt: "Burj Khalifa et gratte-ciels de Dubaï à l'heure dorée",
  },
  TYO: {
    src: tyo,
    webp: tyoWebp,
    thumb: tyoThumb,
    thumbWebp: tyoThumbWebp,
    alt: "Temple japonais, cerisiers en fleurs et mont Fuji au-dessus de Tokyo",
  },
  ALG: {
    src: alg,
    webp: algWebp,
    thumb: algThumb,
    thumbWebp: algThumbWebp,
    alt: "Front de mer blanc de la baie d'Alger sur la Méditerranée",
  },
  LON: {
    src: lon,
    webp: lonWebp,
    thumb: lonThumb,
    thumbWebp: lonThumbWebp,
    alt: "Tower Bridge enjambant la Tamise à Londres à l'heure dorée",
  },
  AMS: {
    src: ams,
    webp: amsWebp,
    thumb: amsThumb,
    thumbWebp: amsThumbWebp,
    alt: "Canal d'Amsterdam bordé de maisons à pignons et vélos sur un pont",
  },
  MIL: {
    src: mil,
    webp: milWebp,
    thumb: milThumb,
    thumbWebp: milThumbWebp,
    alt: "Façade de marbre du Duomo de Milan et sa piazza au coucher du soleil",
  },
  BER: {
    src: ber,
    webp: berWebp,
    thumb: berThumb,
    thumbWebp: berThumbWebp,
    alt: "Porte de Brandebourg illuminée et tour de télévision de Berlin au crépuscule",
  },
  VIE: {
    src: vie,
    webp: vieWebp,
    thumb: vieThumb,
    thumbWebp: vieThumbWebp,
    alt: "Palais de Schönbrunn à Vienne et ses jardins baroques fleuris",
  },
  SVQ: {
    src: svq,
    webp: svqWebp,
    thumb: svqThumb,
    thumbWebp: svqThumbWebp,
    alt: "Arcades et ponts de céramique de la Plaza de España à Séville au soleil du soir",
  },
  CPH: {
    src: cph,
    webp: cphWebp,
    thumb: cphThumb,
    thumbWebp: cphThumbWebp,
    alt: "Maisons colorées et voiliers en bois du port de Nyhavn à Copenhague",
  },
  TUN: {
    src: tun,
    webp: tunWebp,
    thumb: tunThumb,
    thumbWebp: tunThumbWebp,
    alt: "Maisons blanches et bleues de Sidi Bou Saïd près de Tunis face à la mer",
  },
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
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
}

/**
 * Visuel neutre unique, servi pour toute ville sans photo renseignée.
 *
 * Un seul, et assumé comme tel. Il a remplacé une sélection automatique qui
 * choisissait une « ambiance » d'après le pays et un hachage du nom de ville :
 * douze photos de décor tournantes, dont aucune ne montrait la ville affichée,
 * mais qui portaient toutes son nom en texte alternatif. Sétif héritait d'une
 * médina marocaine, Ibiza d'un canal néerlandais. Répartir un mensonge sur
 * douze images ne le rend pas vrai, et c'est exactement ce que produisait ce
 * mécanisme : plus il variait, plus il paraissait crédible.
 *
 * Son alt décrit CETTE image et ne nomme aucune ville, puisqu'il n'en montre
 * aucune. C'est ce qui distingue un visuel d'illustration d'une photo de
 * destination, pour un lecteur d'écran comme pour un moteur de recherche.
 */
const VISUEL_NEUTRE: DestinationImage = {
  src: defaultImg,
  webp: defaultImgWebp,
  thumb: defaultImgThumb,
  thumbWebp: defaultImgThumbWebp,
  alt: "Destination de voyage — panorama urbain à l'heure dorée",
};

/**
 * Visuel d'une destination, par ordre de priorité décroissante.
 *
 * 1. La photo renseignée dans la table des villes (city-photos.ts). Elle prime
 *    sur tout : c'est la seule qui puisse être ajoutée sans toucher au code.
 * 2. Un visuel curé embarqué, pour les vingt-quatre villes qui en ont un. Même
 *    nature que le point 1 — une vraie photo de la ville, avec son alt écrit à
 *    la main — mais servie depuis le bundle plutôt que depuis /images.
 * 3. Le visuel neutre. Pas de troisième catégorie : soit on a une photo de la
 *    ville, soit on affiche une illustration qui ne prétend pas en être une.
 *
 * Le pays ne sert plus à rien ici et n'est donc plus demandé : il n'existait
 * que pour choisir une ambiance régionale.
 */
export function getDestinationImage(code?: string | null, city?: string | null): DestinationImage {
  return getDestinationPhoto(code, city) ?? VISUEL_NEUTRE;
}

/**
 * Les points 1 et 2 ci-dessus, sans le repli : `null` quand le site n'a pas de
 * photo DE CETTE VILLE.
 *
 * Le visuel neutre convient à une vignette posée au-dessus d'un titre qui dit
 * déjà la ville. Il ne convient pas à une grille de quatre destinations côte à
 * côte : quatre villes différentes y portaient la même image, et l'œil lit
 * quatre fois la même chose plutôt que quatre destinations. Là, l'appelant a
 * besoin de savoir qu'il n'y a pas de photo pour afficher autre chose — un
 * visuel calculé depuis le nom de la ville, donc distinct d'une ville à l'autre.
 */
export function getDestinationPhoto(
  code?: string | null,
  city?: string | null,
): DestinationImage | null {
  const photo = photoVille(code);
  if (photo) {
    return {
      // WebP servi aux deux sources : le fichier de la table EST un WebP, et
      // <picture> retombera dessus faute de mieux. Tous les navigateurs que le
      // site vise le lisent depuis 2020.
      src: photo.imageUrl,
      webp: photo.imageUrl,
      thumb: photo.imageThumbUrl,
      thumbWebp: photo.imageThumbUrl,
      alt: photo.imageAlt,
    };
  }
  if (code) {
    const hit = BY_CODE[code.toUpperCase()];
    if (hit) return hit;
  }
  if (city) {
    const hit = BY_CITY[normalize(city)];
    if (hit) return hit;
  }
  return null;
}
