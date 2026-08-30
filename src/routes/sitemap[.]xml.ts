import { createFileRoute } from "@tanstack/react-router";

import {
  SITEMAP_MAX_ROUTES,
  SITEMAP_SEGMENT_SIZE,
  sitemapIndexXml,
  xmlResponse,
} from "@/lib/sitemap-xml";

/** Sitemap index : segmente les pages /vols générées pour un crawl efficace. */
export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = new URL(request.url).origin;
        const { listWorldRouteSlugs } = await import("@/lib/route-pages.server");
        const generated = await listWorldRouteSlugs(SITEMAP_MAX_ROUTES);
        const segments = Math.max(1, Math.ceil(generated.length / SITEMAP_SEGMENT_SIZE));

        const paths = ["/sitemap-pages.xml"];
        for (let page = 1; page <= segments; page += 1) {
          paths.push(`/sitemap-vols/${page}.xml`);
        }

        return xmlResponse(sitemapIndexXml(origin, paths));
      },
    },
  },
});
