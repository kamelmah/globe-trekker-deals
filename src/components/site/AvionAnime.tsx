/**
 * Silhouette d'avion qui traverse le héros, vue de dessus.
 *
 * Purement décorative : `aria-hidden` et `pointer-events-none`, elle n'ajoute
 * rien à la page pour un lecteur d'écran et n'intercepte aucun clic. Tout est
 * en CSS (voir `.avion-anime` dans styles.css) — aucune image n'est chargée,
 * pour que le LCP reste le titre ou le formulaire de recherche.
 *
 * Les couleurs passent par des variables : le corps blanc convient au thème
 * sombre, il devient bleu ardoise en thème clair.
 */
export function AvionAnime() {
  return (
    <div className="avion-anime pointer-events-none -z-10" aria-hidden>
      <span className="avion-trainee avion-trainee-haute" />
      <span className="avion-trainee avion-trainee-basse" />
      <svg viewBox="0 0 200 200" width="72" height="72" focusable="false">
        <g fill="var(--avion-corps)">
          <path d="M126 94 L78 18 Q74 10 66 12 L56 17 L84 94 Z" />
          <path d="M126 106 L78 182 Q74 190 66 188 L56 183 L84 106 Z" />
          <path d="M48 94 L30 64 Q28 58 22 60 L15 63 L32 94 Z" />
          <path d="M48 106 L30 136 Q28 142 22 140 L15 137 L32 106 Z" />
          <path d="M192 100 C188 90 176 92 160 93 L38 93 C26 93 14 96 8 100 C14 104 26 107 38 107 L160 107 C176 108 188 110 192 100 Z" />
        </g>
        <g fill="var(--avion-hublots)">
          <rect x="80" y="44" width="30" height="11" rx="5" />
          <rect x="80" y="145" width="30" height="11" rx="5" />
        </g>
      </svg>
    </div>
  );
}
