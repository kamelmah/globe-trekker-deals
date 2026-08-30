import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BedDouble, Menu, Plane } from "lucide-react";
import { useCallback, useState } from "react";


import logo from "@/assets/logo.png";
import { CurrencySelect } from "@/components/site/CurrencySelect";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/mode-budget", label: "Mode budget", search: { origin: "PAR", budget: 400, month: "" } },
  { to: "/conseils/destinations", label: "Guides destinations" },
  { to: "/conseils", label: "Conseils" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  /** Scroll vers le formulaire de recherche et focus sur le champ départ. */
  const focusSearchForm = useCallback(() => {
    const form = document.getElementById("recherche");
    form?.scrollIntoView({ behavior: "smooth", block: "start" });
    const firstField = document.getElementById("origin");
    if (firstField instanceof HTMLElement) {
      // Léger délai pour laisser le scroll démarrer avant le focus.
      window.setTimeout(() => firstField.focus({ preventScroll: true }), 350);
    }
  }, []);

  const onCtaClick = useCallback(() => {
    setOpen(false);
    if (pathname === "/") {
      focusSearchForm();
      return;
    }
    void navigate({ to: "/" }).then(() => {
      // Attendre que la page d'accueil soit montée avant de scroller.
      window.setTimeout(focusSearchForm, 300);
    });
  }, [pathname, navigate, focusSearchForm]);

  /**
   * Si la page courante contient déjà un widget d'hébergement Stay22, on scrolle vers lui.
   * Sinon on redirige vers la page dédiée /hebergement.
   */
  const onStayClick = useCallback(() => {
    setOpen(false);
    const section = document.getElementById("hebergement");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    void navigate({ to: "/hebergement" });
  }, [navigate]);


  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <img
            src={logo}
            alt="TrouveMonVol"
            width={32}
            height={32}
            className="size-8 rounded-lg object-contain"
          />
          TrouveMonVol
        </Link>

        <nav className="hidden items-center gap-1 md:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={"search" in item ? item.search : {}}
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          <Button onClick={onCtaClick} className="ml-2 gap-1.5 shadow-sm">
            <Plane className="size-4" aria-hidden />
            Trouve mon vol
          </Button>
          <Button variant="outline" onClick={onStayClick} className="ml-1 gap-1.5">
            <BedDouble className="size-4" aria-hidden />
            Trouver un hébergement
          </Button>

        </nav>

        <div className="flex items-center gap-2">
          <CurrencySelect />
          <Button
            variant="outline"
            size="icon"
            className="md:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card md:hidden" aria-label="Navigation mobile">
          <div className="container-page flex flex-col py-2">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                search={"search" in item ? item.search : {}}
                onClick={() => setOpen(false)}
                className="rounded-md px-2 py-3 text-sm font-medium text-foreground"
              >
                {item.label}
              </Link>
            ))}
            <Button onClick={onCtaClick} className="mx-2 mb-2 mt-1 gap-1.5">
              <Plane className="size-4" aria-hidden />
              Trouve mon vol
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
