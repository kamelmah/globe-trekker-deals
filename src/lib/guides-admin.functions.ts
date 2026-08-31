import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Pilotage des guides destinations souhaités (/destinations-proposes).
 * Toutes ces fonctions sont protégées par le jeton d'administration
 * `ADMIN_LOGS_TOKEN`, jamais exposé au navigateur.
 */

export type GuideRequestRow = {
  id: string;
  slug: string;
  city: string;
  country: string;
  origin: string;
  destination: string;
  routeSlug: string;
  status: "souhaite" | "brouillon" | "publie";
  hasDraft: boolean;
  draftTitle: string | null;
  draftIntro: string | null;
  generatedAt: string | null;
  publishedAt: string | null;
  errorMessage: string | null;
  createdAt: string;
};

const tokenField = z.string().trim().min(8).max(200);

function slugifyCity(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function db() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

function guard(token: string): { ok: true } | { ok: false; message: string } {
  const expected = process.env["ADMIN_LOGS_TOKEN"];
  if (!expected) return { ok: false, message: "Jeton d'administration non configuré côté serveur." };
  if (token !== expected) return { ok: false, message: "Jeton invalide." };
  return { ok: true };
}

type DbRow = {
  id: string;
  slug: string;
  city: string;
  country: string;
  origin: string;
  destination: string;
  route_slug: string;
  status: string;
  draft: unknown;
  generated_at: string | null;
  published_at: string | null;
  error_message: string | null;
  created_at: string;
};

function mapRow(row: DbRow): GuideRequestRow {
  const draft = row.draft as { title?: string; intro?: string } | null;
  return {
    id: row.id,
    slug: row.slug,
    city: row.city,
    country: row.country,
    origin: row.origin,
    destination: row.destination,
    routeSlug: row.route_slug,
    status: (row.status as GuideRequestRow["status"]) ?? "souhaite",
    hasDraft: Boolean(draft?.intro),
    draftTitle: draft?.title ?? null,
    draftIntro: draft?.intro ?? null,
    generatedAt: row.generated_at,
    publishedAt: row.published_at,
    errorMessage: row.error_message,
    createdAt: row.created_at,
  };
}

const ROW_SELECT =
  "id,slug,city,country,origin,destination,route_slug,status,draft,generated_at,published_at,error_message,created_at";

async function readAll(): Promise<GuideRequestRow[]> {
  const supabase = await db();
  const { data, error } = await supabase
    .from("guide_requests")
    .select(ROW_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data ?? []).map((row) => mapRow(row as DbRow));
}

export const listGuideRequests = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: tokenField }).parse(data))
  .handler(async ({ data }) => {
    const check = guard(data.token);
    if (!check.ok) return { ok: false as const, message: check.message };
    try {
      return { ok: true as const, rows: await readAll() };
    } catch (error) {
      console.error("Lecture des demandes de guides impossible", error);
      return { ok: false as const, message: "Lecture impossible pour le moment." };
    }
  });

export const addGuideRequest = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: tokenField,
        city: z.string().trim().min(2).max(60),
        country: z.string().trim().min(2).max(60),
        destination: z
          .string()
          .trim()
          .toUpperCase()
          .regex(/^[A-Z]{3}$/, "Code IATA à 3 lettres attendu"),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const check = guard(data.token);
    if (!check.ok) return { ok: false as const, message: check.message };
    const slug = slugifyCity(data.city);
    if (!slug) return { ok: false as const, message: "Nom de ville invalide." };
    try {
      const { getCityGuide } = await import("@/data/city-guides");
      if (getCityGuide(slug)) {
        return { ok: false as const, message: `Un guide existe déjà pour ${data.city}.` };
      }
      const supabase = await db();
      const { error } = await supabase.from("guide_requests").insert({
        slug,
        city: data.city,
        country: data.country,
        origin: "PAR",
        destination: data.destination,
        route_slug: `paris-${slug}`,
        status: "souhaite",
      });
      if (error) {
        if (error.code === "23505" || error.code === "23000" || error.code === "23001") throw error;
        if (error.message.includes("duplicate")) {
          return { ok: false as const, message: `${data.city} est déjà dans la liste.` };
        }
        throw error;
      }
      return { ok: true as const, rows: await readAll() };
    } catch (error) {
      console.error("Ajout d'une ville impossible", error);
      return { ok: false as const, message: "Ajout impossible pour le moment." };
    }
  });

export const deleteGuideRequest = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: tokenField, id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const check = guard(data.token);
    if (!check.ok) return { ok: false as const, message: check.message };
    try {
      const supabase = await db();
      const { error } = await supabase.from("guide_requests").delete().eq("id", data.id);
      if (error) throw error;
      return { ok: true as const, rows: await readAll() };
    } catch (error) {
      console.error("Suppression impossible", error);
      return { ok: false as const, message: "Suppression impossible pour le moment." };
    }
  });

/* -------------------------------------------------------------------------- */
/* Génération du brouillon                                                    */
/* -------------------------------------------------------------------------- */

const draftSchema = z.object({
  title: z.string().trim().min(10).max(160),
  metaTitle: z.string().trim().min(10).max(160),
  description: z.string().trim().min(60).max(320),
  intro: z.string().trim().min(120),
  readingMinutes: z.number().int().min(3).max(15),
  practical: z.object({
    monnaie: z.string().trim().min(5),
    langue: z.string().trim().min(3),
    visa: z.string().trim().min(5),
    transport: z.string().trim().min(5),
    budgetJour: z.string().trim().min(5),
  }),
  sections: z
    .array(
      z.object({
        heading: z.string().trim().min(8).max(140),
        paragraphs: z.array(z.string().trim().min(80)).min(2).max(4),
      }),
    )
    .min(3)
    .max(6),
});

export const generateGuideDraft = createServerFn({ method: "POST" })
  .inputValidator((data) => z.object({ token: tokenField, id: z.string().uuid() }).parse(data))
  .handler(async ({ data }) => {
    const check = guard(data.token);
    if (!check.ok) return { ok: false as const, message: check.message };
    const apiKey = process.env["LOVABLE_API_KEY"];
    if (!apiKey) {
      return { ok: false as const, message: "Clé de génération indisponible côté serveur." };
    }

    const supabase = await db();
    const { data: row, error: readError } = await supabase
      .from("guide_requests")
      .select(ROW_SELECT)
      .eq("id", data.id)
      .maybeSingle();
    if (readError || !row) {
      return { ok: false as const, message: "Ville introuvable." };
    }
    const request = mapRow(row as DbRow);

    const prompt = `Rédige un guide voyage pratique en français pour ${request.city} (${request.country}), destiné à des voyageurs français partant de Paris.
Contraintes :
- Ton factuel et concret, aucune formule promotionnelle, aucun superlatif creux.
- N'invente JAMAIS de prix de billet d'avion ni de date : les prix des vols sont affichés séparément par le site.
- Les budgets sur place peuvent être donnés en fourchettes réalistes (repas, nuitée, transports).
- 4 sections : meilleure période, quartiers ou lieux à voir, budget sur place, transports et formalités.
- Chaque section : 2 à 3 paragraphes de 3 à 5 phrases.
Réponds uniquement en JSON, sans texte autour, avec ce schéma exact :
{"title":string,"metaTitle":string,"description":string,"intro":string,"readingMinutes":number,"practical":{"monnaie":string,"langue":string,"visa":string,"transport":string,"budgetJour":string},"sections":[{"heading":string,"paragraphs":[string]}]}`;

    try {
      const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            {
              role: "system",
              content:
                "Tu rédiges des guides de voyage factuels en français pour un comparateur de vols. Tu réponds uniquement en JSON valide.",
            },
            { role: "user", content: prompt },
          ],
        }),
      });
      if (!response.ok) {
        const detail = (await response.text()).slice(0, 200);
        const message =
          response.status === 429
            ? "Quota de génération atteint, réessayez plus tard."
            : `Génération refusée (HTTP ${response.status}).`;
        await supabase
          .from("guide_requests")
          .update({ error_message: detail })
          .eq("id", request.id);
        return { ok: false as const, message };
      }
      const payload = (await response.json()) as {
        choices?: { message?: { content?: string } }[];
      };
      const raw = payload.choices?.[0]?.message?.content ?? "";
      const json = raw.slice(raw.indexOf("{"), raw.lastIndexOf("}") + 1);
      const parsed = draftSchema.safeParse(JSON.parse(json));
      if (!parsed.success) {
        await supabase
          .from("guide_requests")
          .update({ error_message: parsed.error.issues[0]?.message ?? "Format inattendu" })
          .eq("id", request.id);
        return {
          ok: false as const,
          message: "Le brouillon généré est incomplet, relancez la génération.",
        };
      }

      const draft = {
        ...parsed.data,
        originCity: "Paris",
        updated: new Date().toISOString().slice(0, 10),
      };
      const { error: writeError } = await supabase
        .from("guide_requests")
        .update({
          draft: draft as never,
          status: request.status === "publie" ? "publie" : "brouillon",
          generated_at: new Date().toISOString(),
          error_message: null,
        })
        .eq("id", request.id);
      if (writeError) throw writeError;
      return { ok: true as const, rows: await readAll() };
    } catch (error) {
      console.error("Génération du brouillon impossible", error);
      return { ok: false as const, message: "Génération impossible pour le moment." };
    }
  });

export const setGuidePublication = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ token: tokenField, id: z.string().uuid(), publish: z.boolean() }).parse(data),
  )
  .handler(async ({ data }) => {
    const check = guard(data.token);
    if (!check.ok) return { ok: false as const, message: check.message };
    try {
      const supabase = await db();
      if (data.publish) {
        const { data: row } = await supabase
          .from("guide_requests")
          .select("draft")
          .eq("id", data.id)
          .maybeSingle();
        const draft = row?.draft as { intro?: string } | null;
        if (!draft?.intro) {
          return { ok: false as const, message: "Générez d'abord un brouillon." };
        }
      }
      const { error } = await supabase
        .from("guide_requests")
        .update({
          status: data.publish ? "publie" : "brouillon",
          published_at: data.publish ? new Date().toISOString() : null,
        })
        .eq("id", data.id);
      if (error) throw error;
      return { ok: true as const, rows: await readAll() };
    } catch (error) {
      console.error("Publication impossible", error);
      return { ok: false as const, message: "Publication impossible pour le moment." };
    }
  });
