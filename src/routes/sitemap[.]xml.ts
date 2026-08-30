import { createFileRoute } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";
import { POSTS } from "@/data/posts";

function siteOrigin(request: Request): string {
  return new URL(request.url).origin;
}

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const origin = siteOrigin(request);
        const today = new Date().toISOString().slice(0, 10);

        const { listWorldRouteSlugs } = await import("@/lib/route-pages.server");
        const curated = new Set(DESTINATIONS.map((d) => d.slug));
        const generated = (await listWorldRouteSlugs()).filter((slug) => !curated.has(slug));

        const urls: { loc: string; priority: string; changefreq: string }[] = [
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
          ...generated.map((slug) => ({
            loc: `/vols/${slug}`,
            priority: "0.6",
            changefreq: "weekly",
          })),
          ...POSTS.map((p) => ({
            loc: `/conseils/${p.slug}`,
            priority: "0.7",
            changefreq: "monthly",
          })),
        ];

        const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${origin}${url.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

        return new Response(body, {
          headers: {
            "Content-Type": "application/xml; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
          },
        });
      },
    },
  },
});
