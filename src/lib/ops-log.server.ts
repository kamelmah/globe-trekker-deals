/**
 * Journalisation technique côté serveur (table `ops_logs`).
 * Objectif : diagnostiquer rapidement les cas « aucune offre / aucun prix »
 * et les échecs de création d'alerte. Aucune donnée n'est exposée au navigateur
 * sans le jeton d'administration.
 */

export type OpsLogKind = "travelpayouts" | "alerte" | "contact" | "newsletter" | "redaction";

export type OpsLogEntry = {
  kind: OpsLogKind;
  /** Libellé court : endpoint appelé ou action effectuée. */
  label: string;
  ok?: boolean;
  status?: number | null;
  resultCount?: number | null;
  durationMs?: number | null;
  message?: string | null;
  context?: Record<string, unknown>;
};

export type OpsLogRow = {
  id: string;
  created_at: string;
  kind: string;
  label: string;
  ok: boolean;
  status: number | null;
  result_count: number | null;
  duration_ms: number | null;
  message: string | null;
  /** Contexte sérialisé en JSON pour rester transportable côté client. */
  context: string | null;
};

async function admin() {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  return supabaseAdmin;
}

/**
 * Écritures de journal en vol.
 *
 * `logOps` reste volontairement « pose et oublie » : ses vingt-quatre appelants
 * ne doivent ni attendre le journal ni échouer à cause de lui. Mais une fonction
 * planifiée s'arrête dès la réponse rendue, et l'écriture partait alors dans le
 * vide — « fetch failed » après la fin de la fonction, et aucune trace dans
 * /admin/journal, précisément pour les échecs qu'on voulait y voir.
 *
 * D'où ce registre, que `flushOpsLogs` permet d'attendre en fin de passage, sans
 * changer la signature de `logOps` ni toucher à ses appelants.
 */
const ecrituresEnVol = new Set<Promise<void>>();

/** Attend les écritures de journal en cours. À appeler avant de rendre la main. */
export async function flushOpsLogs(): Promise<void> {
  await Promise.allSettled([...ecrituresEnVol]);
}

/** Écrit une ligne de journal sans jamais bloquer ni faire échouer l'appel métier. */
export function logOps(entry: OpsLogEntry): void {
  const row = {
    kind: entry.kind,
    label: entry.label.slice(0, 200),
    ok: entry.ok ?? true,
    status: entry.status ?? null,
    result_count: entry.resultCount ?? null,
    duration_ms: entry.durationMs ?? null,
    message: entry.message ? entry.message.slice(0, 500) : null,
    context: entry.context ?? {},
  };

  // Trace console immédiate (visible dans les logs serveur) …
  const prefix = row.ok ? "[ops]" : "[ops:échec]";
  console.log(
    `${prefix} ${row.kind} · ${row.label} · status=${row.status ?? "-"} · résultats=${
      row.result_count ?? "-"
    } · ${row.duration_ms ?? "-"}ms${row.message ? ` · ${row.message}` : ""}`,
  );

  // … puis persistance best-effort pour la page d'administration.
  const ecriture = (async () => {
    try {
      const db = await admin();
      const { error } = await db.from("ops_logs").insert(row as never);
      if (error) console.error("Journalisation impossible", error.message);
    } catch (error) {
      console.error("Journalisation impossible", error);
    }
  })();
  ecrituresEnVol.add(ecriture);
  void ecriture.finally(() => ecrituresEnVol.delete(ecriture));
}

export type OpsLogStats = {
  kind: string;
  total: number;
  failures: number;
  emptyResults: number;
};

export async function readOpsLogs(params: {
  kind?: OpsLogKind | "tous";
  onlyProblems?: boolean;
  limit?: number;
}): Promise<{ rows: OpsLogRow[]; stats: OpsLogStats[] }> {
  const db = await admin();
  let query = db
    .from("ops_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(Math.min(params.limit ?? 100, 300));

  if (params.kind && params.kind !== "tous") query = query.eq("kind", params.kind);

  const { data, error } = await query;
  if (error) throw new Error(error.message);

  const raw = (data ?? []) as unknown as (Omit<OpsLogRow, "context"> & { context: unknown })[];
  let rows: OpsLogRow[] = raw.map((row) => ({
    ...row,
    context: row.context ? JSON.stringify(row.context) : null,
  }));
  if (params.onlyProblems) {
    rows = rows.filter((row) => !row.ok || row.result_count === 0);
  }

  const byKind = new Map<string, OpsLogStats>();
  for (const row of raw) {
    const stat = byKind.get(row.kind) ?? { kind: row.kind, total: 0, failures: 0, emptyResults: 0 };
    stat.total += 1;
    if (!row.ok) stat.failures += 1;
    if (row.result_count === 0) stat.emptyResults += 1;
    byKind.set(row.kind, stat);
  }

  return { rows, stats: [...byKind.values()] };
}
