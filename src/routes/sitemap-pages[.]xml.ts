import { createFileRoute } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";
import { POSTS } from "@/data/posts";
import { urlsetXml, xmlResponse, type SitemapEntry } from "@/lib/sitemap-xml";

/** Pages fixes, pages de liaison éditoriales et articles du blog. */
export const Route = createFileRoute("/sitemap-pages.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const entries: SitemapEntry[] = [
          { loc: "/", priority: "1.0", changefreq: "daily" },
          { loc: "/mode-budget", priority: "0.9", changefreq: "daily" },
          { loc: "/conseils", priority: "0.7", changefreq: "weekly" },
          { loc: "/faq", priority: "0.6", changefreq: "monthly" },
          { loc: "/comment-on-gagne-de-l-argent", priority: "0.5", changefreq: "monthly" },
          { loc: "/mentions-legales", priority: "0.2", changefreq: "yearly" },
          { loc: "/cgu", priority: "0.2", changefreq: "yearly" },
          { loc: "/confidentialite", priority: "0.2", changefreq: "yearly" },
          { loc: "/cookies", priority: "0.2", changefreq: "yearly" },
          ...DESTINATIONS.map((d) => ({
            loc: `/vols/${d.slug}`,
            priority: "0.9",
            changefreq: "daily",
          })),
          ...POSTS.map((p) => ({
            loc: `/conseils/${p.slug}`,
            priority: "0.7",
            changefreq: "monthly",
          })),
        ];

        return xmlResponse(urlsetXml(origin, entries));
      },
    },
  },
});
