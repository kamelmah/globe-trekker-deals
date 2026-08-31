import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { fetchOpsLogs } from "@/lib/ops-log.functions";
import { formatParisDateTime } from "@/lib/price-refresh.shared";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type LogsResult = Awaited<ReturnType<typeof fetchOpsLogs>>;
type Row = Extract<LogsResult, { ok: true }>["rows"][number];
type Stat = Extract<LogsResult, { ok: true }>["stats"][number];
type Refresh = Extract<LogsResult, { ok: true }>["refresh"];

export const Route = createFileRoute("/admin/journal")({
  head: () => ({
    meta: [
      { title: "Journal technique — TrouveMonVol" },
      {
        name: "description",
        content:
          "Page interne de diagnostic : appels à l'API de prix et créations d'alertes email sur TrouveMonVol.",
      },
      { name: "robots", content: "noindex, nofollow" },
      { property: "og:title", content: "Journal technique — TrouveMonVol" },
      {
        property: "og:description",
        content: "Diagnostic interne des appels de prix et des alertes email.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AdminJournal,
});

function AdminJournal() {
  const load = useServerFn(fetchOpsLogs);
  const [token, setToken] = useState("");
  const [kind, setKind] = useState<"tous" | "travelpayouts" | "alerte">("tous");
  const [onlyProblems, setOnlyProblems] = useState(false);
  const [rows, setRows] = useState<Row[] | null>(null);
  const [stats, setStats] = useState<Stat[]>([]);
  const [refresh, setRefresh] = useState<Refresh | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError(null);
    try {
      const result = await load({ data: { token, kind, onlyProblems } });
      if (result.ok) {
        setRows(result.rows);
        setStats(result.stats);
        setRefresh(result.refresh);
      } else {
        setRows(null);
        setStats([]);
        setRefresh(null);
        setError(result.message);
      }
    } catch {
      setError("Lecture du journal impossible pour le moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl px-4 py-10">
      <h1 className="font-display text-2xl font-semibold">Journal technique</h1>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Suivi des appels à l'API de prix et des créations d'alertes email, pour diagnostiquer les
        recherches sans offre disponible. Accès réservé : renseignez le jeton d'administration.
      </p>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="flex-1 space-y-1.5">
          <Label htmlFor="admin-token">Jeton d'administration</Label>
          <Input
            id="admin-token"
            type="password"
            autoComplete="off"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="admin-kind">Type</Label>
          <select
            id="admin-kind"
            value={kind}
            onChange={(e) => setKind(e.target.value as typeof kind)}
            className="h-10 rounded-md border border-input bg-background px-3 text-sm"
          >
            <option value="tous">Tous</option>
            <option value="travelpayouts">Appels de prix</option>
            <option value="alerte">Alertes email</option>
          </select>
        </div>
        <label className="flex items-center gap-2 pb-2 text-sm">
          <input
            type="checkbox"
            checked={onlyProblems}
            onChange={(e) => setOnlyProblems(e.target.checked)}
          />
          Uniquement les échecs et zéros résultats
        </label>
        <Button type="submit" disabled={pending}>
          {pending ? "Chargement…" : "Afficher"}
        </Button>
      </form>

      {error && (
        <p role="alert" className="mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      {refresh && (
        <div className="mt-6 rounded-lg border border-border bg-card p-4 text-sm">
          <p className="font-semibold">Mise à jour automatique des prix Travelpayouts</p>
          <p className="mt-1 text-muted-foreground">
            Dernière mise à jour : {formatParisDateTime(refresh.lastAt)} (heure de Paris)
            {refresh.trigger ? ` · déclenchement ${refresh.trigger}` : ""} ·{" "}
            {refresh.priceCount} tarifs relevés
          </p>
          <p className="mt-1 text-muted-foreground">
            Prochaine mise à jour prévue : {formatParisDateTime(refresh.nextAt)} (cadence horaire)
          </p>
          {refresh.message && (
            <p className="mt-1 text-destructive">Dernier incident : {refresh.message}</p>
          )}
        </div>
      )}

      {stats.length > 0 && (
        <ul className="mt-6 grid gap-3 sm:grid-cols-2">
          {stats.map((stat) => (
            <li key={stat.kind} className="rounded-lg border border-border bg-card p-4 text-sm">
              <p className="font-semibold">{stat.kind}</p>
              <p className="text-muted-foreground">
                {stat.total} évènements · {stat.failures} échecs · {stat.emptyResults} sans résultat
              </p>
            </li>
          ))}
        </ul>
      )}

      {rows && (
        <div className="mt-6 overflow-x-auto rounded-lg border border-border">
          <table className="w-full text-left text-xs">
            <thead className="bg-secondary/50">
              <tr>
                <th className="p-2">Date</th>
                <th className="p-2">Type</th>
                <th className="p-2">Libellé</th>
                <th className="p-2">Statut</th>
                <th className="p-2">Résultats</th>
                <th className="p-2">Durée</th>
                <th className="p-2">Message / contexte</th>
              </tr>
            </thead>
            <tbody>
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-4 text-center text-muted-foreground">
                    Aucun évènement pour ces filtres.
                  </td>
                </tr>
              )}
              {rows.map((row) => (
                <tr key={row.id} className="border-t border-border align-top">
                  <td className="p-2 whitespace-nowrap">
                    {new Date(row.created_at).toLocaleString("fr-FR")}
                  </td>
                  <td className="p-2">{row.kind}</td>
                  <td className="p-2 font-mono">{row.label}</td>
                  <td className="p-2">{row.ok ? (row.status ?? "ok") : `échec ${row.status ?? ""}`}</td>
                  <td className="p-2">{row.result_count ?? "—"}</td>
                  <td className="p-2">{row.duration_ms ? `${row.duration_ms} ms` : "—"}</td>
                  <td className="max-w-[420px] p-2 font-mono break-words text-muted-foreground">
                    {row.message ? `${row.message} · ` : ""}
                    {row.context ?? ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
