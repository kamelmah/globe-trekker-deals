/** Helpers partagés pour le sitemap index et ses segments. */

export type SitemapEntry = {
  loc: string;
  changefreq?: string;
  priority?: string;
  /** Date ISO (YYYY-MM-DD) de dernière modification connue. Omis si inconnue plutôt qu'inventé. */
  lastmod?: string;
};

export const SITEMAP_SEGMENT_SIZE = 500;

export function xmlResponse(body: string): Response {
  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}

export function urlsetXml(origin: string, entries: SitemapEntry[]): string {
  const urls = entries
    .map((entry) =>
      [
        "  <url>",
        `    <loc>${origin}${entry.loc}</loc>`,
        entry.lastmod ? `    <lastmod>${entry.lastmod}</lastmod>` : null,
        entry.changefreq ? `    <changefreq>${entry.changefreq}</changefreq>` : null,
        entry.priority ? `    <priority>${entry.priority}</priority>` : null,
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

export function sitemapIndexXml(origin: string, paths: string[]): string {
  const items = paths
    .map((path) => `  <sitemap>\n    <loc>${origin}${path}</loc>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${items}
</sitemapindex>
`;
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}
