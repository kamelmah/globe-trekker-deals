import { Logo } from "@/components/site/Logo";

/**
 * Démonstration animée d'une alerte, pensée pour un écran de téléphone.
 *
 * Une vignette de 120 px de haut, pas un fond : sur 390 px de large, un décor
 * derrière le texte le rend illisible, et le trafic TikTok ne lit pas — il
 * regarde. La vignette raconte le service en une boucle de 10 s : le prix se
 * trace, chute, et une notification arrive comme sur l'écran verrouillé.
 *
 * Mêmes règles que FondAnime : aucune image, formes CSS et un SVG en ligne,
 * animations en `transform` / `opacity` (plus `stroke-dashoffset` pour le
 * tracé), `aria-hidden`, positions déterministes. La chronologie vit dans
 * styles.css (bloc « Démo alerte »).
 */
/**
 * Les trajets montrés à tour de rôle, un par tour de 10 s.
 *
 * Un seul trajet répété dix fois de suite se lit comme une image figée, alors
 * que la page vend justement une veille sur n'importe quel trajet. Ce sont des
 * exemples, pas des relevés : ils illustrent la forme d'un email d'alerte, et
 * n'ont aucun rapport avec les prix réels du moment.
 */
const EXEMPLES = [
  { trajet: "Marseille → Alger", prix: "89 €", baisse: "−31 %" },
  { trajet: "Marseille → Tunis", prix: "76 €", baisse: "−24 %" },
  { trajet: "Marseille → Lisbonne", prix: "58 €", baisse: "−18 %" },
];

export function DemoAlerte() {
  return (
    <div className="demo-alerte" aria-hidden>
      <svg className="demo-courbe-svg" viewBox="0 0 360 64" focusable="false">
        <path
          className="demo-courbe"
          pathLength={1}
          d="M0 26 L48 29 L84 22 L124 27 L164 21 L204 25 L236 19 L252 22 L268 52 L304 49 L360 51"
        />
        <path className="demo-chute" pathLength={1} d="M252 22 L268 52" />
        <circle className="demo-onde" cx="268" cy="52" r="6" />
        <circle className="demo-point" cx="268" cy="52" r="4" />
      </svg>

      <div className="demo-notif">
        <span className="demo-notif-icone">
          <Logo className="size-5 text-primary" />
        </span>
        <span className="demo-notif-texte">
          <span className="demo-notif-entete">
            <span>TrouveMonVol</span>
            <span>à l&apos;instant</span>
          </span>
          <span className="demo-notif-corps">
            {EXEMPLES.map((exemple) => (
              <span className="demo-route" key={exemple.trajet}>
                {exemple.trajet} : <strong>{exemple.prix}</strong>
                <span className="demo-notif-baisse">{exemple.baisse}</span>
              </span>
            ))}
          </span>
        </span>
      </div>
    </div>
  );
}
