import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

/**
 * Lecture du journal technique, protégée par le jeton d'administration
 * `ADMIN_LOGS_TOKEN` (jamais exposé au navigateur).
 */
export const fetchOpsLogs = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z
      .object({
        token: z.string().trim().min(8).max(200),
        kind: z.enum(["tous", "travelpayouts", "alerte"]).optional(),
        onlyProblems: z.boolean().optional(),
      })
      .parse(data),
  )
  .handler(async ({ data }) => {
    const expected = process.env["ADMIN_LOGS_TOKEN"];
    if (!expected) {
      return { ok: false as const, message: "Jeton d'administration non configuré côté serveur." };
    }
    if (data.token !== expected) {
      return { ok: false as const, message: "Jeton invalide." };
    }

    const { readOpsLogs } = await import("@/lib/ops-log.server");
    const { readPriceRefreshState } = await import("@/lib/price-refresh.server");
    try {
      const [{ rows, stats }, refresh] = await Promise.all([
        readOpsLogs({
          kind: data.kind ?? "tous",
          onlyProblems: data.onlyProblems ?? false,
          limit: 200,
        }),
        readPriceRefreshState(),
      ]);
      return { ok: true as const, rows, stats, refresh };
    } catch (error) {
      console.error("Lecture du journal impossible", error);
      return { ok: false as const, message: "Lecture du journal impossible pour le moment." };
    }
  });
