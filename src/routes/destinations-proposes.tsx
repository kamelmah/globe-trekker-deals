import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AIRPORTS } from "@/data/airports";
import {
  addGuideRequest,
  deleteGuideRequest,
  generateGuideDraft,
  listGuideRequests,
  setGuidePublication,
  type GuideRequestRow,
} from "@/lib/guides-admin.functions";
import { formatParisDateTime } from "@/lib/price-refresh.shared";

export const Route = createFileRoute("/destinations-proposes")({
  head: () => ({
    meta: [
      { title: "Destinations proposées — TrouveMonVol" },
      {
        name: "description",
        content:
          "Page interne : liste des villes pour lesquelles un guide conseils doit être rédigé, avec génération et publication du brouillon.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Destinations proposées — TrouveMonVol" },
      {
        property: "og:description",
        content: "Pilotage interne des guides destinations à rédiger.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ProposedDestinations,
});

const STATUS_LABEL: Record<GuideRequestRow["status"], string> = {
  souhaite: "Souhaité",
  brouillon: "Brouillon à valider",
  publie: "Publié",
};

function ProposedDestinations() {
  const load = useServerFn(listGuideRequests);
  const add = useServerFn(addGuideRequest);
  const generate = useServerFn(generateGuideDraft);
  const publish = useServerFn(setGuidePublication);
  const remove = useServerFn(deleteGuideRequest);

  const [token, setToken] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [rows, setRows] = useState<GuideRequestRow[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [pending, setPending] = useState<string | null>(null);

  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [destination, setDestination] = useState("");

  function apply(
    result: { ok: true; rows: GuideRequestRow[] } | { ok: false; message: string },
    successMessage?: string,
  ) {
    if (result.ok) {
      setRows(result.rows);
      setUnlocked(true);
      setError(null);
      setNotice(successMessage ?? null);
    } else {
      setError(result.message);
      setNotice(null);
    }
  }

  async function run<T>(key: string, action: () => Promise<T>, onDone: (result: T) => void) {
    setPending(key);
    try {
      onDone(await action());
    } catch {
      setError("Action impossible pour le moment.");
    } finally {
      setPending(null);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold">Destinations proposées</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Listez ici les villes dont vous voulez un guide conseils. Le bouton « Générer le brouillon »
        rédige automatiquement la fiche ; elle reste invisible du public jusqu'à ce que vous la
        publiiez. Accès réservé : renseignez le jeton d'administration.
      </p>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          void run("load", () => load({ data: { token } }), (result) => apply(result));
        }}
        className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end"
      >
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="guides-token">Jeton d'administration</Label>
          <Input
            id="guides-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(event) => setToken(event.target.value)}
            required
          />
        </div>
        <Button type="submit" disabled={pending === "load"}>
          {pending === "load" ? "Chargement…" : "Afficher la liste"}
        </Button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}
      {notice && (
        <p role="status" className="mt-4 rounded-lg bg-secondary p-3 text-sm text-foreground">
          {notice}
        </p>
      )}

      {unlocked && (
        <>
          <section className="mt-8 rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-semibold">Ajouter une ville</h2>
            <form
              onSubmit={(event) => {
                event.preventDefault();
                void run(
                  "add",
                  () => add({ data: { token, city, country, destination } }),
                  (result) => {
                    apply(result, result.ok ? `${city} ajoutée à la liste.` : undefined);
                    if (result.ok) {
                      setCity("");
                      setCountry("");
                      setDestination("");
                    }
                  },
                );
              }}
              className="mt-4 grid gap-3 sm:grid-cols-[1fr_1fr_140px_auto] sm:items-end"
            >
              <div className="space-y-1.5">
                <Label htmlFor="guide-city">Ville</Label>
                <Input
                  id="guide-city"
                  value={city}
                  onChange={(event) => setCity(event.target.value)}
                  placeholder="Porto"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guide-country">Pays</Label>
                <Input
                  id="guide-country"
                  value={country}
                  onChange={(event) => setCountry(event.target.value)}
                  placeholder="Portugal"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="guide-iata">Code aéroport</Label>
                <Input
                  id="guide-iata"
                  list="guide-iata-list"
                  value={destination}
                  onChange={(event) => setDestination(event.target.value.toUpperCase())}
                  placeholder="OPO"
                  maxLength={3}
                  required
                />
                <datalist id="guide-iata-list">
                  {AIRPORTS.map((airport) => (
                    <option key={airport.code} value={airport.code}>
                      {airport.city} — {airport.country}
                    </option>
                  ))}
                </datalist>
              </div>
              <Button type="submit" disabled={pending === "add"}>
                {pending === "add" ? "Ajout…" : "Ajouter"}
              </Button>
            </form>
          </section>

          <section className="mt-8">
            <h2 className="font-display text-lg font-semibold">
              Villes en attente de guide ({rows.length})
            </h2>
            {rows.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">
                Aucune ville dans la liste pour le moment.
              </p>
            ) : (
              <ul className="mt-4 space-y-4">
                {rows.map((row) => (
                  <li key={row.id} className="rounded-xl border border-border bg-card p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-display text-base font-semibold">
                        {row.city} <span className="text-muted-foreground">· {row.country}</span>
                      </h3>
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs">
                        {STATUS_LABEL[row.status]}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted-foreground">
                      /conseils/destinations/{row.slug} · vols /vols/{row.routeSlug} · aéroport{" "}
                      {row.destination}
                    </p>
                    {row.generatedAt && (
                      <p className="mt-1 text-xs text-muted-foreground">
                        Brouillon généré le {formatParisDateTime(row.generatedAt)}
                        {row.publishedAt ? ` · publié le ${formatParisDateTime(row.publishedAt)}` : ""}
                      </p>
                    )}
                    {row.draftTitle && (
                      <p className="mt-3 text-sm font-medium">{row.draftTitle}</p>
                    )}
                    {row.draftIntro && (
                      <p className="mt-1 line-clamp-4 text-sm text-muted-foreground">
                        {row.draftIntro}
                      </p>
                    )}
                    {row.errorMessage && (
                      <p className="mt-2 text-xs text-destructive">{row.errorMessage}</p>
                    )}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        disabled={pending === `gen-${row.id}`}
                        onClick={() =>
                          void run(
                            `gen-${row.id}`,
                            () => generate({ data: { token, id: row.id } }),
                            (result) =>
                              apply(
                                result,
                                result.ok ? `Brouillon rédigé pour ${row.city}.` : undefined,
                              ),
                          )
                        }
                      >
                        {pending === `gen-${row.id}`
                          ? "Rédaction…"
                          : row.hasDraft
                            ? "Régénérer le brouillon"
                            : "Générer le brouillon"}
                      </Button>
                      {row.hasDraft && (
                        <Button
                          size="sm"
                          disabled={pending === `pub-${row.id}`}
                          onClick={() =>
                            void run(
                              `pub-${row.id}`,
                              () =>
                                publish({
                                  data: { token, id: row.id, publish: row.status !== "publie" },
                                }),
                              (result) =>
                                apply(
                                  result,
                                  result.ok
                                    ? row.status === "publie"
                                      ? `${row.city} dépubliée.`
                                      : `${row.city} publiée sur /conseils/destinations/${row.slug}.`
                                    : undefined,
                                ),
                            )
                          }
                        >
                          {row.status === "publie" ? "Dépublier" : "Publier la fiche"}
                        </Button>
                      )}
                      {row.status === "publie" && (
                        <Button size="sm" variant="outline" asChild>
                          <a
                            href={`/conseils/destinations/${row.slug}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            Voir la fiche
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        disabled={pending === `del-${row.id}`}
                        onClick={() =>
                          void run(
                            `del-${row.id}`,
                            () => remove({ data: { token, id: row.id } }),
                            (result) =>
                              apply(result, result.ok ? `${row.city} retirée.` : undefined),
                          )
                        }
                      >
                        Retirer
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </main>
  );
}
