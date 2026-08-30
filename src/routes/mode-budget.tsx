import { useQuery } from "@tanstack/react-query";
import { ClientOnly, Link, createFileRoute, useNavigate, useRouter } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { lazy, Suspense, useCallback, useState } from "react";

import { ApiDebugPanel } from "@/components/debug/ApiDebugPanel";
import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { getAirport } from "@/data/airports";
import { useCurrency } from "@/lib/currency-context";
import { cheapestDestinations } from "@/lib/flights.functions";
import { currentMonth, iataOr, monthOr, numberOr } from "@/lib/search-params";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const BudgetMap = lazy(() => import("@/components/budget/BudgetMap"));

const TITLE = "Mode budget : où partir avec votre budget | TrouveMonVol";
const DESCRIPTION =
  "Indiquez votre budget et votre ville de départ, puis explorez sur une carte du monde interactive toutes les destinations accessibles à ce prix, taxes incluses.";

type SearchParams = { origin: string; budget: number; month: string };

export const Route = createFileRoute("/mode-budget")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    origin: iataOr(search["origin"], "PAR"),
    budget: Math.max(20, numberOr(search["budget"], 400)),
    month: monthOr(search["month"], ""),
  }),
  loader: async ({ location }) => {
    const origin = iataOr((location.search as Record<string, unknown>)["origin"], "PAR");
    const month = monthOr((location.search as Record<string, unknown>)["month"], "");
    const { prices, error, debug } = await cheapestDestinations({
      data: {
        origin,
        world: true,
        ...(month ? { month } : {}),
      },
    });
    return { prices, error, debug };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/mode-budget` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/mode-budget` }],
  }),
  component: BudgetPage,
});


function BudgetPage() {
  const search = Route.useSearch();
  const initial = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });
  const runDestinations = useServerFn(cheapestDestinations);
  const { formatApi: format, currency } = useCurrency();
  const router = useRouter();
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [budgetInput, setBudgetInput] = useState(String(search["budget"]));

  const query = useQuery({
    queryKey: ["budget", search["origin"], search.month, currency],
    queryFn: () =>
      runDestinations({
        data: {
          origin: search["origin"],
          world: true,
          ...(search["month"] ? { month: search["month"] } : {}),
          currency,
        },
      }),
    ...(currency === "EUR" ? { initialData: initial } : {}),
  });

  /** Pré-remplit le formulaire de recherche de l'accueil avec ce trajet. */
  const searchForDestination = useCallback(
    (destination: string, departureAt: string) => ({
      origin: search["origin"],
      destination,
      depart: departureAt.slice(0, 10),
      retour: "",
      budget: search["budget"],
      flexible: true,
      adultes: 1,
      enfants: 0,
      bebes: 0,
    }),
    [search],
  );

  const hrefFor = useCallback(
    (price: { destination: string; departureAt: string }) =>
      router.buildLocation({
        to: "/",
        search: searchForDestination(price.destination, price.departureAt),
      }).href,
    [router, searchForDestination],
  );

  const originAirport = getAirport(search["origin"]);
  const prices = [...(query.data?.prices ?? [])].sort((a, b) => a.priceEur - b.priceEur);
  const affordable = prices.filter((p) => p.priceEur <= search["budget"]);
  

  return (
    <div>
      <div className="container-page pt-8">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Mode budget : où partir de {originAirport?.city ?? search.origin} avec {format(search["budget"])}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">
          Entrez votre budget maximum, sans destination imposée. Chaque point de la carte correspond à
          une ville accessible avec le prix le plus bas relevé récemment, taxes incluses. Les
          destinations au-dessus de votre budget restent visibles, simplement estompées, pour vous
          laisser explorer. Aujourd'hui, {affordable.length} destinations sur {prices.length} tiennent
          dans votre budget.
        </p>

        <form
          className="mt-5 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            navigate({
              search: (prev) => ({ ...prev, budget: Math.max(20, Number(budgetInput) || 400) }),
            });
          }}
        >
          <div className="sm:w-64">
            <PlaceAutocomplete
              id="budget-origin"
              label="Ville ou aéroport de départ"
              value={search.origin}
              onChange={(code) =>
                code && navigate({ search: (prev) => ({ ...prev, origin: code }) })
              }
              placeholder="Ex. Paris, Lyon, CDG…"
            />
          </div>

          <div className="space-y-1.5 sm:w-48">
            <Label htmlFor="budget-amount">Budget maximum (€)</Label>
            <Input
              id="budget-amount"
              type="number"
              min={20}
              inputMode="numeric"
              value={budgetInput}
              onChange={(e) => setBudgetInput(e.target.value)}
            />
          </div>
          <Button type="submit">Mettre à jour la carte</Button>
        </form>
      </div>

      <div className="container-page mt-6 grid gap-4 pb-12 lg:grid-cols-[1fr_360px]">
        <div className="h-[520px] overflow-hidden rounded-xl border border-border bg-card lg:h-[640px]">
          <ClientOnly fallback={<Skeleton className="h-full w-full" />}>
            <Suspense fallback={<Skeleton className="h-full w-full" />}>
              <BudgetMap
                prices={prices}
                budget={search.budget}
                currency={currency}
                originLat={originAirport?.lat ?? 48.86}
                originLng={originAirport?.lng ?? 2.35}
                onSelect={setSelected}
                hrefFor={hrefFor}
                {...(selected ? { selected } : {})}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <aside className="max-h-[640px] overflow-y-auto rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-base font-semibold">Destinations, du moins cher au plus cher</h2>
          {query.isFetching && (
            <p className="mt-3 text-sm text-muted-foreground">Chargement des prix…</p>
          )}
          {query.data?.error && (
            <p className="mt-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
              {query.data.error}
            </p>
          )}
          {!query.isFetching && !query.data?.error && prices.length === 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Aucun vol trouvé pour cette recherche, essayez un autre mois ou une autre ville de départ.
            </p>
          )}
          <ul className="mt-3 space-y-2">
            {prices.map((price) => {
              const inBudget = price.priceEur <= search.budget;
              return (
                <li key={price.destination}>
                  <Link
                    to="/"
                    search={searchForDestination(price.destination, price.departureAt)}
                    onMouseEnter={() => setSelected(price.destination)}
                    onFocus={() => setSelected(price.destination)}
                    className={`flex items-center justify-between gap-3 rounded-lg border p-3 text-sm transition-colors hover:bg-secondary ${
                      inBudget ? "border-border" : "border-dashed border-border opacity-55"
                    } ${selected === price.destination ? "ring-2 ring-ring" : ""}`}
                  >
                    <span>
                      <span className="block font-medium">{price.city}</span>
                      <span className="block text-xs text-muted-foreground">{price.country}</span>
                    </span>
                    <span className="font-semibold text-primary">{format(price.priceEur)}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
          <ApiDebugPanel debug={query.data?.debug} label="Mode budget" />
        </aside>
      </div>
    </div>
  );
}
