/**
 * Date de dernière modification réelle des pages qui n'en portent pas dans
 * leurs données.
 *
 * FICHIER GÉNÉRÉ : ne pas éditer à la main.
 * Régénérer avec `node scripts/refresh-page-lastmod.mjs`.
 *
 * Les dates viennent de l'historique Git — la seule date de modification
 * vérifiable dont nous disposons. Elles ne bougent que quand le contenu bouge,
 * à la différence d'une date de génération qui changerait à chaque déploiement
 * et signalerait du contenu automatisé plutôt que de la fraîcheur.
 *
 * Guides, articles, comparatifs et fiches formalités n'y figurent pas : ils
 * portent déjà un champ `updated` tenu à la main.
 */
export const PAGE_LASTMOD: Readonly<Record<string, string>> = {
  "/": "2026-09-01",
  "/comparatifs": "2026-09-01",
  "/conseils": "2026-09-01",
  "/conseils/destinations": "2026-09-01",
  "/conseils/formalites": "2026-09-01",
  "/contact": "2026-08-31",
  "/faq": "2026-09-01",
  "/hebergement": "2026-08-31",
  "/indemnisation": "2026-09-01",
  "/mode-budget": "2026-09-01",
  "/vols/lyon-tunis": "2026-09-01",
  "/vols/paris-alger": "2026-09-01",
  "/vols/paris-amsterdam": "2026-09-01",
  "/vols/paris-athenes": "2026-09-01",
  "/vols/paris-bali": "2026-09-01",
  "/vols/paris-bangkok": "2026-09-01",
  "/vols/paris-barcelone": "2026-09-01",
  "/vols/paris-berlin": "2026-09-01",
  "/vols/paris-birmingham": "2026-09-01",
  "/vols/paris-budapest": "2026-09-01",
  "/vols/paris-casablanca": "2026-09-01",
  "/vols/paris-copenhague": "2026-09-01",
  "/vols/paris-dakar": "2026-09-01",
  "/vols/paris-doha": "2026-09-01",
  "/vols/paris-dubai": "2026-09-01",
  "/vols/paris-dublin": "2026-09-01",
  "/vols/paris-gdansk": "2026-09-01",
  "/vols/paris-hong-kong": "2026-09-01",
  "/vols/paris-istanbul": "2026-09-01",
  "/vols/paris-le-caire": "2026-09-01",
  "/vols/paris-lisbonne": "2026-09-01",
  "/vols/paris-londres": "2026-09-01",
  "/vols/paris-los-angeles": "2026-09-01",
  "/vols/paris-madrid": "2026-09-01",
  "/vols/paris-marrakech": "2026-09-01",
  "/vols/paris-mexico": "2026-09-01",
  "/vols/paris-miami": "2026-09-01",
  "/vols/paris-milan": "2026-09-01",
  "/vols/paris-montreal": "2026-09-01",
  "/vols/paris-munich": "2026-09-01",
  "/vols/paris-new-york": "2026-09-01",
  "/vols/paris-porto": "2026-09-01",
  "/vols/paris-prague": "2026-09-01",
  "/vols/paris-reykjavik": "2026-09-01",
  "/vols/paris-rome": "2026-09-01",
  "/vols/paris-seoul": "2026-09-01",
  "/vols/paris-seville": "2026-09-01",
  "/vols/paris-stockholm": "2026-09-01",
  "/vols/paris-tokyo": "2026-09-01",
  "/vols/paris-trieste": "2026-09-01",
  "/vols/paris-vienne": "2026-09-01",
};

/** Date de dernière modification d'une page, ou undefined si inconnue. */
export function pageLastmod(route: string): string | undefined {
  return PAGE_LASTMOD[route];
}
