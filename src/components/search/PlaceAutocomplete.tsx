import { useQuery } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";

import { Input } from "@/components/ui/input";
import { getAirport } from "@/data/airports";
import { resolvePlace, searchPlaces } from "@/lib/places.functions";
import type { Place } from "@/lib/places.server";

function labelFor(code: string): string {
  const known = getAirport(code);
  if (known) return `${known.city} (${code})`;
  return code ? code : "";
}

export type PlaceAutocompleteProps = {
  id: string;
  label: string;
  value: string;
  onChange: (code: string) => void;
  placeholder?: string;
  /** Autorise un champ vide (mode budget : destination libre). */
  allowEmpty?: boolean;
  /** Texte brut saisi au clavier, même sans sélection dans la liste. */
  onTextChange?: (text: string) => void;
  /** Message d'erreur inline affiché sous le champ. */
  error?: string | null;
};

/**
 * Champ ville/aéroport couvrant le monde entier (API autocomplete Travelpayouts,
 * appelée côté serveur). La valeur remontée est toujours un code IATA.
 */
export function PlaceAutocomplete({
  id,
  label,
  value,
  onChange,
  placeholder = "Ville ou aéroport",
  allowEmpty = false,
}: PlaceAutocompleteProps) {
  const listId = useId();
  const [text, setText] = useState(() => labelFor(value));
  const [term, setTerm] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const wrapper = useRef<HTMLDivElement>(null);

  // Debounce 300 ms avant l'appel API.
  useEffect(() => {
    const handle = setTimeout(() => setTerm(text.trim()), 300);
    return () => clearTimeout(handle);
  }, [text]);

  useEffect(() => {
    function onDocClick(event: MouseEvent) {
      if (!wrapper.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  const enabled = term.length >= 2;
  const query = useQuery({
    queryKey: ["places", term],
    queryFn: () => searchPlaces({ data: { term } }),
    enabled,
    staleTime: 6 * 60 * 60 * 1000,
  });

  const places = query.data?.places ?? [];

  function select(place: Place) {
    onChange(place.code);
    setText(
      place.type === "airport"
        ? `${place.name} (${place.code})`
        : `${place.city || place.name} (${place.code})`,
    );
    setOpen(false);
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || places.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((i) => (i + 1) % places.length);
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((i) => (i - 1 + places.length) % places.length);
    } else if (event.key === "Enter") {
      const place = places[active];
      if (place) {
        event.preventDefault();
        select(place);
      }
    } else if (event.key === "Escape") {
      setOpen(false);
    }
  }

  return (
    <div className="relative" ref={wrapper}>
      <label htmlFor={id} className="text-sm font-medium leading-none">
        {label}
      </label>
      <Input
        id={id}
        className="mt-1.5"
        autoComplete="off"
        role="combobox"
        aria-expanded={open}
        aria-controls={listId}
        aria-autocomplete="list"
        placeholder={placeholder}
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          setActive(0);
          setOpen(true);
          if (allowEmpty && event.target.value.trim() === "") onChange("");
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
      />

      {open && enabled && (
        <div
          id={listId}
          role="listbox"
          className="absolute z-50 mt-1 max-h-72 w-full overflow-y-auto rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          {query.isFetching && places.length === 0 && (
            <p className="px-2 py-2 text-sm text-muted-foreground">Recherche…</p>
          )}
          {query.data?.error && (
            <p className="px-2 py-2 text-sm text-destructive">{query.data.error}</p>
          )}
          {!query.isFetching && !query.data?.error && places.length === 0 && (
            <p className="px-2 py-2 text-sm text-muted-foreground">
              Aucune ville ou aéroport trouvé. Vérifiez l'orthographe.
            </p>
          )}
          {places.map((place, index) => (
            <button
              key={place.code}
              type="button"
              role="option"
              aria-selected={index === active}
              onMouseEnter={() => setActive(index)}
              onClick={() => select(place)}
              className={`flex w-full items-center justify-between gap-3 rounded-md px-2 py-2 text-left text-sm ${
                index === active ? "bg-secondary" : ""
              }`}
            >
              <span>
                <span className="block font-medium">
                  {place.city || place.name}
                  {place.country ? (
                    <span className="text-muted-foreground"> · {place.country}</span>
                  ) : null}
                </span>
                {place.type === "airport" && (
                  <span className="block text-xs text-muted-foreground">
                    Aéroport {place.code} — {place.name}
                  </span>
                )}
                {place.type === "city" && (
                  <span className="block text-xs text-muted-foreground">
                    Tous les aéroports de la ville
                  </span>
                )}
              </span>
              <span className="shrink-0 rounded bg-secondary px-1.5 py-0.5 font-mono text-xs">
                {place.code}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
