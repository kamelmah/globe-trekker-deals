/**
 * Photo d'illustration d'une ville, récupérée automatiquement.
 *
 * POURQUOI. Les pages générées — trajets rédigés par `rediger-routes`, guides
 * publiés depuis /destinations-proposes — ont une photo de leur ville quand
 * quelqu'un l'a déposée dans `city-photos`, ou quand elle fait partie des
 * vingt-quatre villes curées. Partout ailleurs, c'est le visuel neutre : juste,
 * mais muet. Ce module va chercher une photo de CETTE ville pour le reste du
 * catalogue, et n'en retourne aucune plutôt qu'une mauvaise.
 *
 * Il ne remplace pas `city-photos` : une photo choisie et légendée à la main
 * reste devant (voir `CityPicture`). Il couvre les centaines de villes qui
 * n'auront jamais leur entrée écrite une par une.
 *
 * CHAÎNE DE REPLI, dans cet ordre :
 *   1. Wikipédia (fr) — la vignette de l'article de la ville. C'est la source
 *      la plus sûre sur le lien ville ↔ image : l'article porte le nom de la
 *      ville et sa photo de résumé la représente.
 *   2. Pexels — banque de photos libres, interrogée sur « <ville> city ». La
 *      correspondance n'y est que textuelle : rien ne garantit que la photo a
 *      été prise dans la ville. C'est un repli, pas une source de premier rang.
 *   3. null — l'appelant garde alors son visuel local, curé ou neutre. Jamais
 *      d'URL cassée ni d'image vide enregistrée en base.
 *
 * CE MODULE NE LÈVE JAMAIS. Une API tierce indisponible vaut « pas d'image » :
 * une tâche planifiée ne doit pas échouer parce qu'une photo manque, et un
 * texte déjà généré ne doit pas être perdu pour autant.
 */

import { imageWikimediaALargeur, plusGrandeLargeurJusqua } from "@/lib/city-image.shared";
import { SITE_NAME, SITE_URL } from "@/lib/site";

/**
 * Wikimedia impose un User-Agent identifiant l'application et donnant un moyen
 * de contact ; sans lui, les requêtes sont refusées ou limitées.
 * https://meta.wikimedia.org/wiki/User-Agent_policy
 */
const USER_AGENT = `${SITE_NAME}/1.0 (${SITE_URL}; contact@trouvemonvol.fr)`;

/**
 * Une API tierce lente ne doit pas manger le budget d'une fonction planifiée :
 * `rediger-routes` dispose d'une trentaine de secondes, dont l'essentiel part
 * dans la génération du texte. Passé ce délai, on considère qu'il n'y a pas
 * d'image.
 */
const DELAI_MS = 6000;

/** Largeur visée : les bannières sont rendues en 1200 × 630. */
const LARGEUR_CIBLE = 1280;

/** En deçà, la vignette est une icône ou un blason, pas une photo de ville. */
const LARGEUR_MINIMALE = 320;

/**
 * Domaines des images produites par cette chaîne.
 *
 * Sert au backfill à reconnaître une URL « suspecte » : une image qui ne vient
 * ni de Wikimedia ni de Pexels n'a pas été posée ici et mérite d'être reprise.
 *
 * Les domaines, pas les hôtes : Wikimedia sert ses vignettes depuis
 * `thumb.wikimedia.org` ou `upload.wikimedia.org` selon les cas, et rien ne
 * garantit que la liste ne s'allongera pas.
 */
const DOMAINES_CONNUS = ["wikimedia.org", "pexels.com"];

/** Vrai si l'URL provient bien de la chaîne ci-dessus. */
export function estImageDeConfiance(url: string | null | undefined): boolean {
  if (!url) return false;
  try {
    const hote = new URL(url).hostname;
    return DOMAINES_CONNUS.some((connu) => hote === connu || hote.endsWith(`.${connu}`));
  } catch {
    return false;
  }
}

/* -------------------------------------------------------------------------- */
/* Cache de passage                                                            */
/* -------------------------------------------------------------------------- */

/**
 * Une même ville revient plusieurs fois dans un seul passage : Marrakech est la
 * destination de six trajets de la liste blanche, et le backfill la croise dans
 * les deux tables. Le cache retient la promesse, pas seulement le résultat, pour
 * que deux appels simultanés ne fassent qu'une requête.
 *
 * Il vit le temps du processus — un passage de fonction planifiée, une
 * exécution du script de backfill. Aucune invalidation n'est nécessaire : au
 * passage suivant, l'instance est neuve.
 */
const cache = new Map<string, Promise<string | null>>();

/** Le catalogue compte ~680 destinations ; la borne protège un serveur au long cours. */
const CACHE_MAX = 1000;

function cleCache(ville: string, pays?: string | null): string {
  return `${normaliser(ville)}|${pays ? normaliser(pays) : ""}`;
}

function normaliser(valeur: string): string {
  return valeur.normalize("NFD").replace(/[̀-ͯ]/g, "").trim().toLowerCase();
}

/* -------------------------------------------------------------------------- */
/* Wikipédia                                                                   */
/* -------------------------------------------------------------------------- */

type ResumeWikipedia = {
  type?: string;
  title?: string;
  thumbnail?: { source?: string; width?: number; height?: number };
  originalimage?: { source?: string; width?: number; height?: number };
};

/**
 * Demande la vignette dans une largeur utilisable.
 *
 * Le résumé Wikipédia renvoie une vignette de 330 px de large, illisible en
 * bannière de 1200 px. Les URL de Wikimedia portent la largeur demandée dans
 * leur dernier segment (« …/330px-Fichier.jpg ») : on la réécrit.
 *
 * Deux bornes, et pas une de moins. Ne jamais dépasser le fichier d'origine :
 * Wikimedia refuse d'agrandir. Et ne demander qu'une des largeurs qu'elle sert
 * réellement (voir `city-image.shared`) : `min(1280, original)` produisait
 * sinon des adresses comme « /900px-… », refusées en 400 et enregistrées telles
 * quelles en base — une image cassée que rien n'aurait signalée avant qu'elle
 * ne s'affiche.
 *
 * Les paramètres `utm_*` que l'API accole servent sa propre mesure d'audience ;
 * ils sont retirés avant d'écrire l'URL en base, où elle vivra des mois.
 */
function agrandir(vignette: string, largeurOriginale: number | undefined): string {
  const propre = vignette.split("?")[0] ?? vignette;
  const plafond = Math.min(LARGEUR_CIBLE, largeurOriginale ?? LARGEUR_CIBLE);
  const largeur = plusGrandeLargeurJusqua(plafond);
  // Fichier d'origine plus petit que la plus petite largeur servie : la
  // vignette du résumé reste la seule adresse valable.
  if (largeur === null) return propre;
  return imageWikimediaALargeur(propre, largeur);
}

/**
 * Vignette de l'article français de la ville, ou null.
 *
 * Trois cas sont écartés plutôt que retournés : une page d'homonymie (le nom
 * désigne aussi une rivière ou une personne, l'image ne serait pas celle de la
 * ville), un rendu de SVG (blason, carte de localisation) et une vignette trop
 * petite pour être une photo.
 */
async function depuisWikipedia(ville: string): Promise<string | null> {
  const url = `https://fr.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(ville)}`;
  const reponse = await fetch(url, {
    headers: { "User-Agent": USER_AGENT, Accept: "application/json" },
    signal: AbortSignal.timeout(DELAI_MS),
  });
  if (!reponse.ok) {
    // 404 = pas d'article de ce nom, cas courant et sans gravité : on passe au
    // repli sans bruit. Le reste mérite une trace.
    if (reponse.status !== 404) {
      console.warn(`[image-ville] Wikipédia ${reponse.status} pour « ${ville} »`);
    }
    return null;
  }

  const resume = (await reponse.json()) as ResumeWikipedia;
  if (resume.type === "disambiguation") return null;

  const source = resume.thumbnail?.source;
  if (!source) return null;

  /*
   * Le rendu d'un SVG n'est jamais une photo : c'est le drapeau, le blason ou la
   * carte de localisation que Wikipédia met en tête quand l'article n'a pas de
   * vue de la ville. Mesuré sur le catalogue, le cas touche Séville, Palma et
   * Djerba, entre autres — trois pages qui auraient affiché un drapeau en
   * bannière. Elles passent au repli Pexels.
   */
  if (source.toLowerCase().includes(".svg")) return null;

  // Un fichier d'origine plus petit qu'une vignette est une icône, pas une
  // photo. Quand l'API ne donne pas la taille d'origine, on laisse passer :
  // c'est la vignette elle-même qui sera servie, dans sa largeur d'origine.
  const largeurOriginale = resume.originalimage?.width;
  if (largeurOriginale !== undefined && largeurOriginale < LARGEUR_MINIMALE) return null;

  return agrandir(source, largeurOriginale);
}

/* -------------------------------------------------------------------------- */
/* Pexels                                                                      */
/* -------------------------------------------------------------------------- */

type ReponsePexels = {
  photos?: { src?: { large?: string; large2x?: string; original?: string } }[];
};

/** Première photo Pexels correspondant à la ville, ou null. */
async function depuisPexels(ville: string): Promise<string | null> {
  const cle = process.env["PEXELS_API_KEY"];
  if (!cle) return null;

  // `orientation=landscape` : les bannières sont en 1200 × 630, un portrait y
  // serait recadré au point de ne plus rien montrer.
  const url =
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(`${ville} city`)}` +
    `&per_page=1&orientation=landscape`;
  const reponse = await fetch(url, {
    headers: { Authorization: cle },
    signal: AbortSignal.timeout(DELAI_MS),
  });
  if (!reponse.ok) {
    console.warn(`[image-ville] Pexels ${reponse.status} pour « ${ville} »`);
    return null;
  }

  const payload = (await reponse.json()) as ReponsePexels;
  const src = payload.photos?.[0]?.src;
  // `large2x` fait 1880 px de large, `large` 940 : le premier tient la bannière,
  // le second sert de repli quand Pexels ne le fournit pas.
  return src?.large2x ?? src?.large ?? src?.original ?? null;
}

/* -------------------------------------------------------------------------- */
/* Point d'entrée                                                              */
/* -------------------------------------------------------------------------- */

async function chercher(ville: string): Promise<string | null> {
  try {
    const wikipedia = await depuisWikipedia(ville);
    if (wikipedia) return wikipedia;
  } catch (error) {
    console.warn(`[image-ville] Wikipédia indisponible pour « ${ville} »`, error);
  }

  try {
    const pexels = await depuisPexels(ville);
    if (pexels) return pexels;
  } catch (error) {
    console.warn(`[image-ville] Pexels indisponible pour « ${ville} »`, error);
  }

  console.warn(`[image-ville] aucune image trouvée pour « ${ville} »`);
  return null;
}

/**
 * URL d'une photo de la ville, ou null quand aucune source n'en donne.
 *
 * Ne lève jamais. Le `pays` ne sert qu'à distinguer deux villes homonymes dans
 * le cache — les deux API sont interrogées sur le seul nom de ville, comme
 * l'attend leur index.
 */
export async function getCityImage(
  ville: string | null | undefined,
  pays?: string | null,
): Promise<string | null> {
  const nom = ville?.trim();
  if (!nom) return null;

  const cle = cleCache(nom, pays);
  const dejaVue = cache.get(cle);
  if (dejaVue) return dejaVue;

  const recherche = chercher(nom).catch((error) => {
    // Filet : `chercher` traite déjà ses erreurs, mais une image manquante ne
    // doit en aucun cas remonter jusqu'à l'appelant.
    console.error(`[image-ville] échec inattendu pour « ${nom} »`, error);
    return null;
  });

  if (cache.size >= CACHE_MAX) cache.clear();
  cache.set(cle, recherche);
  return recherche;
}

/** Vide le cache. Réservé aux tests et aux scripts qui veulent forcer un relevé. */
export function resetCityImageCache(): void {
  cache.clear();
}
