import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";

import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { DemoAlerte } from "@/components/site/DemoAlerte";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cityLabel } from "@/data/airports";
import { subscribeToAlert } from "@/lib/flights.functions";
import { useHabillage } from "@/lib/habillage-context";
import { utmOr } from "@/lib/search-params";

const TITLE = "Alerte prix vol gratuite — TrouveMonVol";
const DESCRIPTION =
  "Crée une alerte gratuite sur ton trajet : un email dès que le prix baisse, taxes incluses. Sans compte.";

/** Départ proposé par défaut, modifiable : l'audience visée part de Marseille. */
const DEPART_PAR_DEFAUT = "MRS";

/**
 * Canal enregistré quand l'URL n'en donne aucun.
 *
 * Cette page n'est liée nulle part sur le site et n'est pas indexable : qui
 * l'ouvre vient forcément du lien TikTok, avec ou sans paramètres. Le défaut
 * évite de perdre l'attribution des visites où la chaîne de requête a sauté
 * (lien recopié à la main, navigateur intégré qui nettoie l'URL).
 */
const CANAL_PAR_DEFAUT = "tiktok";

/**
 * Destinations en un geste. Taper dans une liste déroulante est l'étape où le
 * trafic social décroche : une puce remplace la saisie pour les trajets que
 * l'audience (départs de Marseille) demande le plus.
 */
const DESTINATIONS_RAPIDES = [
  { code: "ALG", nom: "Alger" },
  { code: "ORN", nom: "Oran" },
  { code: "TUN", nom: "Tunis" },
  { code: "RAK", nom: "Marrakech" },
  { code: "LIS", nom: "Lisbonne" },
  { code: "BCN", nom: "Barcelone" },
];

type SearchParams = { utm_source?: string; utm_content?: string };

export const Route = createFileRoute("/tiktok")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const source = utmOr(search["utm_source"], "");
    const content = utmOr(search["utm_content"], "");
    return {
      ...(source ? { utm_source: source } : {}),
      ...(content ? { utm_content: content } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // Page d'atterrissage de campagne : elle n'a rien à apporter en
      // recherche, et indexée elle ferait doublon avec /alertes, qui dit la
      // même chose en plus complet. Pas de canonical non plus : on ne demande
      // pas à Google de choisir entre deux pages, on lui en retire une.
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: TikTokPage,
});

/**
 * Ouvre le calendrier natif du champ.
 *
 * `input type="date"` a bien un calendrier, mais il ne s'ouvre qu'en visant la
 * petite icône : ailleurs dans le champ, on tombe sur la saisie « jj/mm/aaaa ».
 * Sur un téléphone, viser 20 px avec le pouce, c'est renoncer. On ouvre donc au
 * tap n'importe où dans le champ.
 */
function ouvrirCalendrier(champ: HTMLInputElement) {
  try {
    champ.showPicker();
  } catch {
    // Navigateur sans showPicker, ou appel hors geste utilisateur : le champ
    // reste saisissable au clavier et l'icône continue de fonctionner.
  }
}

/** Aujourd'hui en AAAA-MM-JJ, en heure locale — pas via toISOString, qui décale. */
function aujourdhui(): string {
  const d = new Date();
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
}

function TikTokPage() {
  const { utm_source, utm_content } = Route.useSearch();
  const creer = useServerFn(subscribeToAlert);

  const [origin, setOrigin] = useState(DEPART_PAR_DEFAUT);
  const [destination, setDestination] = useState("");
  /**
   * PlaceAutocomplete ne relit `value` qu'au montage : une puce doit donc le
   * remonter pour que le champ affiche la ville choisie. Ce compteur ne bouge
   * qu'au clic sur une puce, jamais sur une saisie, pour ne pas remonter le
   * champ sous le doigt.
   */
  const [cleDestination, setCleDestination] = useState(0);
  const [depart, setDepart] = useState("");
  const [retour, setRetour] = useState("");
  const [email, setEmail] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  /** Trajet confirmé : sa présence remplace le formulaire par la confirmation. */
  const [creee, setCreee] = useState<{ origin: string; destination: string } | null>(null);

  const manqueTrajet = !origin || !destination;

  /**
   * Tant que l'alerte n'existe pas, la page reste nue ; une fois créée, elle
   * rend l'habillage du site, parce qu'il n'y a plus d'action à protéger et
   * qu'il faut bien une porte pour continuer à visiter.
   *
   * Le nettoyage remet l'habillage à sa valeur par défaut en quittant la page :
   * l'état vit dans la racine, il ne doit pas survivre à la route qui l'a posé.
   */
  const { setRevele } = useHabillage();
  useEffect(() => {
    setRevele(creee !== null);
    return () => setRevele(false);
  }, [creee, setRevele]);

  function choisirDestination(code: string) {
    setDestination(code);
    setCleDestination((n) => n + 1);
  }

  function nouvelleAlerte() {
    setCreee(null);
    setDestination("");
    setCleDestination((n) => n + 1);
    setDepart("");
    setRetour("");
    setErreur(null);
  }

  async function soumettre(event: React.FormEvent) {
    event.preventDefault();
    if (manqueTrajet || !email) return;
    setEnvoiEnCours(true);
    setErreur(null);
    try {
      const resultat = await creer({
        data: {
          email,
          origin,
          destination,
          // Dates facultatives : sans date, l'alerte suit le meilleur prix du
          // trajet ; avec un aller seul, un aller simple ; avec les deux, un
          // aller-retour. Le client choisit, la page n'impose rien.
          departDate: depart || null,
          returnDate: retour || null,
          referencePrice: null,
          source: utm_source ?? CANAL_PAR_DEFAUT,
          ...(utm_content ? { sourceContent: utm_content } : {}),
        },
      });
      // Les échecs (doublon, aucun prix de référence disponible) sont repris
      // tels quels : mêmes phrases que sur /alertes, pour la même action.
      if (resultat.ok) setCreee({ origin, destination });
      else setErreur(resultat.message);
    } catch {
      setErreur("Impossible d'enregistrer l'alerte pour le moment.");
    } finally {
      setEnvoiEnCours(false);
    }
  }

  return (
    <div
      className={
        creee
          ? "flex flex-col px-4 py-6"
          : "flex min-h-svh flex-col px-4 pb-[env(safe-area-inset-bottom)]"
      }
    >
      {/*
        Logo et vignette n'appartiennent qu'à l'état nu. Une fois l'alerte
        créée, l'en-tête du site est là : garder ce logo en afficherait deux, et
        la vignette raconterait un prix d'exemple juste au-dessus d'une vraie
        alerte.
      */}
      {!creee && (
        <>
          {/* Le logo mène à l'accueil. Il est resté inerte un temps, pour ne
              pas offrir de sortie avant l'unique action de la page ; un logo
              qui ne réagit pas se lit surtout comme une page cassée. */}
          <header className="flex items-center py-2">
            <Link to="/" className="flex items-center gap-2">
              <Logo className="size-7 text-primary" />
              <span className="font-display text-base font-semibold tracking-tight">
                TrouveMonVol
              </span>
            </Link>
          </header>

          {/* La vignette montre le service avant que le titre ne l'explique :
              une notification de baisse de prix, comme sur l'écran verrouillé. */}
          <DemoAlerte />
        </>
      )}

      <main className="flex flex-1 flex-col pt-2 pb-4">
        {creee ? (
          <div role="status" aria-live="polite">
            <h1 className="font-display text-2xl font-semibold leading-tight tracking-tight">
              C&apos;est enregistré.
            </h1>
            <p className="mt-3 text-[15px] leading-snug text-muted-foreground">
              Un email part dès que le prix {cityLabel(creee.origin)} →{" "}
              {cityLabel(creee.destination)} baisse. Rien à faire d&apos;ici là, et un lien dans
              chaque email arrête l&apos;alerte.
            </p>
            {/*
              Le seul lien de la page, et seulement une fois l'alerte créée :
              avant, il n'aurait été qu'une porte de sortie de plus.
            */}
            <Link
              to="/mode-budget"
              search={{
                origin: creee.origin,
                budget: 100,
                month: "",
                adultes: 1,
                enfants: 0,
                bebes: 0,
              }}
              className="mt-6 inline-block text-sm font-medium text-primary underline underline-offset-4"
            >
              Voir où partir avec 100 €
            </Link>
            <Button
              type="button"
              variant="outline"
              onClick={nouvelleAlerte}
              className="mt-4 h-11 w-full"
            >
              Créer une autre alerte
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-[26px] font-semibold leading-tight tracking-tight">
              Sois prévenu quand ton vol baisse
            </h1>
            <p className="mt-2 text-[15px] leading-snug text-muted-foreground">
              Prix total, taxes incluses. Sans compte, sans spam.
            </p>

            <form
              onSubmit={(event) => void soumettre(event)}
              className="mt-5 space-y-3 [&_input]:h-11"
              aria-label="Création d'une alerte prix"
            >
              <PlaceAutocomplete
                id="tiktok-origin"
                label="Départ"
                value={origin}
                onChange={setOrigin}
                placeholder="Ex. Marseille, Paris…"
              />
              <div className="space-y-2">
                <PlaceAutocomplete
                  key={`destination-${cleDestination}`}
                  id="tiktok-destination"
                  label="Destination"
                  value={destination}
                  onChange={setDestination}
                  placeholder="Ex. Alger, Barcelone, Lisbonne…"
                />
                {/* Bande défilante sans barre : un pouce suffit, aucun retour à
                    la ligne qui pousserait le bouton hors de l'écran. */}
                <div
                  className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                  role="group"
                  aria-label="Destinations fréquentes"
                >
                  {DESTINATIONS_RAPIDES.map((d) => {
                    const active = destination === d.code;
                    return (
                      <button
                        key={d.code}
                        type="button"
                        aria-pressed={active}
                        onClick={() => choisirDestination(d.code)}
                        className={
                          active
                            ? "shrink-0 rounded-full border border-primary bg-primary px-3.5 py-1.5 text-sm font-medium text-primary-foreground"
                            : "shrink-0 rounded-full border border-border bg-card px-3.5 py-1.5 text-sm font-medium text-foreground active:bg-secondary"
                        }
                      >
                        {d.nom}
                      </button>
                    );
                  })}
                </div>
              </div>
              {/* Deux dates côte à côte, toutes deux facultatives : rien = meilleur
                  prix du trajet, aller seul = aller simple, les deux = aller-retour. */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tiktok-depart">Aller (facultatif)</Label>
                  <Input
                    id="tiktok-depart"
                    type="date"
                    min={aujourdhui()}
                    onClick={(e) => ouvrirCalendrier(e.currentTarget)}
                    onFocus={(e) => ouvrirCalendrier(e.currentTarget)}
                    value={depart}
                    onChange={(e) => {
                      setDepart(e.target.value);
                      if (retour && e.target.value && retour < e.target.value) setRetour("");
                    }}
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tiktok-retour">Retour (facultatif)</Label>
                  <Input
                    id="tiktok-retour"
                    type="date"
                    min={depart || aujourdhui()}
                    onClick={(e) => ouvrirCalendrier(e.currentTarget)}
                    onFocus={(e) => ouvrirCalendrier(e.currentTarget)}
                    value={retour}
                    onChange={(e) => setRetour(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="tiktok-email">Email</Label>
                <Input
                  id="tiktok-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  enterKeyHint="done"
                  placeholder="toi@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <Button
                type="submit"
                disabled={envoiEnCours || manqueTrajet}
                className="h-12 w-full text-base"
              >
                {envoiEnCours ? "Création…" : "Créer mon alerte gratuite"}
              </Button>

              <div className="text-center">
                <p className="text-xs leading-snug text-muted-foreground">
                  {manqueTrajet
                    ? "Gratuit. Un email quand le prix baisse, rien d'autre."
                    : `${cityLabel(origin)} → ${cityLabel(destination)}${
                        depart ? (retour ? " aller-retour" : " aller simple") : ", toutes dates"
                      } : vérifié chaque heure, un email dès que ça baisse.`}
                </p>
                {/*
                  Seul lien toléré avant validation, et il est obligatoire : on
                  collecte une adresse email, l'information doit être accessible
                  au moment de la collecte, pas après. Il s'ouvre dans un onglet
                  à part pour que le formulaire déjà rempli survive à la lecture.

                  La page vit à /confidentialite depuis toujours ; seul son
                  libellé dit « Politique de confidentialité ».
                */}
                <Link
                  to="/confidentialite"
                  target="_blank"
                  rel="noopener"
                  className="mt-1 inline-block text-[11px] text-muted-foreground/80 underline underline-offset-2"
                >
                  Politique de confidentialité
                </Link>
              </div>

              {erreur && (
                <p
                  role="status"
                  aria-live="polite"
                  className="rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground"
                >
                  {erreur}
                </p>
              )}
            </form>
          </>
        )}
      </main>
    </div>
  );
}
