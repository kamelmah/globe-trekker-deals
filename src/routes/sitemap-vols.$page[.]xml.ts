import { SITE_URL } from "@/lib/site";
import { createFileRoute } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";
import { INDEXED_LEGACY_SLUGS, ROUTE_WHITELIST } from "@/data/route-whitelist";
import { SITEMAP_SEGMENT_SIZE, chunk, urlsetXml, xmlResponse } from "@/lib/sitemap-xml";

/**
 * Segment de sitemap des pages /vols.
 *
 * La source est désormais la LISTE BLANCHE, plus les quelques pages générées
 * déjà présentes dans l'index Google. Le balayage mondial ne pilote plus rien :
 * c'est lui qui produisait le millier de liaisons inexistantes que Google a
 * rejetées en bloc.
 */
export const Route = createFileRoute("/sitemap-vols/$page.xml")({
  server: {
    handlers: {
      GET: ({ params }) => {
        const origin = SITE_URL;
        const page = Number.parseInt((params as Record<string, string>)["page.xml"] ?? "", 10);
        if (!Number.isFinite(page) || page < 1) {
          return new Response("Segment de sitemap inconnu", { status: 404 });
        }

        // Les pages éditoriales sont déjà listées par sitemap-pages.xml.
        const curated = new Set(DESTINATIONS.map((d) => d.slug));
        const slugs = [...ROUTE_WHITELIST.map((r) => r.slug), ...INDEXED_LEGACY_SLUGS].filter(
          (slug) => !curated.has(slug),
        );
        const segment = chunk(slugs, SITEMAP_SEGMENT_SIZE)[page - 1] ?? [];

        return xmlResponse(
          urlsetXml(
            origin,
            segment.map((slug) => ({ loc: `/vols/${slug}` })),
          ),
        );
      },
    },
  },
});
