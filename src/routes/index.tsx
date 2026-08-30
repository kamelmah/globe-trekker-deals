import { Link, createFileRoute } from "@tanstack/react-router";
import { BadgeEuro, EyeOff, Map as MapIcon, ShieldCheck, Store } from "lucide-react";

import { SearchForm } from "@/components/search/SearchForm";
import { DestinationPriceGrid } from "@/components/flights/DestinationPriceGrid";
import { DESTINATIONS } from "@/data/destinations";
import { cheapestDestinations } from "@/lib/flights.functions";

const HOME_CODES = [
  "RAK", "LIS", "BCN", "IST", "ROM", "ATH", "MAD", "PRG", "BUD", "OPO", "CMN", "NYC",
];

const TITLE = "TrouveMonVol — comparateur de vols transparent, prix total et vendeur affiché";
const DESCRIPTION =
  "Comparez les vols au prix total taxes incluses, avec le nom du vendeur réel sur chaque résultat. Recherche par budget, dates flexibles ± 3 jours, alertes prix gratuites.";

export const Route = createFileRoute("/")({
  loader: async () => {
    const { prices, error, debug } = await cheapestDestinations({
      data: { origin: "PAR", destinations: HOME_CODES },
    });
    return { prices, error, debug };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HomePage,
});

const REASONS = [
  {
    icon: BadgeEuro,
    title: "Le prix total, dès la première ligne",
    text: "Taxes et frais obligatoires sont déjà inclus dans le prix affiché. Pas de tarif d'appel qui gonfle au moment de payer.",
  },
  {
    icon: Store,
    title: "Vous savez toujours qui vous vend le billet",
    text: "Chaque résultat indique le vendeur réel — la compagnie ou l'agence nommée — et le bouton mène directement chez lui, sans cascade de redirections.",
  },
  {
    icon: EyeOff,
    title: "Zéro dark pattern",
    text: "Aucun faux compte à rebours, aucun « plus que 2 places à ce prix », aucune mise en avant payante dans le classement. Vous décidez à votre rythme.",
  },
  {
    icon: ShieldCheck,
    title: "Notre rémunération est expliquée",
    text: "Nous touchons une commission d'affiliation si vous réservez, sans surcoût pour vous. C'est écrit noir sur blanc.",
  },
];

function HomePage() {
  const { prices, error, debug } = Route.useLoaderData();

  return (
    <div>
      <section className="border-b border-border bg-sky-soft">
        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:py-16">
          <div>
            <h1 className="font-display text-3xl font-semibold leading-tight sm:text-4xl">
              Trouvez un vol pas cher sans mauvaise surprise au moment de payer
            </h1>
            <p className="mt-4 text-base text-muted-foreground sm:text-lg">
              TrouveMonVol compare les prix des vols en affichant le montant total taxes incluses et le
              nom du vendeur réel du billet. Vous pouvez aussi partir de votre budget : indiquez la
              somme que vous voulez dépenser et découvrez toutes les destinations accessibles depuis
              votre ville.
            </p>
            <ul className="mt-6 space-y-2 text-sm text-muted-foreground">
              <li>• Dates flexibles ± 3 jours pour repérer le jour le moins cher</li>
              <li>• Vue calendrier des prix du mois, en un coup d'œil</li>
              <li>• Alerte email gratuite quand le prix baisse, sans créer de compte</li>
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/mode-budget"
                search={{ origin: "PAR", budget: 400, month: "" }}
                className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:bg-secondary"
              >
                <MapIcon className="size-4 text-primary" aria-hidden />
                Explorer la carte du monde par budget
              </Link>
            </div>
          </div>

          <SearchForm />
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-2xl font-semibold">
          Où partir au départ de Paris, du moins cher au plus cher
        </h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Prix les plus bas relevés récemment pour un aller simple, taxes incluses. Cliquez sur une
          destination pour voir les vols et le vendeur de chaque billet.
        </p>
        <div className="mt-6">
          <DestinationPriceGrid prices={prices} origin="PAR" error={error} debug={debug} />
        </div>
      </section>

      <section className="border-y border-border bg-secondary/40 py-14">
        <div className="container-page">
          <h2 className="font-display text-2xl font-semibold">Pourquoi passer par nous</h2>
          <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
            La plupart des comparateurs vivent de l'urgence artificielle et du classement payant. Nous avons
            fait le choix inverse : une information complète, vérifiable, et un chemin de réservation le
            plus court possible.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {REASONS.map((reason) => (
              <div key={reason.title} className="rounded-xl border border-border bg-card p-5">
                <reason.icon className="size-5 text-primary" aria-hidden />
                <h3 className="mt-3 text-base font-semibold">{reason.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{reason.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="font-display text-2xl font-semibold">Nos pages destinations</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Chaque page détaille la meilleure période pour partir, l'évolution des prix sur douze mois et
          les questions les plus fréquentes sur le trajet.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {DESTINATIONS.map((d) => (
            <li key={d.slug}>
              <Link
                to="/vols-pas-chers/$slug"
                params={{ slug: d.slug }}
                className="block rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
              >
                <span className="text-sm font-semibold">
                  Vols pas chers {d.originCity} — {d.destinationCity}
                </span>
                <span className="mt-1 block text-xs text-muted-foreground">
                  {d.country} · {d.bestMonths}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
