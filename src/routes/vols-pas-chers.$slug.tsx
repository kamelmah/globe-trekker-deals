import { createFileRoute, redirect } from "@tanstack/react-router";

/** Ancienne URL conservée : redirection permanente vers /vols/<slug>. */
export const Route = createFileRoute("/vols-pas-chers/$slug")({
  loader: ({ params }) => {
    throw redirect({
      to: "/vols/$slug",
      params: { slug: params.slug },
      statusCode: 301,
    });
  },
});
