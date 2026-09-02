import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Clock, Mail, MousePointerClick } from "lucide-react";
import { useState } from "react";

import { PlaceAutocomplete } from "@/components/search/PlaceAutocomplete";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cityLabel } from "@/data/airports";
import { sendAlertsSummary, subscribeToAlert } from "@/lib/flights.functions";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Alertes prix vols — TrouveMonVol";
const DESCRIPTION =
  "Créez une alerte gratuite sur un trajet : nous vérifions le prix chaque heure et vous envoyons un email dès qu'il passe sous le dernier tarif relevé. Sans compte, désinscription en un clic.";
const PAGE_URL = `${SITE_URL}/alertes`;

/**
 * Les deux paramètres sont facultatifs, et le restent dans le type.
 *
 * Déclarés obligatoires, ils forceraient chaque lien vers /alertes — barre du
 * haut, barre du bas, pied de page — à passer un préremplissage qu'il n'a pas,
 * et l'URL nue porterait un « ?origin=PAR&destination= » sans intérêt.
 */
type SearchParams = { origin?: string; destination?: string };

/** Code IATA valide, ou rien : la page ne doit pas planter sur une URL bricolée. */
function iataOuRien(value: unknown): string | undefined {
  if (typeof value !== "string") return undefined;
  const brut = value.trim();
  return /^[A-Za-z]{3}$/.test(brut) ? brut.toUpperCase() : undefined;
}

export const Route = createFileRoute("/alertes/")({
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    const origin = iataOuRien(search["origin"]);
    const destination = iataOuRien(search["destination"]);
    return {
      ...(origin ? { origin } : {}),
      ...(destination ? { destination } : {}),
    };
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
  }),
  component: AlertesPage,
});

/** Aujourd'hui en AAAA-MM-JJ, en heure locale — pas via toISOString, qui décale. */
function aujourdhui(): string {
  const d = new Date();
  const mois = String(d.getMonth() + 1).padStart(2, "0");
  const jour = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${mois}-${jour}`;
}

function AlertesPage() {
  const search = Route.useSearch();
  const creer = useServerFn(subscribeToAlert);
  const envoyerResume = useServerFn(sendAlertsSummary);

  const [origin, setOrigin] = useState(search.origin ?? "PAR");
  const [destination, setDestination] = useState(search.destination ?? "");
  const [depart, setDepart] = useState("");
  const [retour, setRetour] = useState("");
  const [email, setEmail] = useState("");
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [retourCreation, setRetourCreation] = useState<{ ok: boolean; message: string } | null>(
    null,
  );

  const [emailResume, setEmailResume] = useState("");
  const [resumeEnCours, setResumeEnCours] = useState(false);
  const [messageResume, setMessageResume] = useState<string | null>(null);

  const manqueTrajet = !origin || !destination;

  async function soumettreCreation(event: React.FormEvent) {
    event.preventDefault();
    if (manqueTrajet || !email) return;
    setEnvoiEnCours(true);
    setRetourCreation(null);
    try {
      const resultat = await creer({
        data: {
          email,
          origin,
          destination,
          departDate: depart || null,
          returnDate: retour || null,
          // Le prix de référence est résolu côté serveur par createAlert : la
          // page n'affiche aucun tarif, elle n'a donc rien à proposer ici.
          referencePrice: null,
        },
      });
      setRetourCreation({
        ok: resultat.ok,
        // Message de succès nommant le trajet ; les messages d'échec du serveur
        // (doublon, prix de référence introuvable) sont repris tels quels.
        message: resultat.ok
          ? `Alerte créée. Vous recevrez un email dès que le prix de ${cityLabel(origin)} → ${cityLabel(destination)} baisse.`
          : resultat.message,
      });
      if (resultat.ok) setEmail("");
    } catch {
      setRetourCreation({
        ok: false,
        message: "Impossible d'enregistrer l'alerte pour le moment.",
      });
    } finally {
      setEnvoiEnCours(false);
    }
  }

  async function soumettreResume(event: React.FormEvent) {
    event.preventDefault();
    if (!emailResume) return;
    setResumeEnCours(true);
    setMessageResume(null);
    try {
      const resultat = await envoyerResume({ data: { email: emailResume } });
      setMessageResume(resultat.message);
    } catch {
      // Même phrase qu'en cas de succès : une erreur distincte révélerait que
      // l'adresse existe.
      setMessageResume("Si des alertes existent pour cette adresse, un email vient de partir.");
    } finally {
      setResumeEnCours(false);
    }
  }

  return (
    <div className="container-page py-10">
      <h1 className="font-display">Alertes prix</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Choisissez un trajet, nous vérifions le prix chaque heure et vous écrivons dès qu'il baisse.
        Aucun compte, aucun spam, désinscription en un clic.
      </p>

      <form
        onSubmit={(event) => void soumettreCreation(event)}
        className="mt-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 [&_input]:h-11"
        aria-label="Création d'une alerte prix"
      >
        <div className="grid gap-4 md:grid-cols-2">
          <PlaceAutocomplete
            id="alerte-origin"
            label="Ville ou aéroport de départ"
            value={origin}
            onChange={setOrigin}
            placeholder="Ex. Paris, CDG, Marseille…"
          />
          <PlaceAutocomplete
            id="alerte-destination"
            label="Destination"
            value={destination}
            onChange={setDestination}
            placeholder="Ex. Alger, Barcelone, Lisbonne…"
          />

          <div className="space-y-1.5">
            <Label htmlFor="alerte-depart">Date de départ (facultative)</Label>
            <Input
              id="alerte-depart"
              type="date"
              min={aujourdhui()}
              value={depart}
              onChange={(e) => setDepart(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="alerte-retour">Date de retour (facultative)</Label>
            <Input
              id="alerte-retour"
              type="date"
              min={depart || aujourdhui()}
              value={retour}
              onChange={(e) => setRetour(e.target.value)}
            />
          </div>

          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="alerte-email">Votre email</Label>
            <Input
              id="alerte-email"
              type="email"
              required
              autoComplete="email"
              placeholder="vous@exemple.fr"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <Button
          type="submit"
          disabled={envoiEnCours || manqueTrajet}
          className="mt-4 h-11 w-full sm:w-auto"
        >
          {envoiEnCours ? "Création…" : "Créer mon alerte"}
        </Button>
        {manqueTrajet && (
          <p className="mt-2 text-xs text-muted-foreground">
            Renseignez un départ et une destination pour créer l'alerte.
          </p>
        )}

        {retourCreation && (
          <p
            role="status"
            aria-live="polite"
            className={
              retourCreation.ok
                ? "mt-4 rounded-md border border-primary/40 bg-primary/10 p-3 text-sm text-foreground"
                : "mt-4 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-sm text-foreground"
            }
          >
            {retourCreation.message}
          </p>
        )}
      </form>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Comment ça marche</h2>
        <ul className="mt-4 grid gap-4 md:grid-cols-3">
          {[
            {
              Icone: Clock,
              titre: "Vérification chaque heure",
              texte:
                "Nous interrogeons les offres réelles du trajet une fois par heure, taxes incluses.",
            },
            {
              Icone: Mail,
              titre: "Email dès que le prix baisse",
              texte:
                "Vous recevez un message quand le tarif passe sous le dernier prix connu, avec le vendeur et le lien direct.",
            },
            {
              Icone: MousePointerClick,
              titre: "Désinscription en un clic",
              texte: "Chaque email porte un lien qui arrête l'alerte, sans formulaire ni compte.",
            },
          ].map(({ Icone, titre, texte }) => (
            <li key={titre} className="rounded-xl border border-border bg-card p-5">
              <Icone className="size-5 text-primary" aria-hidden />
              <h3 className="mt-3 font-display text-base font-semibold">{titre}</h3>
              <p className="mt-1.5 text-sm text-muted-foreground">{texte}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-12">
        <h2 className="font-display text-xl font-semibold">Gérer mes alertes</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
          Sans compte, votre boîte mail fait foi : nous vous envoyons la liste de vos alertes
          actives, chacune avec son lien de suppression.
        </p>
        <form
          onSubmit={(event) => void soumettreResume(event)}
          className="mt-4 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5 [&_input]:h-11"
          aria-label="Recevoir la liste de mes alertes"
        >
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="resume-email">Votre email</Label>
              <Input
                id="resume-email"
                type="email"
                required
                autoComplete="email"
                placeholder="vous@exemple.fr"
                value={emailResume}
                onChange={(e) => setEmailResume(e.target.value)}
              />
            </div>
            <Button type="submit" disabled={resumeEnCours} className="h-11">
              {resumeEnCours ? "Envoi…" : "Recevoir mes alertes par email"}
            </Button>
          </div>
          {messageResume && (
            <p
              role="status"
              aria-live="polite"
              className="mt-4 rounded-md border border-border bg-secondary p-3 text-sm text-foreground"
            >
              {messageResume}
            </p>
          )}
        </form>
      </section>
    </div>
  );
}
