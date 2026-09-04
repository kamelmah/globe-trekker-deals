import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

import type { CityGuide } from "@/data/city-guides";

/**
 * Guides destinations générés depuis /destinations-proposes puis publiés
 * manuellement. Ils sont stockés en base (table guide_requests) et rendus par
 * les mêmes pages que les guides écrits en dur.
 */

/** Reconstruit un CityGuide depuis une ligne publiée (jamais de contenu inventé). */
function toGuide(row: {
  slug: string;
  city: string;
  country: string;
  origin: string;
  destination: string;
  route_slug: string;
  draft: unknown;
  image_url: string | null;
}): CityGuide | null {
  const draft = row.draft as Partial<CityGuide> | null;
  if (!draft?.intro || !Array.isArray(draft.sections) || !draft.practical) return null;
  return {
    slug: row.slug,
    city: row.city,
    country: row.country,
    routeSlug: row.route_slug,
    origin: row.origin,
    destination: row.destination,
    originCity: draft.originCity ?? "Paris",
    title: draft.title ?? `Que faire à ${row.city}`,
    metaTitle: draft.metaTitle ?? `Que faire à ${row.city} : guide voyage | TrouveMonVol`,
    description: draft.description ?? "",
    intro: draft.intro,
    readingMinutes: draft.readingMinutes ?? 6,
    updated: draft.updated ?? new Date().toISOString().slice(0, 10),
    imageUrl: row.image_url,
    practical: draft.practical,
    sections: draft.sections,
  };
}

const SELECT = "slug,city,country,origin,destination,route_slug,draft,image_url";

export const listPublishedGuides = createServerFn({ method: "GET" }).handler(
  async (): Promise<{ guides: CityGuide[] }> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data, error } = await supabaseAdmin
        .from("guide_requests")
        .select(SELECT)
        .eq("status", "publie")
        .order("published_at", { ascending: false });
      if (error) throw error;
      const guides = (data ?? [])
        .map((row) => toGuide(row))
        .filter((guide): guide is CityGuide => guide !== null);
      return { guides };
    } catch (error) {
      console.error("Lecture des guides publiés impossible", error);
      return { guides: [] };
    }
  },
);

export const publishedGuide = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().trim().min(1).max(80) }).parse(data))
  .handler(async ({ data }): Promise<{ guide: CityGuide | null }> => {
    try {
      const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
      const { data: row, error } = await supabaseAdmin
        .from("guide_requests")
        .select(SELECT)
        .eq("slug", data.slug)
        .eq("status", "publie")
        .maybeSingle();
      if (error) throw error;
      return { guide: row ? toGuide(row) : null };
    } catch (error) {
      console.error("Lecture du guide publié impossible", error);
      return { guide: null };
    }
  });
