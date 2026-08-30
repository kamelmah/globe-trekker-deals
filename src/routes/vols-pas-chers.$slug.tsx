import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { AlertForm } from "@/components/alerts/AlertForm";
import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { PriceHistoryChart } from "@/components/flights/PriceHistoryChart";
import { FaqAccordion } from "@/components/site/FaqAccordion";
import { Button } from "@/components/ui/button";
import { getDestination } from "@/data/destinations";
import { cheapestDestinations, monthlyHistory } from "@/lib/flights.functions";
import { formatPrice } from "@/lib/currency";
import { todayPlus } from "@/lib/search-params";

export const Route = createFileRoute("/vols-pas-chers/$slug")({
  loader: async ({ params }) => {
    const route = getDestination(params.slug);
    if (!route) throw notFound();
    const [history, cheapest] = await Promise.all([
      monthlyHistory({ data: { origin: route.origin, destination: route.destination } }),
      cheapestDestinations({
        data: { origin: route.origin, destinations: [route.destination] },
      }),
    ]);
    return {
      route,
      months: history.months,
      lowestPrice: cheapest.prices[0]?.priceEur ?? null,
      priceError: cheapest.error,
      debug: cheapest.debug,
    };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Destination introuvable | TrouveMonVol" }, { name: "robots", content: "noindex" }],
      };
    }
    const { route } = loaderData;
    return {
      meta: [
        { title: route.metaTitle },
        { name: "description", content: route.metaDescription },
        { property: "og:title", content: route.metaTitle },
        { property: "og:description", content: route.metaDescription },
        { property: "og:type", content: "article" },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: route.faq.map((item) => ({
              "@type": "Question",
              name: item.question,
              acceptedAnswer: { "@type": "Answer", text: item.answer },
            })),
          }),
        },
      ],
    };
  },
  component: DestinationPage,
});

function DestinationPage() {
  const { route, months, lowestPrice, priceError, debug } = Route.useLoaderData();
  const chartMin = months.length ? Math.min(...months.map((m) => m.priceEur)) : null;

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        / Vols pas chers {route.originCity} — {route.destinationCity}
      </nav>

      <h1 className="mt-3 font-display text-3xl font-semibold">{route.heading}</h1>
      <p className="mt-3 max-w-3xl text-base text-muted-foreground">{route.intro}</p>

      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Prix le plus bas relevé récemment</p>
          <p className="mt-1 font-display text-2xl font-semibold text-primary">
            {lowestPrice ? formatPrice(lowestPrice) : "Non disponible"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">Aller simple, taxes incluses</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Meilleure période</p>
          <p className="mt-1 text-base font-semibold">{route.bestMonths}</p>
        </div>
        <div className="rounded-xl border border-border bg-card p-4">
          <p className="text-xs text-muted-foreground">Durée de vol</p>
          <p className="mt-1 text-base font-semibold">{route.averageDuration}</p>
        </div>
      </div>

      <div className="mt-6">
        <Button asChild size="lg">
          <Link
            to="/recherche"
            search={{
              origin: route.origin,
              destination: route.destination,
              depart: todayPlus(30),
              retour: "",
              flexible: 1,
              budget: 0,
              vue: "liste",
            }}
          >
            Comparer les vols {route.originCity} — {route.destinationCity}
          </Link>
        </Button>
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-[1fr_360px]">
        <div>
          {route.sections.map((section) => (
            <section key={section.heading} className="mt-8 first:mt-0">
              <h2 className="font-display text-xl font-semibold">{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph.slice(0, 40)} className="mt-3 text-sm leading-relaxed text-muted-foreground">
                  {paragraph}
                </p>
              ))}
            </section>
          ))}

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">
              Évolution du prix le plus bas sur 12 mois
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {chartMin
                ? `Sur la dernière année, le plancher observé sur ce trajet est de ${formatPrice(chartMin)}.`
                : "Historique en cours de constitution sur ce trajet."}
            </p>
            <div className="mt-4 rounded-xl border border-border bg-card p-4">
              <PriceHistoryChart months={months} />
            </div>
            {months.length === 0 && (
              <p className="mt-2 text-xs text-muted-foreground">
                Aucune observation de prix enregistrée pour l'instant sur ce trajet : l'historique se
                constitue à partir des prix réellement relevés lors des recherches.
              </p>
            )}
            {priceError && (
              <p className="mt-2 text-xs text-destructive">{priceError}</p>
            )}
            <ApiDebugPanel debug={debug} />
          </section>

          <section className="mt-10">
            <h2 className="font-display text-xl font-semibold">Questions fréquentes</h2>
            <div className="mt-4">
              <FaqAccordion items={route.faq} />
            </div>
          </section>
        </div>

        <aside className="space-y-6">
          {lowestPrice !== null && (
            <AlertForm
              origin={route.origin}
              destination={route.destination}
              referencePrice={lowestPrice}
            />
          )}
          <div className="rounded-xl border border-border bg-card p-5 text-sm text-muted-foreground">
            <h2 className="font-display text-base font-semibold text-foreground">
              Pas encore décidé sur la destination ?
            </h2>
            <p className="mt-2">
              Le mode budget affiche sur une carte toutes les villes accessibles avec la somme que vous
              voulez dépenser.
            </p>
            <Button asChild variant="outline" className="mt-4">
              <Link to="/mode-budget" search={{ origin: route.origin, budget: 400, month: "" }}>
                Explorer par budget
              </Link>
            </Button>
          </div>
        </aside>
      </div>
    </article>
  );
}
