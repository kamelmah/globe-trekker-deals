import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BedDouble, Menu, Plane } from "lucide-react";
import { useCallback, useState } from "react";

import logo from "@/assets/logo-64.png";
import logoWebp from "@/assets/logo-64.webp";
import { CurrencySelect } from "@/components/site/CurrencySelect";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/mode-budget", label: "Mode budget", search: { origin: "PAR", budget: 400, month: "" } },
  { to: "/conseils/destinations", label: "Guides destinations" },
  { to: "/conseils", label: "Conseils" },
  { to: "/faq", label: "FAQ" },
  { to: "/contact", label: "Contact" },
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
      <div className="container-page flex h-16 items-center justify-between gap-2 sm:gap-3">
        <Link
          to="/"
          className="flex shrink-0 items-center gap-1.5 whitespace-nowrap font-display text-base font-semibold sm:gap-2 sm:text-lg"
        >
          <ResponsivePicture
            src={logo}
            webp={logoWebp}
            alt="TrouveMonVol"
            width={40}
            height={40}
            className="size-9 shrink-0 rounded-lg object-contain dark:drop-shadow-[0_0_8px_rgba(59,130,246,0.45)] sm:size-10"
          />
          TrouveMonVol
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Navigation principale">
          {NAV.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              search={"search" in item ? item.search : {}}
              // px-2 sous xl : à 1024px il manque une quinzaine de pixels pour
              // que la barre tienne sur une ligne. Padding plein dès xl.
              className="whitespace-nowrap rounded-md px-2 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground xl:px-3"
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {item.label}
            </Link>
          ))}
          {/*
            « Trouver un hébergement » pesait 218px à lui seul : c'est ce bouton
            qui empêchait la barre de tenir. Il n'apparaît qu'à partir de xl, et
            sous son libellé court — en entier, même à 1280px, la barre repasse
            en débordement. Le libellé complet reste dans le menu burger sous lg,
            et dans le pied de page entre les deux.
          */}
          <Button
            variant="outline"
            onClick={onStayClick}
            aria-label="Trouver un hébergement"
            className="ml-2 hidden gap-1.5 whitespace-nowrap xl:flex"
          >
            <BedDouble className="size-4" aria-hidden />
            Hébergement
          </Button>
          <Button onClick={onCtaClick} className="ml-1 gap-1.5 whitespace-nowrap shadow-sm">
            <Plane className="size-4" aria-hidden />
            Trouve mon vol
          </Button>
        </nav>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          <CurrencySelect />
          <Button
            variant="outline"
            size="icon"
            className="lg:hidden"
            aria-label="Ouvrir le menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <Menu className="size-4" aria-hidden />
          </Button>
        </div>
      </div>

      {open && (
        <nav className="border-t border-border bg-card lg:hidden" aria-label="Navigation mobile">
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
            <Button variant="outline" onClick={onStayClick} className="mx-2 mb-2 mt-1 gap-1.5">
              <BedDouble className="size-4" aria-hidden />
              Trouver un hébergement
            </Button>
            <Button onClick={onCtaClick} className="mx-2 mb-2 gap-1.5">
              <Plane className="size-4" aria-hidden />
              Trouve mon vol
            </Button>
          </div>
        </nav>
      )}
    </header>
  );
}
