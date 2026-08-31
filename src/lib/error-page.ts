function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * `details`, si fourni, s'affiche dans un bloc repliable "Détails techniques" —
 * utile pour qu'un visiteur (ou nous) puisse copier/photographier l'erreur
 * exacte sans avoir besoin d'un outil de débogage distant.
 */
export function renderErrorPage(details?: string): string {
  const detailsBlock = details
    ? `<details class="tech">
        <summary>Détails techniques</summary>
        <pre>${escapeHtml(details.slice(0, 1200))}</pre>
      </details>`
    : "";
  return `<!doctype html>
<html lang="fr">
  <head>
    <meta charset="utf-8" />
    <title>Cette page n'a pas pu se charger</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>
      body { font: 15px/1.5 system-ui, -apple-system, sans-serif; background: #fafafa; color: #111; display: grid; place-items: center; min-height: 100vh; margin: 0; padding: 1.5rem; }
      .card { max-width: 28rem; width: 100%; text-align: center; padding: 2rem; }
      h1 { font-size: 1.25rem; margin: 0 0 0.5rem; }
      p { color: #4b5563; margin: 0 0 1.5rem; }
      .actions { display: flex; gap: 0.5rem; justify-content: center; flex-wrap: wrap; }
      a, button { padding: 0.5rem 1rem; border-radius: 0.375rem; font: inherit; cursor: pointer; text-decoration: none; border: 1px solid transparent; }
      .primary { background: #111; color: #fff; }
      .secondary { background: #fff; color: #111; border-color: #d1d5db; }
      .tech { margin-top: 1.5rem; text-align: left; font-size: 0.75rem; color: #6b7280; }
      .tech summary { cursor: pointer; text-align: center; }
      .tech pre { white-space: pre-wrap; word-break: break-word; background: #f3f4f6; border-radius: 0.375rem; padding: 0.75rem; margin-top: 0.5rem; max-height: 40vh; overflow: auto; }
    </style>
  </head>
  <body>
    <div class="card">
      <h1>Cette page n'a pas pu se charger</h1>
      <p>Une erreur est survenue de notre côté. Essayez de recharger la page ou retournez à l'accueil.</p>
      <div class="actions">
        <button class="primary" onclick="location.reload()">Réessayer</button>
        <a class="secondary" href="/">Retour à l'accueil</a>
      </div>
      ${detailsBlock}
    </div>
  </body>
</html>`;
}
