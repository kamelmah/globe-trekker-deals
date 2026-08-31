import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { Stay22Map } from "@/components/stay/Stay22Map";
import { Button } from "@/components/ui/button";
import { getCityGuide } from "@/data/city-guides";
import { getDestinationImage } from "@/lib/destination-images";
import { todayPlus } from "@/lib/search-params";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/conseils/destinations/$city")({
  loader: ({ params }) => {
    const guide = getCityGuide(params.city);
    if (!guide) throw notFound();
    return { guide };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Guide introuvable | TrouveMonVol" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { guide } = loaderData;
    const pageUrl = `${SITE_URL}/conseils/destinations/${guide.slug}`;
    return {
      meta: [
        { title: guide.metaTitle },
        { name: "description", content: guide.description },
        { property: "og:title", content: guide.metaTitle },
        { property: "og:description", content: guide.description },
        { property: "og:type", content: "article" },
        { property: "og:url", content: pageUrl },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [
        { rel: "canonical", href: pageUrl },
        { rel: "alternate", hrefLang: "fr-FR", href: pageUrl },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            inLanguage: "fr-FR",
            mainEntityOfPage: pageUrl,
            dateModified: guide.updated,
            about: { "@type": "Place", name: `${guide.city}, ${guide.country}` },
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
              {
                "@type": "ListItem",
                position: 3,
                name: "Guides destinations",
                item: `${SITE_URL}/conseils/destinations`,
              },
              { "@type": "ListItem", position: 4, name: guide.title, item: pageUrl },
            ],
          }),
        },
      ],
    };
  },
  component: CityGuidePage,
});

function CityGuidePage() {
  const { guide } = Route.useLoaderData();
  const image = getDestinationImage(guide.destination, guide.city);

  const practical: { label: string; value: string }[] = [
    { label: "Monnaie", value: guide.practical.monnaie },
    { label: "Langue", value: guide.practical.langue },
    { label: "Formalités pour les Français", value: guide.practical.visa },
    { label: "Transports sur place", value: guide.practical.transport },
    { label: "Budget moyen sur place", value: guide.practical.budgetJour },
  ];

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/conseils" className="hover:text-foreground">
          Conseils
        </Link>{" "}
        /{" "}
        <Link to="/conseils/destinations" className="hover:text-foreground">
          Guides destinations
        </Link>{" "}
        / {guide.city}
      </nav>

      <div className="relative mt-4 overflow-hidden rounded-2xl border border-border">
        <ResponsivePicture
          src={image.src}
          webp={image.webp}
          alt={image.alt}
          width={1200}
          height={630}
          className="h-44 w-full object-cover sm:h-64"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-transparent"
          aria-hidden
        />
        <h1 className="absolute inset-x-0 bottom-0 p-4 font-display text-2xl font-semibold text-white drop-shadow sm:p-6 sm:text-3xl">
          {guide.title}
        </h1>
      </div>

      <p className="mt-2 text-xs text-muted-foreground">
        {guide.readingMinutes} min de lecture · mis à jour le {guide.updated}
      </p>
      <p className="mt-4 max-w-3xl text-base text-muted-foreground">{guide.intro}</p>

      <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_340px]">
        <div className="max-w-3xl">
          {guide.sections.map((section) => (
            <section key={section.heading} className="mt-8 first:mt-0">
              <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 40)}
                  className="mt-3 text-sm leading-relaxed text-muted-foreground"
                >
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">
              Informations pratiques en résumé
            </h2>
            <dl className="mt-4 divide-y divide-border rounded-xl border border-border bg-card">
              {practical.map((item) => (
                <div key={item.label} className="grid gap-1 p-4 sm:grid-cols-[220px_1fr] sm:gap-4">
                  <dt className="text-sm font-medium">{item.label}</dt>
                  <dd className="text-sm text-muted-foreground">{item.value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">
              Budget sur place : où dormir à {guide.city}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              L'hébergement est souvent le premier poste de dépense du budget sur place. La carte
              ci-dessous affiche des hôtels et locations à {guide.city} avec leurs prix, pour vous
              aider à estimer le coût réel de votre séjour.
            </p>
            <Stay22Map
              className="mt-4"
              city={guide.city}
              title={`Hébergements à ${guide.city}`}
              description={`Carte interactive des hôtels et locations à ${guide.city} (via notre partenaire Stay22).`}
            />
          </section>
        </div>

        <aside className="space-y-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-xl border border-border bg-secondary/40 p-5">
            <h2 className="font-display text-base font-semibold">
              Comparer les vols {guide.originCity} — {guide.city}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Prix total taxes incluses, vendeur réel affiché sur chaque résultat, lien direct vers
              ce vendeur.
            </p>
            <Button asChild size="lg" className="mt-4 w-full">
              <Link
                to="/recherche"
                search={{
                  origin: guide.origin,
                  destination: guide.destination,
                  depart: todayPlus(30),
                  retour: "",
                  duree: 0,
                  flexible: 1,
                  budget: 0,
                  adultes: 1,
                  enfants: 0,
                  bebes: 0,
                }}
              >
                Chercher un vol pour {guide.city}
              </Link>
            </Button>
            <Link
              to="/vols/$slug"
              params={{ slug: guide.routeSlug }}
              className="mt-3 block text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              Voir la fiche prix {guide.originCity} — {guide.city}
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-base font-semibold">Pas encore décidé ?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Indiquez votre budget et découvrez toutes les villes accessibles depuis votre aéroport.
            </p>
            <Link
              to="/mode-budget"
              search={{ origin: guide.origin, budget: 400, month: "" }}
              className="mt-3 block text-sm font-medium text-primary underline-offset-2 hover:underline"
            >
              Explorer par budget
            </Link>
          </div>
        </aside>
      </div>
    </article>
  );
}
