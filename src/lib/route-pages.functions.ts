import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const dynamicRoutePage = createServerFn({ method: "GET" })
  .inputValidator((data) => z.object({ slug: z.string().trim().min(3).max(80) }).parse(data))
  .handler(async ({ data }) => {
    const { buildDynamicRoutePage } = await import("@/lib/route-pages.server");
    const route = await buildDynamicRoutePage(data.slug);
    return { route };
  });
