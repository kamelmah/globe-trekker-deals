import { Link } from "@tanstack/react-router";

import logo from "@/assets/logo-64.png";
import logoWebp from "@/assets/logo-64.webp";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { DESTINATIONS } from "@/data/destinations";
import { useCookieConsent } from "@/lib/cookie-consent-context";

const linkClass = "transition-colors hover:text-foreground";

export function Footer() {
  const year = new Date().getFullYear();
  const { openManager } = useCookieConsent();

  return (
    <footer className="mt-20 border-t border-border bg-secondary/40">
      <div className="container-page grid gap-10 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2">
            <ResponsivePicture
              src={logo}
              webp={logoWebp}
              alt="TrouveMonVol"
              width={32}
              height={32}
              loading="lazy"
              className="size-8 shrink-0"
            />
            <p className="font-display text-lg font-semibold">TrouveMonVol</p>
          </div>
          <p className="mt-2 text-sm font-medium">Le comparateur de vols transparent</p>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Prix total taxes incluses, vendeur réel affiché sur chaque résultat, sans faux compte à
            rebours ni classement payant.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold">Destinations populaires</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {DESTINATIONS.slice(0, 6).map((d) => (
              <li key={d.slug}>
                <Link to="/vols/$slug" params={{ slug: d.slug }} className={linkClass}>
                  {d.originCity} — {d.destinationCity}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Explorer</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link
                to="/mode-budget"
                search={{ origin: "PAR", budget: 400, month: "" }}
                className={linkClass}
              >
                Mode budget
              </Link>
            </li>
            <li>
              <Link to="/conseils" className={linkClass}>
                Blog conseils voyage
              </Link>
            </li>
            <li>
              <Link to="/faq" className={linkClass}>
                Questions fréquentes (FAQ)
              </Link>
            </li>
            <li>
              <Link to="/indemnisation" className={linkClass}>
                Vol retardé ou annulé
              </Link>
            </li>
            <li>
              <Link to="/contact" className={linkClass}>
                Contact & newsletter
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold">Informations légales</p>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/mentions-legales" className={linkClass}>
                Mentions légales
              </Link>
            </li>
            <li>
              <Link to="/cgu" className={linkClass}>
                Conditions générales d'utilisation
              </Link>
            </li>
            <li>
              <Link to="/confidentialite" className={linkClass}>
                Politique de confidentialité
              </Link>
            </li>
            <li>
              <Link to="/cookies" className={linkClass}>
                Cookies
              </Link>
            </li>
            <li>
              <button type="button" onClick={openManager} className={`${linkClass} cursor-pointer text-left`}>
                Gérer mes cookies
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="container-page space-y-2 border-t border-border py-6 text-xs text-muted-foreground">
        <p>
          Prix indicatifs fournis par nos partenaires de distribution, taxes incluses. Nous touchons
          une commission d'affiliation si vous réservez — sans que cela change le prix que vous payez.
        </p>
        <p>© {year} TrouveMonVol — Tous droits réservés.</p>
      </div>
    </footer>
  );
}
