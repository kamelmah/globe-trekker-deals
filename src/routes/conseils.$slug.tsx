import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";
import { getPost } from "@/data/posts";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/conseils/$slug")({
  loader: ({ params }) => {
    const post = getPost(params.slug);
    if (!post) throw notFound();
    return { post };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Article introuvable | TrouveMonVol" }, { name: "robots", content: "noindex" }],
      };
    }
    const { post } = loaderData;
    const pageUrl = `${SITE_URL}/conseils/${post.slug}`;
    return {
      meta: [
        { title: post.metaTitle },
        { name: "description", content: post.description },
        { property: "og:title", content: post.metaTitle },
        { property: "og:description", content: post.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: pageUrl }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: post.metaTitle,
            description: post.description,
            inLanguage: "fr-FR",
            mainEntityOfPage: pageUrl,
            image: DEFAULT_OG_IMAGE,
            author: { "@type": "Organization", name: "TrouveMonVol", url: SITE_URL },
            publisher: {
              "@type": "Organization",
              name: "TrouveMonVol",
              logo: { "@type": "ImageObject", url: `${SITE_URL}/icons/icon-512.png` },
            },
          }),
        },
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Conseils", item: `${SITE_URL}/conseils` },
              { "@type": "ListItem", position: 3, name: post.metaTitle, item: pageUrl },
            ],
          }),
        },
      ],
    };
  },
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData();
  const related = post.relatedSlugs
    ? post.relatedSlugs
        .map((slug) => DESTINATIONS.find((d) => d.slug === slug))
        .filter((d): d is (typeof DESTINATIONS)[number] => d !== undefined)
    : DESTINATIONS.slice(0, 4);

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/conseils" className="hover:text-foreground">
          Conseils
        </Link>{" "}
        / {post.title}
      </nav>

      <h1 className="mt-3 max-w-3xl font-display">{post.title}</h1>
      <p className="mt-2 text-xs text-muted-foreground">
        {post.readingMinutes} min de lecture · mis à jour le {post.updated}
      </p>

      <div className="mt-8 max-w-3xl">
        {post.body.map((block, index) => (
          <section key={block.heading ?? index} className="mt-8 first:mt-0">
            {block.heading && (
              <h2 className="font-display text-xl font-semibold">{block.heading}</h2>
            )}
            {block.paragraphs.map((paragraph) => (
              <p
                key={paragraph.slice(0, 40)}
                className="mt-3 text-sm leading-relaxed text-muted-foreground"
              >
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>

      <aside className="mt-12 max-w-3xl rounded-xl border border-border bg-secondary/40 p-5">
        <h2 className="font-display text-base font-semibold">Appliquer ces conseils maintenant</h2>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>
            <Link
              to="/mode-budget"
              search={{ origin: "PAR", budget: 400, month: "", adultes: 1, enfants: 0, bebes: 0 }}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              Voir où partir avec mon budget
            </Link>
          </li>
          {related.map((d) => (
            <li key={d.slug}>
              <Link
                to="/vols/$slug"
                params={{ slug: d.slug }}
                className="hover:text-foreground"
              >
                Vols pas chers {d.originCity} — {d.destinationCity}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
    </article>
  );
}
