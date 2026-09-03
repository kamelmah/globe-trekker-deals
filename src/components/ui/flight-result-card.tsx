"use client";

import * as React from "react";
import { Store, ChevronDown, Briefcase, Backpack, Luggage, Check, Plane } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

/** Une ligne du détail du prix. Le total affiché doit être la somme des lignes. */
export interface PriceLine {
  label: string;
  amount: number;
  /** Ligne mise en avant (le tarif de base), sinon frais/taxes. */
  base?: boolean;
}

export type BaggageState =
  { included: true } | { included: false; price: number } | { included: false; unavailable: true };

export interface BaggagePolicy {
  /** Sac sous le siège. Presque toujours inclus. */
  personalItem?: BaggageState;
  /** Bagage cabine en coffre. C'est celui qui fait exploser le prix chez les low cost. */
  cabin?: BaggageState;
  /** Bagage en soute. */
  checked?: BaggageState;
}

export interface FlightResultCardProps {
  airlineName: string;
  /** Code IATA compagnie, ex. "AH". Sert de pastille quand il n'y a pas de logo. */
  airlineCode: string;
  airlineLogoUrl?: string | null;

  fromIata: string;
  toIata: string;
  departTime: string;
  arriveTime: string;
  /** Arrivée le lendemain : affiche un +1 discret. */
  arrivesNextDay?: boolean;
  /** Durée totale déjà formatée, ex. "1 h 35". */
  duration: string;
  stops: number;
  /** Précision escale, ex. "1 escale (ORY)". Calculé si absent. */
  stopsLabel?: string;

  /** Prix TOTAL taxes incluses. C'est le seul montant en gros sur la carte. */
  totalPrice: number;
  currency?: string;
  priceBreakdown?: PriceLine[];

  /** Nom du vendeur, affiché avant le clic. Obligatoire : c'est la promesse du site. */
  seller: string;
  /** URL de réservation (deep link affilié). Ouvert en sponsored nofollow. */
  bookingUrl: string;

  baggage?: BaggagePolicy;

  /** Date du relevé de ce tarif. */
  observedAt?: Date | string;
  /** Met la carte en avant et affiche « Meilleur prix ». Une seule par liste. */
  best?: boolean;

  onSelect?: () => void;
  className?: string;
}

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                   */
/* -------------------------------------------------------------------------- */

const eur = (n: number, currency = "€") =>
  `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n)} ${currency}`;

const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
});

function formatObserved(value?: Date | string) {
  if (!value) return null;
  const d = value instanceof Date ? value : new Date(value);
  return Number.isNaN(d.getTime()) ? null : dateFmt.format(d);
}

function defaultStopsLabel(stops: number) {
  if (stops === 0) return "Direct";
  return stops === 1 ? "1 escale" : `${stops} escales`;
}

/* -------------------------------------------------------------------------- */
/*  Puce bagage                                                               */
/* -------------------------------------------------------------------------- */

function BaggageChip({
  icon: Icon,
  label,
  state,
  currency,
}: {
  icon: React.ElementType;
  label: string;
  state: BaggageState;
  currency: string;
}) {
  const included = state.included;
  const unavailable = !state.included && "unavailable" in state;

  return (
    <span
      className={
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] " +
        (included ? "border-border text-foreground" : "border-border text-muted-foreground")
      }
    >
      <Icon className="size-3 shrink-0" aria-hidden />
      {label}
      {included ? (
        <span className="inline-flex items-center gap-0.5 font-medium text-[var(--success,oklch(60%_.13_155))]">
          <Check className="size-3" strokeWidth={3} aria-hidden />
          inclus
        </span>
      ) : unavailable ? (
        <span className="font-medium">non proposé</span>
      ) : (
        <span className="font-medium tabular-nums">
          +{eur((state as { price: number }).price, currency)}
        </span>
      )}
    </span>
  );
}

/* -------------------------------------------------------------------------- */
/*  FlightResultCard                                                          */
/* -------------------------------------------------------------------------- */

export function FlightResultCard({
  airlineName,
  airlineCode,
  airlineLogoUrl,
  fromIata,
  toIata,
  departTime,
  arriveTime,
  arrivesNextDay = false,
  duration,
  stops,
  stopsLabel,
  totalPrice,
  currency = "€",
  priceBreakdown,
  seller,
  bookingUrl,
  baggage,
  observedAt,
  best = false,
  onSelect,
  className = "",
}: FlightResultCardProps) {
  const [open, setOpen] = React.useState(false);
  const detailsId = React.useId();
  const observed = formatObserved(observedAt);
  const isDirect = stops === 0;

  const breakdownTotal = priceBreakdown
    ? priceBreakdown.reduce((sum, l) => sum + l.amount, 0)
    : null;

  return (
    <article
      className={
        "rounded-2xl border bg-card p-4 transition duration-200 " +
        (best
          ? "border-[var(--ring)] shadow-lg shadow-black/10"
          : "border-border hover:border-[var(--ring)]/60") +
        " " +
        className
      }
    >
      {best ? (
        <p className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-1 text-[11px] font-semibold text-primary">
          <Plane className="size-3" aria-hidden />
          Meilleur prix total sur cette recherche
        </p>
      ) : null}

      {/* Ligne principale ------------------------------------------------- */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex min-w-[250px] flex-1 items-center gap-4">
          {airlineLogoUrl ? (
            <img
              src={airlineLogoUrl}
              alt=""
              width={40}
              height={40}
              loading="lazy"
              className="size-10 shrink-0 rounded-lg object-contain"
            />
          ) : (
            <span
              className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-[11px] font-bold text-muted-foreground"
              aria-hidden
            >
              {airlineCode}
            </span>
          )}

          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-lg font-bold tabular-nums text-foreground">{departTime}</span>
              <span className="text-muted-foreground" aria-hidden>
                —
              </span>
              <span className="text-lg font-bold tabular-nums text-foreground">
                {arriveTime}
                {arrivesNextDay ? (
                  <sup className="ml-0.5 text-[11px] font-semibold text-muted-foreground">+1</sup>
                ) : null}
              </span>
            </div>
            <p className="mt-0.5 text-[13px] text-muted-foreground">
              {fromIata} → {toIata} · {duration} ·{" "}
              <span
                className={isDirect ? "font-medium text-[var(--success,oklch(60%_.13_155))]" : ""}
              >
                {stopsLabel ?? defaultStopsLabel(stops)}
              </span>{" "}
              · {airlineName}
            </p>
          </div>
        </div>

        {/* Prix + CTA */}
        <div className="flex items-end gap-4">
          <div className="text-right">
            <p className="text-2xl font-extrabold tabular-nums text-foreground">
              {eur(totalPrice, currency)}
            </p>
            <p className="text-[11px] font-medium text-muted-foreground">total, taxes incluses</p>
          </div>
          <a
            href={bookingUrl}
            target="_blank"
            rel="sponsored nofollow noopener"
            onClick={onSelect}
            className={
              "rounded-lg px-4 py-2.5 text-sm font-semibold transition " +
              (best
                ? "bg-[var(--highlight)] text-[var(--highlight-foreground)] hover:brightness-110"
                : "border border-border text-foreground hover:border-[var(--ring)]")
            }
          >
            Voir l'offre
          </a>
        </div>
      </div>

      {/* Pied : vendeur, bagages, détail ---------------------------------- */}
      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border pt-3">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-foreground">
          <Store className="size-3 text-primary" aria-hidden />
          Vendu par {seller}
        </span>

        {baggage?.personalItem ? (
          <BaggageChip
            icon={Backpack}
            label="Objet personnel"
            state={baggage.personalItem}
            currency={currency}
          />
        ) : null}
        {baggage?.cabin ? (
          <BaggageChip
            icon={Briefcase}
            label="Bagage cabine"
            state={baggage.cabin}
            currency={currency}
          />
        ) : null}
        {baggage?.checked ? (
          <BaggageChip
            icon={Luggage}
            label="Bagage soute"
            state={baggage.checked}
            currency={currency}
          />
        ) : null}

        {priceBreakdown?.length ? (
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls={detailsId}
            className="ml-auto inline-flex items-center gap-1 text-[12px] font-medium text-primary underline-offset-2 hover:underline"
          >
            Détail du prix
            <ChevronDown
              className={"size-3.5 transition-transform duration-200 " + (open ? "rotate-180" : "")}
              aria-hidden
            />
          </button>
        ) : null}
      </div>

      {/* Détail du prix ---------------------------------------------------- */}
      {priceBreakdown?.length ? (
        <div id={detailsId} hidden={!open} className="mt-3">
          <dl className="flex flex-col gap-1.5 rounded-xl border border-border bg-muted/40 p-3">
            {priceBreakdown.map((line) => (
              <div
                key={line.label}
                className="flex items-baseline justify-between gap-4 text-[13px]"
              >
                <dt className={line.base ? "font-medium text-foreground" : "text-muted-foreground"}>
                  {line.label}
                </dt>
                <dd className="tabular-nums text-foreground">{eur(line.amount, currency)}</dd>
              </div>
            ))}

            <div className="mt-1 flex items-baseline justify-between gap-4 border-t border-border pt-2 text-sm">
              <dt className="font-semibold text-foreground">Total à payer</dt>
              <dd className="font-bold tabular-nums text-foreground">
                {eur(breakdownTotal ?? totalPrice, currency)}
              </dd>
            </div>
          </dl>

          <p className="mt-2 text-[11px] leading-relaxed text-muted-foreground">
            {observed
              ? `Tarif relevé le ${observed} chez ${seller}. `
              : `Tarif relevé chez ${seller}. `}
            Prix observé, non garanti : il peut avoir changé depuis le relevé. Nous touchons une
            commission si vous réservez, sans que cela change le prix que vous payez.
          </p>
        </div>
      ) : null}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/*  Liste                                                                     */
/* -------------------------------------------------------------------------- */

export function FlightResultList({
  results,
  className = "",
}: {
  results: FlightResultCardProps[];
  className?: string;
}) {
  return (
    <div className={"flex flex-col gap-3 " + className}>
      {results.map((r, i) => (
        <FlightResultCard key={`${r.airlineCode}-${r.departTime}-${i}`} {...r} />
      ))}
    </div>
  );
}

export default FlightResultCard;
