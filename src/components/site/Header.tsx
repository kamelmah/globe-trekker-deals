import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { BedDouble, Bell, BookOpen, Compass, Plane } from "lucide-react";
import { type ReactNode, useCallback } from "react";

import logo from "@/assets/logo-64.png";
import logoWebp from "@/assets/logo-64.webp";
import { CurrencySelect } from "@/components/site/CurrencySelect";
import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { ThemeToggle } from "@/components/site/ThemeToggle";
import { Button } from "@/components/ui/button";

/**
 * Search par défaut du mode budget.
 *
 * L'ancienne barre n'en passait que trois champs ; la route en exige six depuis
 * l'ajout des passagers. Les valeurs reprises ici sont exactement celles que
 * `validateSearch` applique par défaut, donc la destination est inchangée.
 */
const RECHERCHE_BUDGET = {
  origin: "PAR",
  budget: 400,
  month: "",
  adultes: 1,
  enfants: 0,
  bebes: 0,
};

/**
 * Un onglet produit.
 *
 * Deux d'entre eux mènent à une page, trois agissent sur la page courante
 * (recherche, hébergement, alerte) : d'où un descripteur commun plutôt qu'une
 * simple liste de liens, pour que les deux barres — celle du haut en desktop et
 * celle du bas en mobile — se comportent exactement pareil.
 */
type Onglet = {
  id: "vols" | "budget" | "alertes" | "hotels" | "guides";
  label: string;
  Icone: typeof Plane;
  /** Vrai quand la page affichée correspond à cet onglet. */
  actif: (chemin: string) => boolean;
};

const ONGLETS: Record<Onglet["id"], Onglet> = {
  // « Vols » couvre l'accueil et les pages de trajet : c'est le même parcours.
  vols: {
    id: "vols",
    label: "Vols",
    Icone: Plane,
    actif: (c) => c === "/" || c.startsWith("/vols"),
  },
  budget: { id: "budget", label: "Budget", Icone: Compass, actif: (c) => c === "/mode-budget" },
  alertes: {
    id: "alertes",
    label: "Alertes",
    Icone: Bell,
    // Couvre /alertes et /alertes/desinscription, qui est la même histoire.
    actif: (c) => c.startsWith("/alertes"),
  },
  hotels: { id: "hotels", label: "Hôtels", Icone: BedDouble, actif: (c) => c === "/hebergement" },
  guides: {
    id: "guides",
    label: "Guides",
    Icone: BookOpen,
    actif: (c) => c.startsWith("/conseils"),
  },
};

const ORDRE_DESKTOP = ["vols", "budget", "hotels", "guides"] as const;
const ORDRE_MOBILE = ["vols", "budget", "alertes", "hotels", "guides"] as const;

/**
 * Fait défiler jusqu'à un élément. Rend faux s'il n'y a nulle part où aller.
 *
 * Être dans le DOM ne suffit pas : sur /recherche le formulaire d'alerte vit
 * dans un tiroir replié, où il mesure 0×0. `scrollIntoView` n'y fait rien, et
 * l'onglet paraissait mort. On exige donc une boîte réellement dessinée —
 * `getClientRects` est vide pour tout ce qui est en display:none.
 */
function allerVers(id: string): boolean {
  const cible = document.getElementById(id);
  if (!cible || cible.getClientRects().length === 0) return false;
  cible.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

export function Header() {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  /** Scroll vers le formulaire de recherche et focus sur le champ départ. */
  const focusSearchForm = useCallback(() => {
    allerVers("recherche");
    const firstField = document.getElementById("origin");
    if (firstField instanceof HTMLElement) {
      // Léger délai pour laisser le scroll démarrer avant le focus.
      window.setTimeout(() => firstField.focus({ preventScroll: true }), 350);
    }
  }, []);

  const onVolsClick = useCallback(() => {
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
  const onHotelsClick = useCallback(() => {
    if (allerVers("hebergement")) return;
    void navigate({ to: "/hebergement" });
  }, [navigate]);

  const actionDe = useCallback(
    (id: Onglet["id"]) => {
      if (id === "vols") return onVolsClick;
      if (id === "hotels") return onHotelsClick;
      return undefined;
    },
    [onVolsClick, onHotelsClick],
  );

  /**
   * Rend un onglet : `Link` pour ceux qui mènent à une page, `button` pour ceux
   * qui agissent sur la page courante. L'état actif se lit dans `pathname`
   * plutôt que dans `activeProps` — « Vols » est actif sur deux chemins et n'est
   * pas un lien, ce qu'`activeProps` ne sait pas exprimer.
   */
  const rendreOnglet = (id: Onglet["id"], classe: (actif: boolean) => string): ReactNode => {
    const { label, Icone, actif: estActif } = ONGLETS[id];
    const actif = estActif(pathname);
    const commun = {
      className: classe(actif),
      ...(actif ? { "aria-current": "page" as const } : {}),
    };
    const contenu = (
      <>
        <Icone className="shrink-0" aria-hidden />
        {label}
      </>
    );

    if (id === "budget") {
      return (
        <Link key={id} to="/mode-budget" search={RECHERCHE_BUDGET} {...commun}>
          {contenu}
        </Link>
      );
    }
    if (id === "guides") {
      return (
        <Link key={id} to="/conseils/destinations" {...commun}>
          {contenu}
        </Link>
      );
    }
    if (id === "alertes") {
      return (
        <Link key={id} to="/alertes" {...commun}>
          {contenu}
        </Link>
      );
    }
    return (
      <button key={id} type="button" onClick={actionDe(id)} {...commun}>
        {contenu}
      </button>
    );
  };

  return (
    <>
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

          <nav className="hidden lg:block" aria-label="Navigation principale">
            <div className="flex items-center gap-1 rounded-2xl border border-border/50 bg-secondary p-1">
              {ORDRE_DESKTOP.map((id) =>
                rendreOnglet(
                  id,
                  (actif) =>
                    "flex items-center gap-1.5 whitespace-nowrap rounded-lg px-3.5 py-[7px] text-sm transition-colors [&_svg]:size-4 " +
                    (actif
                      ? "bg-background font-semibold text-primary shadow-sm"
                      : "font-medium text-muted-foreground hover:text-foreground"),
                ),
              )}
            </div>
          </nav>

          {/*
            Sous lg, les commandes passent à 32px de haut : la navigation étant
            descendue en bas de l'écran, cette rangée n'est plus une cible
            tactile principale. Seule la hauteur change — forcer la largeur
            rendrait le sélecteur de devise illisible.
          */}
          <div className="flex shrink-0 items-center gap-1.5 [&_button]:h-8 sm:gap-2 lg:[&_button]:h-9">
            {/*
              Même état actif que les onglets, sur un bouton : sans lui, la
              barre du haut ne dirait pas qu'on est sur /alertes, alors que la
              barre du bas le dit.
            */}
            <Button asChild variant="outline" className="ml-1 hidden lg:inline-flex">
              <Link
                to="/alertes"
                className={
                  "gap-1.5 whitespace-nowrap" +
                  (ONGLETS.alertes.actif(pathname) ? " border-primary/60 text-primary" : "")
                }
                {...(ONGLETS.alertes.actif(pathname) ? { "aria-current": "page" as const } : {})}
              >
                <Bell className="size-4" aria-hidden />
                Alertes prix
              </Link>
            </Button>
            <ThemeToggle />
            <CurrencySelect />
          </div>
        </div>
      </header>

      {/*
        Barre du bas sous lg. Le pouce atteint le bas de l'écran bien plus
        facilement que le haut : c'est là que va la navigation principale sur
        mobile, et le menu déroulant disparaît avec elle. Le décalage de sécurité
        évite la barre d'accueil des iPhone.
      */}
      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
        aria-label="Navigation principale"
      >
        <div className="grid grid-cols-5">
          {ORDRE_MOBILE.map((id) =>
            rendreOnglet(
              id,
              (actif) =>
                "flex min-h-[56px] flex-col items-center justify-center gap-1 px-1 text-[11px] transition-colors [&_svg]:size-[22px] " +
                (actif ? "font-semibold text-primary" : "text-muted-foreground"),
            ),
          )}
        </div>
      </nav>
    </>
  );
}
