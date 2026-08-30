import { Link } from "@tanstack/react-router";

import { DESTINATIONS } from "@/data/destinations";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <p className="font-display text-lg font-semibold">TrouveMonVol</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Comparateur de vols sans faux compte à rebours, sans classement payant et sans frais surprise.
            Nous affichons le prix total et le nom du vendeur réel sur chaque résultat.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Destinations populaires</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {DESTINATIONS.slice(0, 6).map((d) => (
              <li key={d.slug}>
                <Link
                  to="/vols-pas-chers/$slug"
                  params={{ slug: d.slug }}
                  className="transition-colors hover:text-foreground"
                >
                  {d.originCity} — {d.destinationCity}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Le site</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/mode-budget"
                search={{ origin: "PAR", budget: 400, month: "" }}
                className="transition-colors hover:text-foreground">
                Mode budget
              </Link>
            </li>
            <li>
              <Link to="/conseils" className="transition-colors hover:text-foreground">
                Conseils voyage
              </Link>
            </li>
            <li>
              <Link to="/faq" className="transition-colors hover:text-foreground">
                Questions fréquentes
              </Link>
            </li>
            <li>
              <Link
                to="/comment-on-gagne-de-l-argent"
                className="transition-colors hover:text-foreground"
              >
                Comment on gagne de l'argent
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page border-t border-border py-6 text-xs text-muted-foreground">
        Prix indicatifs fournis par nos partenaires de distribution, taxes incluses. Nous touchons une
        commission d'affiliation si vous réservez — sans que cela change le prix que vous payez.
      </div>
    </footer>
  );
}
