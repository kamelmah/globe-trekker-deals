"use client";

import * as React from "react";
import { ReceiptText, Store, TimerOff, BellRing, type LucideIcon } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  TrustBar                                                                  */
/*  Les 4 arguments sont le seul avantage concurrentiel du site : ils         */
/*  méritent du poids visuel, pas une ligne de texte gris.                    */
/* -------------------------------------------------------------------------- */

export interface TrustItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const DEFAULT_TRUST_ITEMS: TrustItem[] = [
  {
    icon: ReceiptText,
    title: "Prix total, taxes incluses",
    description:
      "Le montant affiché est celui que vous payez. Bagage et frais de service compris quand le vendeur les publie.",
  },
  {
    icon: Store,
    title: "Vendeur identifié",
    description: "Vous savez chez qui vous réservez avant de cliquer, jamais après.",
  },
  {
    icon: TimerOff,
    title: "Aucun faux compte à rebours",
    description:
      "Pas de « plus que 2 places », pas d'urgence fabriquée. Les prix bougent, on vous le dit sans vous presser.",
  },
  {
    icon: BellRing,
    title: "Alerte prix sans compte",
    description:
      "Votre email suffit. On vous écrit seulement si le prix passe sous le dernier tarif relevé.",
  },
];

export function TrustBar({
  items = DEFAULT_TRUST_ITEMS,
  className = "",
}: {
  items?: TrustItem[];
  className?: string;
}) {
  return (
    <ul className={"grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4 " + className}>
      {items.map(({ icon: Icon, title, description }) => (
        <li
          key={title}
          className="group flex flex-col gap-2.5 rounded-xl border border-border bg-card/50 p-4
                     transition duration-300 hover:border-[var(--ring)]/50 hover:bg-card"
        >
          <span
            className="flex size-9 items-center justify-center rounded-lg bg-primary/12
                       text-primary transition duration-300 group-hover:bg-primary/20"
            aria-hidden
          >
            <Icon className="size-[18px]" strokeWidth={2} />
          </span>
          <span className="text-sm font-semibold leading-snug text-foreground">{title}</span>
          <span className="text-[13px] leading-relaxed text-muted-foreground">{description}</span>
        </li>
      ))}
    </ul>
  );
}

/* -------------------------------------------------------------------------- */
/*  Variante compacte — pour poser juste sous le formulaire du hero           */
/* -------------------------------------------------------------------------- */

export function TrustStrip({
  items = DEFAULT_TRUST_ITEMS,
  className = "",
}: {
  items?: TrustItem[];
  className?: string;
}) {
  return (
    <ul className={"flex flex-wrap items-center justify-center gap-x-5 gap-y-2 " + className}>
      {items.map(({ icon: Icon, title }) => (
        <li key={title} className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
          <Icon className="size-4 text-primary" aria-hidden />
          {title}
        </li>
      ))}
    </ul>
  );
}

export default TrustBar;
