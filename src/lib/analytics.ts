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
 * `data-api` est OBLIGATOIRE dès qu'on proxyfie : sans lui, le script continue
 * d'envoyer ses événements à plausible.io et le contournement ne sert à rien.
 *
 * 2. Rien ne se charge tant que `VITE_ANALYTICS_DOMAIN` n'est pas défini.
 *
 * Le domaine est celui déclaré dans le compte de mesure. Tant qu'il est vide,
 * aucun script n'est injecté, aucun événement n'est envoyé, et les pages
 * légales n'annoncent pas un outil qui n'existe pas — elles lisent la même
 * constante (voir /cookies et /confidentialite). C'est ce qui empêche le cas
 * classique où la politique de confidentialité décrit un traitement que le site
 * ne fait pas, ou l'inverse.
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
 * __root.tsx passent tous deux par `analyticsDomain()`.
 *
 * Les PROPRIÉTÉS envoyées avec un événement ne doivent jamais permettre de
 * reconnaître quelqu'un : un code IATA, un nom de ville ou un nom de vendeur,
 * jamais une adresse e-mail ni une chaîne de recherche libre.
 */

/** Préfixe servi par le proxy Netlify. Change ici = change dans netlify.toml. */
export const ANALYTICS_PREFIX = "/stats";

/** Script de mesure, servi sous notre domaine. */
export const ANALYTICS_SCRIPT_SRC = `${ANALYTICS_PREFIX}/js/script.js`;

/** Endpoint de collecte, servi sous notre domaine (attribut `data-api`). */
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
};

declare global {
  interface Window {
    plausible?: PlausibleFn;
  }
}

/**
 * Domaine déclaré côté outil de mesure, ou `null` si la mesure est désactivée.
 *
 * Sert de commutateur unique : le `<script>`, l'envoi d'événements et les
 * paragraphes des pages légales en dépendent tous.
 */
export function analyticsDomain(): string | null {
  const domain = import.meta.env["VITE_ANALYTICS_DOMAIN"];
  if (typeof domain !== "string") return null;
  const trimmed = domain.trim();
  return trimmed.length > 0 ? trimmed : null;
}

/** Vrai quand la mesure d'audience est réellement active sur le site. */
export function analyticsEnabled(): boolean {
  return analyticsDomain() !== null;
}

/**
 * Amorce posée AVANT le chargement du script.
 *
 * Le script est `defer` : il ne s'exécute qu'après l'analyse du document. Sans
 * cette file d'attente, un clic sur un lien affiché tôt — donc le clic le plus
 * intéressant, celui du visiteur pressé — appellerait `window.plausible` avant
 * qu'il existe et serait perdu. La file rejoue les appels au chargement.
 */
export const ANALYTICS_BOOTSTRAP =
  "window.plausible=window.plausible||function(){(window.plausible.q=window.plausible.q||[]).push(arguments)};";

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
