import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { TravelPartnersSection } from "@/components/site/TravelPartners";
import { countryPreposition, getTravelDocument } from "@/data/travel-documents";
import { getCityGuide } from "@/data/city-guides";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

export const Route = createFileRoute("/conseils/formalites/$pays")({
  loader: ({ params }) => {
    const doc = getTravelDocument(params.pays);
    if (!doc) throw notFound();
    return { doc };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Formalités introuvables | TrouveMonVol" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { doc } = loaderData;
    const pageUrl = `${SITE_URL}/conseils/formalites/${doc.slug}`;
    return {
      meta: [
        { title: doc.metaTitle },
        { name: "description", content: doc.metaDescription },
        { property: "og:title", content: doc.metaTitle },
        { property: "og:description", content: doc.metaDescription },
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
            headline: doc.metaTitle,
            description: doc.metaDescription,
            inLanguage: "fr-FR",
            mainEntityOfPage: pageUrl,
            dateModified: doc.updated,
            about: { "@type": "Country", name: doc.country },
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
                name: "Formalités",
                item: `${SITE_URL}/conseils/formalites`,
              },
              { "@type": "ListItem", position: 4, name: doc.country, item: pageUrl },
            ],
          }),
        },
      ],
    };
  },
  component: TravelDocumentPage,
});

function TravelDocumentPage() {
  const { doc } = Route.useLoaderData();
  const guides = doc.relatedGuideSlugs
    .map((slug) => getCityGuide(slug))
    .filter((g): g is NonNullable<typeof g> => g !== undefined);

  const fields: { label: string; value: string }[] = [
    { label: "Visa", value: doc.visa },
    { label: "Passeport", value: doc.passport },
    { label: "Vaccins recommandés", value: doc.vaccines },
    { label: "Devise et formalités locales", value: doc.specifics },
  ];

  return (
    <article className="container-page max-w-3xl py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/conseils" className="hover:text-foreground">
          Conseils
        </Link>{" "}
        /{" "}
        <Link to="/conseils/formalites" className="hover:text-foreground">
          Formalités
        </Link>{" "}
        / {doc.country}
      </nav>

      <h1 className="mt-3 font-display">
        Formalités pour voyager {countryPreposition(doc.country)} {doc.country}
      </h1>
      <p className="mt-2 text-xs text-muted-foreground">Mis à jour le {doc.updated}</p>
      <p className="mt-4 text-base text-muted-foreground">{doc.intro}</p>
      <p className="mt-3 text-xs text-muted-foreground">
        Ces informations sont données à titre indicatif pour les ressortissants français : les
        formalités changent régulièrement, vérifiez-les sur{" "}
        <a
          href="https://www.diplomatie.gouv.fr/fr/conseils-aux-voyageurs/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          France Diplomatie
        </a>{" "}
        avant de réserver.
      </p>

      <Reveal className="mt-8">
        <dl className="divide-y divide-border rounded-xl border border-border bg-card">
          {fields.map((field) => (
            <div key={field.label} className="grid gap-1 p-4 sm:grid-cols-[200px_1fr] sm:gap-4">
              <dt className="text-sm font-medium">{field.label}</dt>
              <dd className="text-sm leading-relaxed text-muted-foreground">{field.value}</dd>
            </div>
          ))}
        </dl>
      </Reveal>

      <Reveal className="mt-8">
        <section>
          <h2 className="font-display text-xl font-semibold">Bon à savoir</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-muted-foreground">
            {doc.goodToKnow.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </Reveal>

      {guides.length > 0 && (
        <Reveal className="mt-8">
          <section className="rounded-xl border border-border bg-secondary/40 p-5">
            <h2 className="font-display text-base font-semibold">
              Préparer votre séjour {countryPreposition(doc.country)} {doc.country}
            </h2>
            <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
              {guides.map((guide) => (
                <li key={guide.slug}>
                  <Link
                    to="/conseils/destinations/$city"
                    params={{ city: guide.slug }}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Guide {guide.city} : que faire, budget, quand partir
                  </Link>
                </li>
              ))}
              {doc.relatedDestinationSlugs.map((slug) => (
                <li key={slug}>
                  <Link
                    to="/vols/$slug"
                    params={{ slug }}
                    className="font-medium text-primary underline-offset-2 hover:underline"
                  >
                    Voir les vols pas chers
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>
      )}

      <Reveal className="mt-10">
        <TravelPartnersSection partners={["assurance"]} />
      </Reveal>
    </article>
  );
}
