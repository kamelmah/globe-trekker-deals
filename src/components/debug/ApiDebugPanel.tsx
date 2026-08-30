import { useState } from "react";

import type { ApiDebugInfo } from "@/lib/flights.types";

/**
 * Panneau de debug temporaire : affiche la réponse brute de l'API Travelpayouts.
 * Rendu uniquement en développement (import.meta.env.DEV), jamais en production.
 */
export function ApiDebugPanel({
  debug,
  label = "Réponse brute de l'API Travelpayouts",
}: {
  debug: ApiDebugInfo | null | undefined;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  if (!import.meta.env.DEV || !debug) return null;

  return (
    <div className="mt-4 rounded-lg border border-dashed border-border bg-secondary/40 p-3 text-xs">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="font-mono font-semibold text-foreground"
      >
        {open ? "▾" : "▸"} debug · {label} · HTTP {debug.status}
      </button>
      {open && (
        <div className="mt-2 space-y-2">
          <p className="font-mono text-muted-foreground">
            {debug.endpoint}?{new URLSearchParams(debug.params).toString()}
          </p>
          <pre className="max-h-80 overflow-auto rounded bg-background p-3 font-mono text-[11px] leading-relaxed">
            {debug.body}
          </pre>
        </div>
      )}
    </div>
  );
}
