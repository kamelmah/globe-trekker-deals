import { Link, createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";

import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { Logo } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cityLabel } from "@/data/airports";
import { subscribeToAlert } from "@/lib/flights.functions";
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

function TikTokPage() {
  const { utm_source, utm_content } = Route.useSearch();
  const creer = useServerFn(subscribeToAlert);

  const [origin, setOrigin] = useState(DEPART_PAR_DEFAUT);
  const [destination, setDestination] = useState("");
  const [email, setEmail] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [erreur, setErreur] = useState<string | null>(null);
  /** Trajet confirmé : sa présence remplace le formulaire par la confirmation. */
  const [creee, setCreee] = useState<{ origin: string; destination: string } | null>(null);

  const manqueTrajet = !origin || !destination;

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
          departDate: null,
          returnDate: null,
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
    <div className="flex min-h-svh flex-col px-4 pb-[env(safe-area-inset-bottom)]">
      {/*
        Le logo n'est pas un lien vers l'accueil, et c'est délibéré : la page
        n'a qu'une action, et un logo cliquable est précisément la sortie que
        prend le trafic social avant d'avoir rien fait. Il est là pour dire chez
        qui on est, pas pour emmener ailleurs.
      */}
      <header className="flex items-center gap-2 py-3">
        <Logo className="size-7 text-primary" />
        <span className="font-display text-base font-semibold tracking-tight">TrouveMonVol</span>
      </header>

      <main className="flex flex-1 flex-col justify-center pb-4">
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
              <PlaceAutocomplete
                id="tiktok-destination"
                label="Destination"
                value={destination}
                onChange={setDestination}
                placeholder="Ex. Alger, Barcelone, Lisbonne…"
              />
              <div className="space-y-1.5">
                <Label htmlFor="tiktok-email">Email</Label>
                <Input
                  id="tiktok-email"
                  type="email"
                  required
                  autoComplete="email"
                  inputMode="email"
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
                  Gratuit. Un email quand le prix baisse, rien d&apos;autre.
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
