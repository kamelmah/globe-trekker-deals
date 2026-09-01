import { SITE_URL } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";
import { CITY_GUIDES } from "@/data/city-guides";
import { POSTS } from "@/data/posts";
import { COMPARISONS } from "@/data/comparisons";
import { urlsetXml, xmlResponse, type SitemapEntry } from "@/lib/sitemap-xml";

/** Pages fixes, pages de liaison éditoriales et articles du blog. */
export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = SITE_URL;
        // Le prix affiché sur les pages daily change en continu : lastmod = date
        // du build du sitemap. Pour guides et articles, on a une vraie date
        // d'édition (`updated`) : on l'utilise plutôt que d'inventer une date.
        const today = new Date().toISOString().slice(0, 10);
        const entries: SitemapEntry[] = [
          { loc: "/", priority: "1.0", changefreq: "daily", lastmod: today },
          { loc: "/mode-budget", priority: "0.9", changefreq: "daily", lastmod: today },
          { loc: "/conseils", priority: "0.7", changefreq: "weekly" },
          { loc: "/conseils/destinations", priority: "0.7", changefreq: "weekly" },
          { loc: "/comparatifs", priority: "0.6", changefreq: "weekly" },
          { loc: "/faq", priority: "0.6", changefreq: "monthly" },
          { loc: "/contact", priority: "0.5", changefreq: "monthly" },
          { loc: "/mentions-legales", priority: "0.2", changefreq: "yearly" },
          { loc: "/cgu", priority: "0.2", changefreq: "yearly" },
          { loc: "/confidentialite", priority: "0.2", changefreq: "yearly" },
          { loc: "/cookies", priority: "0.2", changefreq: "yearly" },
          ...DESTINATIONS.map((d) => ({
            loc: `/vols/${d.slug}`,
            priority: "0.9",
            changefreq: "daily",
            lastmod: today,
          })),
          ...CITY_GUIDES.map((g) => ({
            loc: `/conseils/destinations/${g.slug}`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: g.updated,
          })),
          ...POSTS.map((p) => ({
            loc: `/conseils/${p.slug}`,
            priority: "0.7",
            changefreq: "monthly",
            lastmod: p.updated,
          })),
          ...COMPARISONS.map((c) => ({
            loc: `/comparatifs/${c.slug}`,
            priority: "0.6",
            changefreq: "monthly",
            lastmod: c.updated,
          })),
        ];

        return xmlResponse(urlsetXml(origin, entries));
      },
    },
  },
});
