"use client";

import * as React from "react";
import { ArrowLeftRight, CalendarDays, Users, Wallet, MapPin, Plane, Check } from "lucide-react";

/* -------------------------------------------------------------------------- */
/*  Types                                                                     */
/* -------------------------------------------------------------------------- */

export type DureeSejour = "precises" | "weekend" | "3-4-jours" | "1-semaine" | "2-semaines";

export interface FlightSearchValue {
  from: string;
  to: string;
  departure: string;
  returnDate: string;
  passengers: string;
  budget: string;
  flexible: boolean;
  duree: DureeSejour;
}

export interface FlightSearchCardProps {
  value?: Partial<FlightSearchValue>;
  onChange?: (value: FlightSearchValue) => void;
  onSubmit?: (value: FlightSearchValue) => void;
  /** Rendu à la place de l'<input> date : branche ton propre date picker ici. */
  renderDepartureField?: (props: FieldSlotProps) => React.ReactNode;
  renderReturnField?: (props: FieldSlotProps) => React.ReactNode;
  /** Rendu à la place des <input> ville : branche ton autocomplete aéroport ici. */
  renderFromField?: (props: FieldSlotProps) => React.ReactNode;
  renderToField?: (props: FieldSlotProps) => React.ReactNode;
  /**
   * Rendu à la place de l'<input> passagers.
   *
   * Ajouté au composant d'origine : sans ce point d'accroche, brancher la carte
   * sur le site aurait réduit « 2 adultes, 1 enfant, 1 bébé » à une chaîne de
   * texte libre, et la recherche aurait perdu le détail enfants/bébés qu'elle
   * transmet à l'API tarifaire.
   */
  renderPassengersField?: (props: FieldSlotProps) => React.ReactNode;
  /** Désactive le bouton pendant une vérification asynchrone. */
  submitting?: boolean;
  /** Remplace le libellé du bouton quand l'appelant sait mieux que la carte. */
  submitLabel?: string;
  className?: string;
}

export interface FieldSlotProps {
  value: string;
  onChange: (next: string) => void;
  placeholder: string;
  id: string;
}

const DEFAULTS: FlightSearchValue = {
  from: "",
  to: "",
  departure: "",
  returnDate: "",
  passengers: "1 adulte",
  budget: "",
  flexible: false,
  duree: "precises",
};

const DUREES: { id: DureeSejour; label: string }[] = [
  { id: "precises", label: "Dates précises" },
  { id: "weekend", label: "Weekend" },
  { id: "3-4-jours", label: "3-4 jours" },
  { id: "1-semaine", label: "1 semaine" },
  { id: "2-semaines", label: "2 semaines" },
];

const DUREE_HINTS: Record<DureeSejour, string> = {
  precises: "Choisissez librement vos dates d'aller et de retour.",
  weekend: "Départ le vendredi ou samedi, retour le dimanche ou lundi.",
  "3-4-jours": "Séjours courts, retour 3 à 4 jours après le départ.",
  "1-semaine": "Séjours de 6 à 8 nuits autour de votre date de départ.",
  "2-semaines": "Séjours de 13 à 15 nuits autour de votre date de départ.",
};

/* -------------------------------------------------------------------------- */
/*  Field — bloc de saisie avec label discret et valeur en gros                */
/* -------------------------------------------------------------------------- */

function Field({
  id,
  label,
  hint,
  icon: Icon,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  icon?: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div
      className="group relative rounded-xl border border-border bg-background/40 px-4 py-3
                 transition-colors duration-200
                 focus-within:border-[var(--ring)] focus-within:bg-background/70
                 hover:border-border/80"
    >
      <label
        htmlFor={id}
        className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground"
      >
        {Icon ? <Icon className="size-3.5" aria-hidden /> : null}
        {label}
        {hint ? (
          <span className="font-normal normal-case tracking-normal opacity-70">{hint}</span>
        ) : null}
      </label>
      <div className="mt-1">{children}</div>
    </div>
  );
}

/**
 * Habillage d'une valeur posée dans un `Field` : pas de bordure ni de fond, la
 * boîte du `Field` les porte déjà. Exporté pour que les contrôles du site
 * branchés dans les slots (autocomplete, sélecteurs) s'alignent dessus au lieu
 * d'empiler une seconde bordure et un second label dans la même case.
 */
export const fieldInputClass =
  "w-full bg-transparent p-0 text-lg font-semibold text-foreground outline-none " +
  "placeholder:font-normal placeholder:text-muted-foreground/70";

const inputClass = fieldInputClass;

/* -------------------------------------------------------------------------- */
/*  FlightSearchCard                                                          */
/* -------------------------------------------------------------------------- */

export function FlightSearchCard({
  value,
  onChange,
  onSubmit,
  renderFromField,
  renderToField,
  renderDepartureField,
  renderReturnField,
  renderPassengersField,
  submitting = false,
  submitLabel,
  className = "",
}: FlightSearchCardProps) {
  const [internal, setInternal] = React.useState<FlightSearchValue>({
    ...DEFAULTS,
    ...value,
  });

  // Si le parent pilote la valeur, on la reflète.
  React.useEffect(() => {
    if (value) setInternal((prev) => ({ ...prev, ...value }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(value ?? {})]);

  /*
   * `onChange` est notifié DEPUIS le gestionnaire d'événement, pas depuis la
   * fonction de mise à jour passée à `setInternal`. Prévenir le parent dans
   * l'updater le ferait se mettre à jour pendant le rendu de cette carte —
   * React le signale, et StrictMode, qui appelle l'updater deux fois, émettrait
   * l'événement en double.
   */
  const set = <K extends keyof FlightSearchValue>(key: K, next: FlightSearchValue[K]) => {
    const merged = { ...internal, [key]: next };
    setInternal(merged);
    onChange?.(merged);
  };

  const swap = () => {
    const merged = { ...internal, from: internal.to, to: internal.from };
    setInternal(merged);
    onChange?.(merged);
  };

  const modeBudget = internal.to.trim() === "";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(internal);
  };

  const slot = (
    custom: ((p: FieldSlotProps) => React.ReactNode) | undefined,
    p: FieldSlotProps,
    fallback: React.ReactNode,
  ) => (custom ? custom(p) : fallback);

  return (
    <form
      onSubmit={handleSubmit}
      className={
        "rounded-2xl border border-border bg-card/70 p-4 shadow-xl shadow-black/20 " +
        "backdrop-blur-sm sm:p-6 " +
        className
      }
    >
      {/* Trajet ------------------------------------------------------------ */}
      <div className="relative grid gap-3 sm:grid-cols-2">
        <Field id="tmv-from" label="Départ" icon={MapPin}>
          {slot(
            renderFromField,
            {
              id: "tmv-from",
              value: internal.from,
              onChange: (v) => set("from", v),
              placeholder: "Ville ou aéroport",
            },
            <input
              id="tmv-from"
              className={inputClass}
              placeholder="Ville ou aéroport"
              value={internal.from}
              onChange={(e) => set("from", e.target.value)}
              autoComplete="off"
            />,
          )}
        </Field>

        {/* Bouton swap, centré sur la gouttière en desktop */}
        <button
          type="button"
          onClick={swap}
          aria-label="Inverser départ et destination"
          className="absolute left-1/2 top-1/2 z-10 hidden size-9 -translate-x-1/2 -translate-y-1/2
                     items-center justify-center rounded-full border border-border bg-card
                     text-muted-foreground shadow-md transition
                     hover:scale-105 hover:border-[var(--ring)] hover:text-foreground
                     focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)]
                     sm:flex"
        >
          <ArrowLeftRight className="size-4" aria-hidden />
        </button>

        <Field id="tmv-to" label="Destination" hint="— facultatif">
          {slot(
            renderToField,
            {
              id: "tmv-to",
              value: internal.to,
              onChange: (v) => set("to", v),
              placeholder: "Peu importe — mode budget",
            },
            <input
              id="tmv-to"
              className={inputClass}
              placeholder="Peu importe — mode budget"
              value={internal.to}
              onChange={(e) => set("to", e.target.value)}
              autoComplete="off"
            />,
          )}
        </Field>
      </div>

      {/* Dates ------------------------------------------------------------- */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field id="tmv-dep" label="Date de départ" icon={CalendarDays}>
          {slot(
            renderDepartureField,
            {
              id: "tmv-dep",
              value: internal.departure,
              onChange: (v) => set("departure", v),
              placeholder: "Choisir une date",
            },
            <input
              id="tmv-dep"
              className={inputClass}
              placeholder="Choisir une date"
              value={internal.departure}
              onChange={(e) => set("departure", e.target.value)}
            />,
          )}
        </Field>

        <Field id="tmv-ret" label="Date de retour" hint="— facultatif">
          {slot(
            renderReturnField,
            {
              id: "tmv-ret",
              value: internal.returnDate,
              onChange: (v) => set("returnDate", v),
              placeholder: "Choisir une date",
            },
            <input
              id="tmv-ret"
              className={inputClass}
              placeholder="Choisir une date"
              value={internal.returnDate}
              onChange={(e) => set("returnDate", e.target.value)}
            />,
          )}
        </Field>
      </div>

      {/* Passagers + budget ------------------------------------------------ */}
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        <Field id="tmv-pax" label="Passagers" icon={Users}>
          {slot(
            renderPassengersField,
            {
              id: "tmv-pax",
              value: internal.passengers,
              onChange: (v) => set("passengers", v),
              placeholder: "1 adulte",
            },
            <input
              id="tmv-pax"
              className={inputClass}
              placeholder="1 adulte"
              value={internal.passengers}
              onChange={(e) => set("passengers", e.target.value)}
            />,
          )}
        </Field>

        <Field id="tmv-budget" label="Budget maximum" hint="— facultatif" icon={Wallet}>
          <div className="flex items-baseline gap-1">
            <input
              id="tmv-budget"
              inputMode="numeric"
              className={inputClass}
              placeholder="300"
              value={internal.budget}
              onChange={(e) => set("budget", e.target.value.replace(/[^\d]/g, ""))}
            />
            <span className="text-lg font-semibold text-muted-foreground">€</span>
          </div>
        </Field>
      </div>

      {/* Flexibilité ------------------------------------------------------- */}
      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          role="switch"
          aria-checked={internal.flexible}
          onClick={() => set("flexible", !internal.flexible)}
          className={
            "inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium transition " +
            (internal.flexible
              ? "border-[var(--ring)] bg-primary/15 text-foreground"
              : "border-border bg-background/40 text-muted-foreground hover:text-foreground")
          }
        >
          <span
            className={
              "flex size-4 items-center justify-center rounded-[5px] border transition " +
              (internal.flexible
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground/50")
            }
            aria-hidden
          >
            {internal.flexible ? <Check className="size-3" strokeWidth={3} /> : null}
          </span>
          Dates flexibles ± 3 jours
        </button>
      </div>

      {/* Durée du séjour --------------------------------------------------- */}
      <fieldset className="mt-4">
        <legend className="mb-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
          Durée du séjour
        </legend>
        <div
          role="group"
          aria-label="Durée du séjour"
          className="flex flex-wrap gap-1.5 rounded-xl border border-border bg-background/30 p-1.5"
        >
          {DUREES.map((d) => {
            const active = internal.duree === d.id;
            return (
              <button
                key={d.id}
                type="button"
                aria-pressed={active}
                onClick={() => set("duree", d.id)}
                className={
                  "rounded-lg px-3 py-1.5 text-sm font-medium transition " +
                  (active
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:bg-muted/40 hover:text-foreground")
                }
              >
                {d.label}
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">{DUREE_HINTS[internal.duree]}</p>
      </fieldset>

      {/* CTA --------------------------------------------------------------- */}
      <button
        type="submit"
        disabled={submitting}
        className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl
                   bg-[var(--highlight)] px-6 py-3.5 text-base font-semibold
                   text-[var(--highlight-foreground)] transition
                   hover:brightness-110 active:brightness-95
                   disabled:cursor-not-allowed disabled:opacity-60
                   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <Plane className="size-[18px]" aria-hidden />
        {submitLabel ??
          (modeBudget ? "Voir où partir avec mon budget" : "Comparer les prix totaux")}
      </button>

      <p className="mt-2.5 text-center text-xs text-muted-foreground">
        Prix total taxes incluses · vendeur affiché sur chaque résultat · aucun compte à rebours
        artificiel
      </p>
    </form>
  );
}

export default FlightSearchCard;
