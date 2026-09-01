import { SITE_URL } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { INDEXED_LEGACY_SLUGS, ROUTE_WHITELIST } from "@/data/route-whitelist";
import { SITEMAP_SEGMENT_SIZE, sitemapIndexXml, xmlResponse } from "@/lib/sitemap-xml";

/** Sitemap index : segmente les pages /vols pour un crawl efficace. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: () => {
        const origin = SITE_URL;
        const routes = ROUTE_WHITELIST.length + INDEXED_LEGACY_SLUGS.length;
        const segments = Math.max(1, Math.ceil(routes / SITEMAP_SEGMENT_SIZE));

        const paths = ["/sitemap-pages.xml"];
        for (let page = 1; page <= segments; page += 1) {
          paths.push(`/sitemap-vols/${page}.xml`);
        }

        return xmlResponse(sitemapIndexXml(origin, paths));
      },
    },
  },
});
