import { SITE_URL } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";
import {
  SITEMAP_MAX_ROUTES,
  SITEMAP_SEGMENT_SIZE,
  chunk,
  urlsetXml,
  xmlResponse,
} from "@/lib/sitemap-xml";

/** Segment de sitemap des pages /vols générées depuis le mode budget. */
export const Route = createFileRoute("/sitemap-vols/$page.xml")({
  server: {
    handlers: {
      GET: async ({ request, params }) => {
        const origin = SITE_URL;
        const page = Number.parseInt((params as Record<string, string>)["page.xml"] ?? "", 10);
        if (!Number.isFinite(page) || page < 1) {
          return new Response("Segment de sitemap inconnu", { status: 404 });
        }

        const { listWorldRouteSlugs } = await import("@/lib/route-pages.server");
        const curated = new Set(DESTINATIONS.map((d) => d.slug));
        const generated = (await listWorldRouteSlugs(SITEMAP_MAX_ROUTES)).filter(
          (slug) => !curated.has(slug),
        );
        const segment = chunk(generated, SITEMAP_SEGMENT_SIZE)[page - 1] ?? [];

        return xmlResponse(
          urlsetXml(
            origin,
            segment.map((slug) => ({
              loc: `/vols/${slug}`,
              priority: "0.6",
              changefreq: "weekly",
            })),
          ),
        );
      },
    },
  },
});
