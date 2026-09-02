/**
 * Le logo, dessiné en SVG inline plutôt que servi en `<img>`.
 *
 * Le repère est en `currentColor` : inline, il prend la couleur du texte
 * autour de lui, donc bleu foncé en thème clair et bleu clair en thème sombre
 * dès qu'on lui pose `text-primary`. Un `<img>` aurait figé une seule des deux
 * versions — c'est ce que compensait l'ancien halo bleu en thème sombre.
 * L'aile et le point gardent leur couleur de marque dans les deux thèmes.
 *
 * Décoratif par construction : partout où il apparaît, le nom « TrouveMonVol »
 * est écrit juste à côté, et le faire annoncer deux fois n'apporte rien.
 *
 * Le même dessin existe en fichier à part dans src/assets/logo.svg, pour les
 * usages hors React ; les deux doivent rester identiques.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      aria-hidden
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28 60 C16 44 8 36 8 26 A20 20 0 0 1 48 26 C48 30 47 33 45 37 L28 60 Z"
        fill="currentColor"
      />
      <path d="M34 26 L64 10 L52 34 L44 30 Z" fill="#92d8ff" />
      <circle cx="26" cy="26" r="7" fill="#ff8448" />
    </svg>
  );
}
