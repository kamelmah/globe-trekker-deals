"use client";

import * as React from "react";
import { Plane, ArrowRight } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export interface DestinationCardProps {
  /** Ville d'arrivée, ex. "Malaga" */
  city: string;
  /** Pays, ex. "Espagne" — optionnel mais recommandé */
  country?: string;
  /** Montant taxes incluses, en unités entières (15 → "dès 15 €") */
  price: number;
  currency?: string;
  /**
   * Montant déjà formaté, quand l'appelant gère lui-même la devise. Il prime
   * sur `price`/`currency` : le site convertit et formate en EUR, USD, GBP,
   * CHF ou CAD, ce qu'un nombre entier suivi d'un symbole ne sait pas rendre.
   */
  priceLabel?: string;
  /** Transporteur. Laisser vide affiche "Compagnie non communiquée". */
  seller?: string | null;
  /** Vol direct ou avec escale(s) */
  direct?: boolean;
  /** Date du relevé de prix — Date ou ISO string. TOUJOURS affichée. */
  observedAt: Date | string;
  /** URL de la photo. Absente ou en erreur → dégradé déterministe, jamais de doublon. */
  imageUrl?: string | null;
  /** Texte alternatif de la photo. À défaut, « Ville, Pays ». */
  imageAlt?: string;
  href?: string;
  /**
   * Rend l'enveloppe cliquable à la place du <a href>. Le site navigue avec le
   * routeur : un <a> nu rechargerait la page entière et perdrait le préchargement
   * au survol.
   */
  renderLink?: (props: DestinationLinkSlotProps) => React.ReactNode;
  className?: string;
}

export interface DestinationLinkSlotProps {
  className: string;
  children: React.ReactNode;
}

/* -------------------------------------------------------------------------- */
/*  Fallback visuel déterministe                                              */
/*  Pas de photo → un dégradé propre à la ville. Deux villes différentes      */
/*  n'auront jamais le même visuel : c'est ce qui règle le bug des images     */
/*  de stock dupliquées.                                                      */
/* -------------------------------------------------------------------------- */

const GRADIENTS = [
  "linear-gradient(135deg, oklch(45% .17 251), oklch(62% .13 220))",
  "linear-gradient(135deg, oklch(52% .175 251), oklch(70% .12 195))",
  "linear-gradient(135deg, oklch(48% .16 40), oklch(72% .15 78))",
  "linear-gradient(135deg, oklch(42% .14 300), oklch(62% .15 330))",
  "linear-gradient(135deg, oklch(40% .12 200), oklch(60% .13 155))",
  "linear-gradient(135deg, oklch(58% .19 41), oklch(75% .14 70))",
  "linear-gradient(135deg, oklch(38% .11 265), oklch(55% .155 249))",
  "linear-gradient(135deg, oklch(45% .13 165), oklch(68% .11 200))",
];

function hashString(input: string) {
  let h = 0;
  for (let i = 0; i < input.length; i++) {
    h = (h << 5) - h + input.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

function gradientFor(city: string) {
  return GRADIENTS[hashString(city) % GRADIENTS.length];
}

/* -------------------------------------------------------------------------- */
/*  Formatage                                                                 */
/* -------------------------------------------------------------------------- */

/*
 * Fuseau UTC, comme partout ailleurs sur le site (voir lib/dates.ts). Sans lui,
 * un relevé enregistré à « 2026-09-01T23:30:00Z » s'affiche « 1 septembre » sur
 * le serveur et « 2 septembre » dans un navigateur à Paris : deux rendus
 * différents pour le même HTML, donc une erreur d'hydratation en plus d'une
 * date fausse.
 */
const dateFmt = new Intl.DateTimeFormat("fr-FR", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

function formatObserved(value: Date | string) {
  const d = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(d.getTime())) return null;
  return dateFmt.format(d);
}

/* -------------------------------------------------------------------------- */
/*  DestinationCard                                                           */
/* -------------------------------------------------------------------------- */

export function DestinationCard({
  city,
  country,
  price,
  currency = "€",
  priceLabel,
  seller,
  direct = true,
  observedAt,
  imageUrl,
  imageAlt,
  href = "#",
  renderLink,
  className = "",
}: DestinationCardProps) {
  const [imageFailed, setImageFailed] = React.useState(false);
  const showImage = Boolean(imageUrl) && !imageFailed;
  const observed = formatObserved(observedAt);

  const wrapperClass =
    "group flex flex-col overflow-hidden rounded-xl border border-border bg-card " +
    "transition duration-300 hover:-translate-y-1 hover:border-[var(--ring)]/60 " +
    "hover:shadow-xl hover:shadow-black/25 " +
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] " +
    className;

  const content = (
    <>
      {/* Visuel --------------------------------------------------------- */}
      <div className="relative aspect-[4/3] overflow-hidden">
        {showImage ? (
          <img
            src={imageUrl as string}
            alt={imageAlt ?? `${city}${country ? `, ${country}` : ""}`}
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div
            className="size-full transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: gradientFor(city) }}
            aria-hidden
          >
            <div className="flex size-full items-center justify-center">
              <Plane className="size-10 text-white/25" strokeWidth={1.5} aria-hidden />
            </div>
          </div>
        )}

        {/* Badge direct / escale */}
        <span
          className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[11px]
                     font-medium text-white backdrop-blur-sm"
        >
          {direct ? "Direct" : "Avec escale"}
        </span>

        {/* Voile bas pour lisibilité si photo claire */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-black/40 to-transparent"
          aria-hidden
        />
      </div>

      {/* Contenu -------------------------------------------------------- */}
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="text-base font-semibold text-foreground">{city}</h3>
          {country ? (
            <span className="shrink-0 text-xs text-muted-foreground">{country}</span>
          ) : null}
        </div>

        <p className="text-2xl font-bold text-primary">
          {priceLabel ? (
            <>dès {priceLabel}</>
          ) : (
            <>
              dès {price}&nbsp;{currency}
            </>
          )}
        </p>

        <p className="text-sm text-muted-foreground">
          {seller?.trim() ? seller : "Compagnie non communiquée"}
        </p>

        {/* La date de relevé est TOUJOURS rendue, sur toutes les cartes.
            C'est le cœur de la promesse « prix observé, pas prix garanti ». */}
        <p className="mt-auto pt-2 text-xs text-muted-foreground/80">
          {observed
            ? `Aller simple taxes incluses · relevé le ${observed}`
            : "Aller simple taxes incluses · prix observé"}
        </p>

        <span className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary opacity-0 transition-opacity duration-200 group-hover:opacity-100">
          Voir les offres
          <ArrowRight className="size-3.5" aria-hidden />
        </span>
      </div>
    </>
  );

  if (renderLink) return <>{renderLink({ className: wrapperClass, children: content })}</>;

  return (
    <a href={href} className={wrapperClass}>
      {content}
    </a>
  );
}

/* -------------------------------------------------------------------------- */
/*  Grille prête à l'emploi                                                   */
/* -------------------------------------------------------------------------- */

export function DestinationGrid({
  items,
  className = "",
}: {
  items: DestinationCardProps[];
  className?: string;
}) {
  return (
    <div className={"grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 " + className}>
      {items.map((item) => (
        <DestinationCard key={`${item.city}-${item.price}`} {...item} />
      ))}
    </div>
  );
}

export default DestinationCard;
