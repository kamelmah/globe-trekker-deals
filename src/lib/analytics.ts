/**
 * Mesure d'audience : configuration et envoi d'événements.
 *
 * TROIS DÉCISIONS SONT PRISES ICI, ET NULLE PART AILLEURS.
 *
 * 1. Le script est servi depuis NOTRE domaine, sous /stats/.
 *
 * Un `<script src="https://plausible.io/js/script.js">` est bloqué par la
 * plupart des bloqueurs de publicité, qui filtrent sur le NOM DE DOMAINE : la
 * moitié du trafic disparaît des rapports, et celle qui disparaît n'est pas
 * tirée au hasard (navigateurs équipés, visiteurs techniques, mobiles sous
 * navigateur alternatif). Netlify sert donc le script et l'endpoint depuis
 * `/stats/…` par une règle de proxy (voir netlify.toml) : même origine que le
 * site, plus de nom de domaine tiers à filtrer.
 *
 * Proxyfier le FICHIER ne suffit pas : sans `endpoint`, le script chargé depuis
 * /stats/ continuerait d'envoyer ses événements à plausible.io, et le domaine
 * tiers réapparaîtrait à chaque mesure. C'est `plausible.init({ endpoint })`
 * qui referme le contournement — l'équivalent, pour le script actuel, de
 * l'ancien attribut `data-api`.
 *
 * 2. Rien ne se charge tant que `VITE_PLAUSIBLE_SCRIPT_ID` n'est pas défini.
 *
 * C'est l'identifiant que Plausible met dans le nom du fichier (`pa-…`). Tant
 * qu'il est vide, aucun script n'est injecté, aucun événement n'est envoyé, et
 * les pages légales n'annoncent pas un outil qui n'existe pas — elles lisent la
 * même constante (voir /cookies et /confidentialite). C'est ce qui empêche le
 * cas classique où la politique de confidentialité décrit un traitement que le
 * site ne fait pas, ou l'inverse.
 *
 * `import.meta.env` UNIQUEMENT, jamais `process.env` : la valeur est inlinée à
 * la compilation, donc identique côté serveur et côté navigateur. Un repli sur
 * `process.env` ne serait lu qu'au rendu serveur et produirait un HTML qui ne
 * correspond pas à l'hydratation.
 *
 * 3. Aucun cookie, aucun identifiant, aucune donnée personnelle.
 *
 * Le script retenu (Plausible) ne dépose rien sur l'appareil et n'agrège que
 * des compteurs. C'est pour ça qu'il n'est pas derrière le bandeau de
 * consentement : il n'y a pas de dépôt à consentir. Si ce choix devait changer
 * — outil différent, ou lecture stricte de la recommandation CNIL — le
 * branchement se fait en un seul endroit : `trackEvent` et le `<script>` de
 * __root.tsx passent tous deux par `analyticsScriptId()`.
 *
 * Les PROPRIÉTÉS envoyées avec un événement ne doivent jamais permettre de
 * reconnaître quelqu'un : un code IATA, un nom de ville ou un nom de vendeur,
 * jamais une adresse e-mail ni une chaîne de recherche libre.
 */

/** Préfixe servi par le proxy Netlify. Change ici = change dans netlify.toml. */
export const ANALYTICS_PREFIX = "/stats";

/**
 * Endpoint de collecte, servi sous notre domaine.
 *
 * Passé à `plausible.init({ endpoint })`. C'est l'équivalent, pour le script
 * actuel, de l'ancien attribut `data-api` : sans lui, le script continuerait
 * d'écrire chez l'éditeur et le proxy ne servirait qu'à charger le fichier.
 */
export const ANALYTICS_API_URL = `${ANALYTICS_PREFIX}/api/event`;

/**
 * Les seuls événements que le site envoie.
 *
 * Une union fermée plutôt qu'une chaîne libre : un nom d'événement mal
 * orthographié dans un composant ne remonte jamais d'erreur à l'exécution, il
 * crée silencieusement une deuxième courbe dans les rapports. Ici, il ne
 * compile pas.
 */
export const ANALYTICS_EVENTS = ["alerte_creee", "clic_hotel", "clic_vol_sortant"] as const;

export type AnalyticsEvent = (typeof ANALYTICS_EVENTS)[number];

/** Valeurs acceptées en propriété d'événement : rien de nominatif. */
export type AnalyticsProps = Record<string, string | number | boolean>;

type PlausibleFn = ((event: string, options?: { props?: AnalyticsProps }) => void) & {
  q?: unknown[];
  init?: (options?: Record<string, unknown>) => void;
  o?: Record<string, unknown>;
};

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/**
 * Identifiant du script fourni par le compte de mesure, ou `null` si la mesure
 * est désactivée.
 *
 * C'est l'identifiant qui figure DANS LE NOM DU FICHIER servi par Plausible
 * (`pa-…`), et non un domaine : le script actuel porte l'identité du site dans
 * son URL, là où l'ancien la lisait dans un attribut `data-domain`. Il n'y a
 * donc plus d'attribut à poser sur la balise.
 *
 * Rien de secret là-dedans — il est visible dans le HTML de chaque visiteur.
 * S'il vit quand même dans une variable d'environnement, c'est pour deux
 * raisons : les préversions Netlify peuvent ne pas la définir et ne polluent
 * alors pas les statistiques de production, et les pages légales lisent le même
 * commutateur que le script.
 *
 * Sert de commutateur unique : le `<script>`, l'envoi d'événements et les
 * paragraphes de /cookies et /confidentialite en dépendent tous.
 */
export function analyticsScriptId(): string | null {
  const id = import.meta.env["VITE_PLAUSIBLE_SCRIPT_ID"];
  if (typeof id !== "string") return null;
  const trimmed = id.trim();
  // Le nom de fichier part directement dans une URL : on n'y laisse passer que
  // ce que Plausible produit réellement, jamais un chemin.
  return /^[A-Za-z0-9_-]+$/.test(trimmed) ? trimmed : null;
}

/** URL du script, servie sous notre domaine. `null` si la mesure est désactivée. */
export function analyticsScriptSrc(): string | null {
  const id = analyticsScriptId();
  return id ? `${ANALYTICS_PREFIX}/js/${id}.js` : null;
}

/** Vrai quand la mesure d'audience est réellement active sur le site. */
export function analyticsEnabled(): boolean {
  return analyticsScriptId() !== null;
}

/**
 * Amorce posée à côté du script.
 *
 * Reprend mot pour mot celle fournie par Plausible, avec une seule addition :
 * `endpoint`, qui renvoie la collecte sur notre proxy.
 *
 * Les deux `||` font tout le travail et rendent l'ordre des balises
 * indifférent. Le script est `async` : il peut s'exécuter avant ou après ce
 * bloc. S'il est arrivé le premier, `plausible` et `plausible.init` sont les
 * vrais et `init` s'applique immédiatement ; sinon, la souche met les appels en
 * file d'attente et retient les options, que le script rejoue en arrivant.
 *
 * Sans cette file, un clic sur un lien affiché tôt — donc le clic le plus
 * intéressant, celui du visiteur pressé — serait perdu.
 */
export const ANALYTICS_BOOTSTRAP =
  "window.plausible=window.plausible||function(){(plausible.q=plausible.q||[]).push(arguments)}," +
  "plausible.init=plausible.init||function(i){plausible.o=i||{}};" +
  `plausible.init({endpoint:${JSON.stringify(ANALYTICS_API_URL)}});`;

/**
 * Envoie un événement, ou ne fait rien.
 *
 * Ne fait rien dans trois cas parfaitement normaux, et c'est voulu : rendu
 * serveur, mesure désactivée, script bloqué malgré le proxy. Aucun de ces cas
 * ne doit casser l'action du visiteur — la mesure d'un clic ne vaut jamais le
 * clic lui-même.
 */
export function trackEvent(event: AnalyticsEvent, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;
  const plausible = window.plausible;
  if (typeof plausible !== "function") return;
  try {
    plausible(event, props ? { props } : undefined);
  } catch {
    /* la mesure ne doit jamais interrompre la navigation */
  }
}
