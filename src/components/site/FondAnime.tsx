/**
 * Fonds animés thématiques des héros, sur le modèle de l'avion de l'accueil.
 *
 * Trois règles valent pour toutes les variantes :
 *
 * - Aucune image, aucune librairie : uniquement des formes CSS et deux petits
 *   SVG en ligne. Rien à télécharger, donc rien qui dispute le LCP au titre.
 * - Décoratif : `aria-hidden` et `pointer-events: none`. Un lecteur d'écran
 *   n'entend rien, un clic passe au travers.
 * - Déterministe : chaque position, durée et délai se calcule à partir d'un
 *   index. `Math.random` donnerait un rendu serveur différent du rendu client,
 *   et React s'en plaindrait à l'hydratation.
 *
 * Les couleurs vivent dans styles.css (bloc « Fonds animés ») : le thème clair
 * reprend les mêmes formes avec des accents plus foncés, sinon une skyline de
 * nuit rendrait le formulaire illisible en plein jour.
 */

/** Immeubles de la skyline : position en %, dimensions en px. */
const IMMEUBLES = [
  { x: 2, w: 90, h: 180 },
  { x: 11, w: 70, h: 250 },
  { x: 19, w: 120, h: 150 },
  { x: 29, w: 100, h: 300 },
  { x: 38, w: 80, h: 200 },
  { x: 46, w: 150, h: 260 },
  { x: 58, w: 90, h: 160 },
  { x: 66, w: 110, h: 320 },
  { x: 76, w: 75, h: 210 },
  { x: 83, w: 130, h: 240 },
  { x: 93, w: 85, h: 140 },
];

/**
 * Grille de fenêtres : pas de 14 × 16 px pour des fenêtres de 8 × 10 px, avec
 * une marge d'entrée identique à celle du fond peint en CSS. Les deux DOIVENT
 * s'accorder, sinon les fenêtres allumées flotteraient entre les éteintes.
 */
const PAS_X = 14;
const PAS_Y = 16;
const MARGE_X = 6;
const MARGE_Y = 12;

/**
 * Fenêtres qui s'allument dans un immeuble.
 *
 * La grille complète est peinte en fond de l'immeuble (voir `.fond-fenetres`
 * dans styles.css) : elle ne coûte aucun nœud. Seules les fenêtres qui
 * clignotent sont de vrais éléments, et une sur treize suffit à donner vie à la
 * façade. Un élément par fenêtre aurait ajouté plus de mille nœuds animés à la
 * page, pour un résultat identique à l'œil.
 */
function fenetresAllumees(immeuble: number, w: number, h: number) {
  const colonnes = Math.max(1, Math.floor((w - MARGE_X - 8 - 4) / PAS_X) + 1);
  const lignes = Math.max(1, Math.floor((h - MARGE_Y - 10 - 8) / PAS_Y) + 1);
  const fenetres: { left: number; top: number; duree: number; delai: number }[] = [];
  for (let c = 0; c < colonnes; c += 1) {
    for (let l = 0; l < lignes; l += 1) {
      if ((c * 7 + l * 13 + immeuble * 5) % 13 !== 0) continue;
      fenetres.push({
        left: MARGE_X + c * PAS_X,
        top: MARGE_Y + l * PAS_Y,
        duree: 6 + ((immeuble * 3 + c * 2 + l) % 5),
        delai: ((immeuble * 7 + c * 5 + l * 3) % 10) * 0.9,
      });
    }
  }
  return fenetres;
}

function Skyline() {
  return (
    <>
      <span className="fond-lune" />
      <div className="fond-skyline">
        {IMMEUBLES.map((immeuble, index) => (
          <div
            key={immeuble.x}
            className="fond-immeuble"
            // Un immeuble sur deux disparaît sous 640 px : cinq suffisent à
            // faire une ligne d'horizon sur un écran de téléphone, et un
            // `display: none` ne fait tourner aucune animation.
            data-mobile={index % 2 === 1 ? "oui" : "non"}
            style={{ left: `${immeuble.x}%`, width: immeuble.w, height: immeuble.h }}
          >
            <span className="fond-fenetres" />
            {fenetresAllumees(index, immeuble.w, immeuble.h).map((fenetre) => (
              <span
                key={`${fenetre.left}-${fenetre.top}`}
                className="fond-fenetre"
                style={{
                  left: fenetre.left,
                  top: fenetre.top,
                  animationDuration: `${fenetre.duree}s`,
                  animationDelay: `${fenetre.delai}s`,
                }}
              />
            ))}
          </div>
        ))}
      </div>
      <span className="fond-voile" />
    </>
  );
}

/**
 * Repères de la carte des guides.
 *
 * Tous sur les bords : le centre du héros porte le titre, et une épingle
 * derrière un mot le rend illisible.
 */
const REPERES = [
  { nom: "Porto", x: 3, y: 26, mobile: false },
  { nom: "Lisbonne", x: 9, y: 82, mobile: false },
  { nom: "Marrakech", x: 24, y: 84, mobile: true },
  { nom: "Marseille", x: 44, y: 80, mobile: true },
  { nom: "Alger", x: 60, y: 84, mobile: true },
  { nom: "Tunis", x: 72, y: 10, mobile: true },
  { nom: "Istanbul", x: 84, y: 72, mobile: false },
  { nom: "Le Caire", x: 90, y: 24, mobile: false },
];

/** 200 points de carte, aux positions déterministes demandées. */
const POINTS = Array.from({ length: 200 }, (_, i) => ({
  left: (i * 29) % 100,
  top: (i * 41) % 100,
}));

function CarteGuides() {
  return (
    <>
      <div className="fond-points">
        {POINTS.map((point, index) => (
          <span
            key={index}
            className="fond-point"
            style={{ left: `${point.left}%`, top: `${point.top}%` }}
          />
        ))}
      </div>

      {/*
        Trajectoires au départ de Marseille. `preserveAspectRatio="none"` étire
        le tracé sur toute la largeur du héros : les courbes rejoignent alors
        les épingles, qui sont positionnées en pourcentage.
      */}
      <svg
        className="fond-trajets"
        viewBox="0 0 1440 470"
        preserveAspectRatio="none"
        focusable="false"
      >
        {/* Marseille (634, 376) vers Tunis puis Istanbul : les coordonnées sont
            celles des repères ci-dessus, ramenées au viewBox (x % × 14,4 ;
            y % × 4,7). Les déplacer ici sans les déplacer là-haut ferait partir
            les courbes de nulle part. */}
        <path className="fond-trajet" d="M634 376 Q800 150 1037 47" />
        <path className="fond-trajet fond-trajet-2" d="M634 376 Q950 470 1267 338" />
      </svg>

      {REPERES.map((repere, index) => (
        <span
          key={repere.nom}
          className="fond-repere"
          data-mobile={repere.mobile ? "oui" : "non"}
          style={{
            left: `${repere.x}%`,
            top: `${repere.y}%`,
            // Délai NÉGATIF : l'animation démarre déjà engagée, chaque repère
            // à une phase différente. Avec des délais positifs, le premier
            // n'apparaissait qu'après 2,8 s — et sur mobile, où seuls quatre
            // repères restent, la carte était vide plusieurs secondes : on
            // croyait qu'il n'y avait pas d'animation du tout.
            animationDelay: `-${index * 1.2}s`,
          }}
        >
          <span className="fond-goutte" />
          <span className="fond-repere-nom">{repere.nom}</span>
        </span>
      ))}
    </>
  );
}

/** Enveloppe, bande et nacelle : la même silhouette pour les deux montgolfières. */
function Montgolfiere({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 100 150" focusable="false">
      <path
        className="fond-enveloppe"
        d="M50 4 C20 4 6 30 6 52 C6 78 30 92 44 110 L56 110 C70 92 94 78 94 52 C94 30 80 4 50 4 Z"
      />
      <path className="fond-bande" d="M40 4 C30 30 30 80 44 110 L56 110 C70 80 70 30 60 4 Z" />
      <path className="fond-meridien" d="M26 10 C16 40 20 82 36 106" />
      <path className="fond-meridien" d="M74 10 C84 40 80 82 64 106" />
      <path className="fond-suspentes" d="M44 110 L40 130 L60 130 L56 110 Z" />
      <rect className="fond-nacelle" x="38" y="130" width="24" height="14" rx="3" />
    </svg>
  );
}

function CielBudget() {
  return (
    <>
      <span className="fond-nuage fond-nuage-1" />
      <span className="fond-nuage fond-nuage-2" />
      <Montgolfiere className="fond-ballon fond-ballon-1" />
      <Montgolfiere className="fond-ballon fond-ballon-2" />
      <span className="fond-voile-mobile" />
    </>
  );
}

/**
 * Veille de prix des alertes : une courbe se trace, chute, un point s'allume,
 * la cloche sonne et un email part. Tout tient dans un seul SVG de 440 × 200 :
 * courbe, chute, cloche et enveloppe partagent le même repère, donc l'enveloppe
 * part bien de la cloche et le point tombe bien au bout de la chute.
 *
 * La chronologie (cycle de 12 s) vit dans styles.css, avec les points de
 * repère calculés depuis la longueur du tracé : la chute commence à 62 % de la
 * courbe et finit à 78 %, d'où les 26 % et 32,5 % du cycle quand le tracé
 * prend 5 s. Déplacer un point ici sans reprendre ces pourcentages désynchrone
 * la cloche de la chute.
 */
function VeillePrix() {
  return (
    <>
      <span className="fond-grille" />
      <svg className="fond-veille" viewBox="0 0 440 200" focusable="false">
        {/* Courbe complète, en bleu ; la chute est repeinte par-dessus en orange. */}
        <path
          className="fond-courbe"
          pathLength={1}
          d="M0 60 L60 64 L100 52 L150 58 L200 50 L250 56 L290 48 L310 52 L330 130 L370 126 L440 128"
        />
        <path className="fond-chute" pathLength={1} d="M310 52 L330 130" />

        {/* Point de la baisse, deux ondes qui s'en échappent, et le pourcentage. */}
        <circle className="fond-onde fond-onde-1" cx="330" cy="130" r="8" />
        <circle className="fond-onde fond-onde-2" cx="330" cy="130" r="8" />
        <circle className="fond-point-chute" cx="330" cy="130" r="5" />
        <text className="fond-baisse" x="342" y="160">
          −31 %
        </text>

        {/* Cloche : corps, battant, anneau, et deux arcs de sonnerie. */}
        <g className="fond-cloche" transform="translate(392 70)">
          <path className="fond-sonnerie" d="M-19 -8 Q-25 0 -19 8" />
          <path className="fond-sonnerie fond-sonnerie-2" d="M19 -8 Q25 0 19 8" />
          <g className="fond-cloche-corps">
            <circle cx="0" cy="-16" r="2.5" />
            <path d="M0 -14 C-8 -14 -11 -7 -11 1 L-13 8 L13 8 L11 1 C11 -7 8 -14 0 -14 Z" />
            <circle cx="0" cy="11" r="3" />
          </g>
        </g>

        {/* Enveloppe : naît sur la cloche, part vers le haut à droite. */}
        {/* Le groupe extérieur porte la position, le groupe intérieur le vol :
            un `transform` CSS remplacerait l'attribut au lieu de s'y ajouter. */}
        <g transform="translate(380 62)">
          <g className="fond-enveloppe">
            <rect x="0" y="0" width="24" height="16" rx="2" />
            <path d="M0 0 L12 9 L24 0" />
          </g>
        </g>
      </svg>
      <span className="fond-voile-mobile" />
    </>
  );
}

export function FondAnime({ variante }: { variante: "hotels" | "guides" | "budget" | "alertes" }) {
  return (
    <div className={`fond-anime fond-anime-${variante}`} aria-hidden>
      {variante === "hotels" && <Skyline />}
      {variante === "guides" && <CarteGuides />}
      {variante === "budget" && <CielBudget />}
      {variante === "alertes" && <VeillePrix />}
    </div>
  );
}
