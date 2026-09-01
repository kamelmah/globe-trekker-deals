import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { Reveal } from "@/components/site/Reveal";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { TravelPartnersSection } from "@/components/site/TravelPartners";
import { Stay22Map } from "@/components/stay/Stay22Map";
import { Button } from "@/components/ui/button";
import { getComparison, type Comparison, type ComparisonSide } from "@/data/comparisons";
import { getCityGuide, type CityGuide } from "@/data/city-guides";
import { getDestination, type DestinationRoute } from "@/data/destinations";
import { guidePriceSnapshot, type GuidePriceSnapshot } from "@/lib/guide-prices.functions";
import { formatParisDateTime } from "@/lib/price-refresh.shared";
import { getDestinationImage } from "@/lib/destination-images";
import { todayPlus } from "@/lib/search-params";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

type ComparisonLoaderData = {
  comparison: Comparison;
  guideA: CityGuide;
  guideB: CityGuide;
  destA: DestinationRoute;
  destB: DestinationRoute;
  priceA: GuidePriceSnapshot;
  priceB: GuidePriceSnapshot;
};

export const Route = createFileRoute("/comparatifs/$slug")({
  loader: async ({ params }): Promise<ComparisonLoaderData> => {
    const comparison = getComparison(params.slug);
    if (!comparison) throw notFound();
    const guideA = getCityGuide(comparison.cityA.guideSlug);
    const guideB = getCityGuide(comparison.cityB.guideSlug);
    const destA = getDestination(comparison.cityA.destinationSlug);
    const destB = getDestination(comparison.cityB.destinationSlug);
    // Un comparatif suppose que les deux destinations ont déjà leur guide et
    // leur page vols : si l'une manque, on considère la page introuvable
    // plutôt que d'afficher un comparatif à moitié rempli.
    if (!guideA || !guideB || !destA || !destB) throw notFound();
    // Même règle que sur les pages guide/vols : jamais de prix inventé, on
    // relit uniquement ce qui a été réellement observé (table price_history).
    const [priceA, priceB] = await Promise.all([
      guidePriceSnapshot({ data: { origin: destA.origin, destination: destA.destination } }),
      guidePriceSnapshot({ data: { origin: destB.origin, destination: destB.destination } }),
    ]);
    return { comparison, guideA, guideB, destA, destB, priceA, priceB };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Comparatif introuvable | TrouveMonVol" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { comparison, guideA, guideB } = loaderData;
    const pageUrl = `${SITE_URL}/comparatifs/${comparison.slug}`;
    return {
      meta: [
        { title: comparison.metaTitle },
        { name: "description", content: comparison.metaDescription },
        { property: "og:title", content: comparison.metaTitle },
        { property: "og:description", content: comparison.metaDescription },
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
            headline: comparison.title,
            description: comparison.metaDescription,
            inLanguage: "fr-FR",
            mainEntityOfPage: pageUrl,
            dateModified: comparison.updated,
            about: [
              { "@type": "Place", name: `${guideA.city}, ${guideA.country}` },
              { "@type": "Place", name: `${guideB.city}, ${guideB.country}` },
            ],
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
                name: "Comparatifs",
                item: `${SITE_URL}/comparatifs`,
              },
              { "@type": "ListItem", position: 4, name: comparison.title, item: pageUrl },
            ],
          }),
        },
      ],
    };
  },
  component: ComparisonPage,
});

/** Bloc "carte + lien vers le guide et les vols" pour un côté du comparatif. */
function CitySidePanel({
  side,
  guide,
  destination,
  price,
}: {
  side: ComparisonSide;
  guide: CityGuide;
  destination: DestinationRoute;
  price: GuidePriceSnapshot;
}) {
  const image = getDestinationImage(destination.destination, guide.city);
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <ResponsivePicture
        src={image.thumb}
        webp={image.thumbWebp}
        alt={image.alt}
        loading="lazy"
        width={320}
        height={180}
        className="h-32 w-full rounded-lg object-cover"
      />
      <h3 className="mt-3 font-display text-base font-semibold">{guide.city}</h3>
      <p className="text-xs text-muted-foreground">{guide.country}</p>
      {price.lowestEur ? (
        <p className="mt-2 text-sm text-muted-foreground">
          Dès <strong className="text-foreground">{price.lowestEur} €</strong> l'aller-retour depuis{" "}
          {destination.originCity}
          {price.updatedAt ? ` (relevé le ${formatParisDateTime(price.updatedAt)})` : ""}.
        </p>
      ) : (
        <p className="mt-2 text-sm text-muted-foreground">
          Aucun prix encore relevé depuis {destination.originCity} : lancez une recherche pour voir
          les tarifs du moment.
        </p>
      )}
      <div className="mt-3 flex flex-col gap-2">
        <Link
          to="/conseils/destinations/$city"
          params={{ city: guide.slug }}
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Voir le guide {guide.city}
        </Link>
        <Link
          to="/vols/$slug"
          params={{ slug: side.destinationSlug }}
          className="text-sm font-medium text-primary underline-offset-2 hover:underline"
        >
          Voir les vols {destination.originCity} — {guide.city}
        </Link>
      </div>
    </div>
  );
}

function ComparisonPage() {
  const { comparison, guideA, guideB, destA, destB, priceA, priceB } = Route.useLoaderData();

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/conseils" className="hover:text-foreground">
          Conseils
        </Link>{" "}
        /{" "}
        <Link to="/comparatifs" className="hover:text-foreground">
          Comparatifs
        </Link>{" "}
        / {guideA.city} ou {guideB.city}
      </nav>

      <h1 className="mt-3 max-w-3xl font-display">{comparison.title}</h1>
      <p className="mt-2 text-xs text-muted-foreground">Mis à jour le {comparison.updated}</p>
      <p className="mt-4 max-w-3xl text-base text-muted-foreground">{comparison.intro}</p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <CitySidePanel side={comparison.cityA} guide={guideA} destination={destA} price={priceA} />
        <CitySidePanel side={comparison.cityB} guide={guideB} destination={destB} price={priceB} />
      </div>

      <Reveal className="mt-10">
        <section className="max-w-4xl">
          <h2 className="font-display text-xl font-semibold">Comparatif en un coup d'œil</h2>
          <div className="mt-4 overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[560px] border-collapse text-sm">
              <thead>
                <tr className="bg-secondary/40 text-left">
                  <th className="p-3 font-medium">Critère</th>
                  <th className="p-3 font-medium">{guideA.city}</th>
                  <th className="p-3 font-medium">{guideB.city}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="p-3 align-top font-medium">Prix vol observé</td>
                  <td className="p-3 align-top text-muted-foreground">
                    {priceA.lowestEur
                      ? `Dès ${priceA.lowestEur} € depuis ${destA.originCity}`
                      : "Aucun relevé pour l'instant"}
                  </td>
                  <td className="p-3 align-top text-muted-foreground">
                    {priceB.lowestEur
                      ? `Dès ${priceB.lowestEur} € depuis ${destB.originCity}`
                      : "Aucun relevé pour l'instant"}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 align-top font-medium">Durée de vol</td>
                  <td className="p-3 align-top text-muted-foreground">{destA.averageDuration}</td>
                  <td className="p-3 align-top text-muted-foreground">{destB.averageDuration}</td>
                </tr>
                <tr>
                  <td className="p-3 align-top font-medium">Budget sur place</td>
                  <td className="p-3 align-top text-muted-foreground">
                    {guideA.practical.budgetJour}
                  </td>
                  <td className="p-3 align-top text-muted-foreground">
                    {guideB.practical.budgetJour}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 align-top font-medium">Climat</td>
                  <td className="p-3 align-top text-muted-foreground">
                    {comparison.table.climat[0]}
                  </td>
                  <td className="p-3 align-top text-muted-foreground">
                    {comparison.table.climat[1]}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 align-top font-medium">Ambiance</td>
                  <td className="p-3 align-top text-muted-foreground">
                    {comparison.table.ambiance[0]}
                  </td>
                  <td className="p-3 align-top text-muted-foreground">
                    {comparison.table.ambiance[1]}
                  </td>
                </tr>
                <tr>
                  <td className="p-3 align-top font-medium">Activités phares</td>
                  <td className="p-3 align-top text-muted-foreground">
                    <ul className="list-disc space-y-1 pl-4">
                      {comparison.table.activites[0].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </td>
                  <td className="p-3 align-top text-muted-foreground">
                    <ul className="list-disc space-y-1 pl-4">
                      {comparison.table.activites[1].map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>
      </Reveal>

      <div className="mt-10 max-w-3xl">
        {comparison.sections.map((section) => (
          <Reveal key={section.heading} className="mt-8 first:mt-0">
            <section>
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
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10 max-w-3xl">
        <section className="rounded-xl border border-border bg-secondary/40 p-5">
          <h2 className="font-display text-base font-semibold">Notre avis en résumé</h2>
          <ul className="mt-3 space-y-3 text-sm text-muted-foreground">
            <li>
              <strong className="text-foreground">{guideA.city}.</strong>{" "}
              {comparison.verdict.forCityA}
            </li>
            <li>
              <strong className="text-foreground">{guideB.city}.</strong>{" "}
              {comparison.verdict.forCityB}
            </li>
          </ul>
        </section>
      </Reveal>

      <Reveal className="mt-10 max-w-3xl">
        <section>
          <h2 className="font-display text-xl font-semibold">
            Où dormir : {guideA.city} et {guideB.city}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            Un aperçu des prix d'hébergement sur les deux destinations, pour affiner votre choix
            avant de réserver.
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <Stay22Map
              city={guideA.city}
              title={`Hébergements à ${guideA.city}`}
              description={`Carte interactive des hôtels et locations à ${guideA.city} (via notre partenaire Stay22).`}
              id="hebergement-a"
            />
            <Stay22Map
              city={guideB.city}
              title={`Hébergements à ${guideB.city}`}
              description={`Carte interactive des hôtels et locations à ${guideB.city} (via notre partenaire Stay22).`}
              id="hebergement-b"
            />
          </div>
        </section>
      </Reveal>

      <Reveal className="mt-10 max-w-3xl">
        <TravelPartnersSection partners={["activites"]} />
      </Reveal>

      <div className="mt-10 max-w-3xl rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-base font-semibold">Toujours indécis ?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Indiquez votre budget et découvrez toutes les villes accessibles depuis votre aéroport,{" "}
          {guideA.city} et {guideB.city} comprises.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button asChild size="sm">
            <Link
              to="/recherche"
              search={{
                origin: destA.origin,
                destination: destA.destination,
                depart: todayPlus(45),
                retour: "",
                duree: 0,
                flexible: 1,
                budget: 0,
                adultes: 1,
                enfants: 0,
                bebes: 0,
              }}
            >
              Chercher un vol pour {guideA.city}
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline">
            <Link
              to="/recherche"
              search={{
                origin: destB.origin,
                destination: destB.destination,
                depart: todayPlus(45),
                retour: "",
                duree: 0,
                flexible: 1,
                budget: 0,
                adultes: 1,
                enfants: 0,
                bebes: 0,
              }}
            >
              Chercher un vol pour {guideB.city}
            </Link>
          </Button>
        </div>
      </div>
    </article>
  );
}
