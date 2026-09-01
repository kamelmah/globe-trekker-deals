/** Helpers partagés pour le sitemap. */

export type SitemapEntry = {
  loc: string;
  /**
   * Date ISO (AAAA-MM-JJ) de dernière modification RÉELLE du contenu.
   *
   * Omise quand nous ne la connaissons pas, plutôt qu'inventée : une date de
   * génération qui bouge tous les jours sur des centaines d'URL est un signal
   * de contenu automatisé, pas de fraîcheur.
   */
  lastmod?: string;
};

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

/**
 * `changefreq` et `priority` ne sont volontairement pas émis : Google les
 * ignore totalement depuis des années.
 */
export function urlsetXml(origin: string, entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) =>
      [
        "  <url>",
        `    <loc>${origin}${entry.loc}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}
