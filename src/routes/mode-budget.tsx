import { useQuery } from "@tanstack/react-query";
import { ClientOnly, Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { lazy, Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { AIRPORTS, BUDGET_DESTINATION_CODES, getAirport } from "@/data/airports";
import { useCurrency } from "@/lib/currency-context";
import { cheapestDestinations } from "@/lib/flights.functions";
import { currentMonth, iataOr, monthOr, numberOr } from "@/lib/search-params";

const BudgetMap = lazy(() => import("@/components/budget/BudgetMap"));

const TITLE = "Mode budget : où partir avec votre budget | TrouveMonVol";
const DESCRIPTION =
  "Indiquez votre budget et votre ville de départ, puis explorez sur une carte du monde interactive toutes les destinations accessibles à ce prix, taxes incluses.";

type SearchParams = { origin: string; budget: number; month: string };

export const Route = createFileRoute("/mode-budget")({
  validateSearch: (search: Record<string, unknown>): SearchParams => ({
    origin: iataOr(search.origin, "PAR"),
    budget: Math.max(20, numberOr(search.budget, 400)),
    month: monthOr(search.month, ""),
  }),
  loader: async ({ location }) => {
    const origin = iataOr((location.search as Record<string, unknown>).origin, "PAR");
    const month = monthOr((location.search as Record<string, unknown>).month, "");
    const { prices, demo } = await cheapestDestinations({
      data: {
        origin,
        destinations: BUDGET_DESTINATION_CODES,
        ...(month ? { month } : {}),
      },
    });
    return { prices, demo };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: BudgetPage,
});

const ORIGIN_CODES = ["PAR", "LYS", "MRS", "BOD", "NCE", "TLS", "NTE", "BRU", "GVA"];

function BudgetPage() {
  const search = Route.useSearch();
  const initial = Route.useLoaderData();
  const navigate = useNavigate({ from: Route.fullPath });
  const runDestinations = useServerFn(cheapestDestinations);
  const { format } = useCurrency();
  const { currency } = useCurrency();
  const [selected, setSelected] = useState<string | undefined>(undefined);
  const [budgetInput, setBudgetInput] = useState(String(search.budget));

  const query = useQuery({
    queryKey: ["budget", search.origin, search.month],
    queryFn: () =>
      runDestinations({
        data: {
          origin: search.origin,
          destinations: BUDGET_DESTINATION_CODES,
          ...(search.month ? { month: search.month } : {}),
        },
      }),
    initialData: initial,
  });

  const originAirport = getAirport(search.origin);
  const prices = [...(query.data?.prices ?? [])].sort((a, b) => a.priceEur - b.priceEur);
  const affordable = prices.filter((p) => p.priceEur <= search.budget);
  const origins = AIRPORTS.filter((a) => ORIGIN_CODES.includes(a.code));

  return (
    <div>
      <div className="container-page pt-8">
        <h1 className="font-display text-2xl font-semibold sm:text-3xl">
          Mode budget : où partir de {originAirport?.city ?? search.origin} avec {format(search.budget)}
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
          <div className="space-y-1.5 sm:w-56">
            <Label htmlFor="budget-origin">Ville de départ</Label>
            <select
              id="budget-origin"
              value={search.origin}
              onChange={(e) => navigate({ search: (prev) => ({ ...prev, origin: e.target.value }) })}
              className="h-9 w-full rounded-md border border-input bg-background px-2 text-sm"
            >
              {origins.map((a) => (
                <option key={a.code} value={a.code}>
                  {a.city} ({a.code})
                </option>
              ))}
            </select>
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
                {...(selected ? { selected } : {})}
              />
            </Suspense>
          </ClientOnly>
        </div>

        <aside className="max-h-[640px] overflow-y-auto rounded-xl border border-border bg-card p-4">
          <h2 className="font-display text-base font-semibold">Destinations, du moins cher au plus cher</h2>
          <ul className="mt-3 space-y-2">
            {prices.map((price) => {
              const inBudget = price.priceEur <= search.budget;
              return (
                <li key={price.destination}>
                  <Link
                    to="/recherche"
                    search={{
                      origin: search.origin,
                      destination: price.destination,
                      depart: price.departureAt.slice(0, 10),
                      retour: "",
                      flexible: 1,
                      budget: 0,
                      vue: "liste",
                    }}
                    onMouseEnter={() => setSelected(price.destination)}
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
        </aside>
      </div>
    </div>
  );
}
