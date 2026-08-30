import { Link } from "@tanstack/react-router";
import { Menu, Plane } from "lucide-react";
import { useState } from "react";

import { CurrencySelect } from "@/components/site/CurrencySelect";
import { Button } from "@/components/ui/button";

const NAV = [
  { to: "/mode-budget", label: "Mode budget", search: { origin: "PAR", budget: 400, month: "" } },
  { to: "/conseils", label: "Conseils" },
  { to: "/faq", label: "FAQ" },
] as const;

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-background/90 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-3">
        <Link to="/" className="flex items-center gap-2 font-display text-lg font-semibold">
          <span className="flex size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Plane className="size-4" aria-hidden />
          </span>
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
          </div>
        </nav>
      )}
    </header>
  );
}
