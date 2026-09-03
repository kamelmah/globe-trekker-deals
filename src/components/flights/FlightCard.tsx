import { useEffect, useState } from "react";
import { formatDateTimeCompact, formatDateTimeShort, formatDateMedium } from "@/lib/dates";
import { sellerNature } from "@/data/sellers";
import { airportLabel, secondaryAirport } from "@/data/airports";
import {
  BAGGAGE_LEVELS,
  baggagePolicy,
  baggageSupplement,
  formatBaggageFee,
  priceWithBaggage,
  type BaggageLevel,
  type BaggageSupplement,
} from "@/data/baggage-fees";
import {
  AlertTriangle,
  BadgeCheck,
  TriangleAlert,
  Building2,
  Luggage,
  Leaf,
  Plane,
  Store,
  Clock,
} from "lucide-react";

import { trackEvent } from "@/lib/analytics";
import { co2Label } from "@/lib/co2";
import { computeFreshness, type Freshness, type FreshnessTone } from "@/lib/freshness";
import { useCurrency } from "@/lib/currency-context";
import type { FlightOffer } from "@/lib/flights.types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

function formatDuration(minutes: number): string {
  if (!minutes) return "Durée non communiquée";
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} h ${String(m).padStart(2, "0")}` : `${h} h`;
}

const formatTime = formatDateTimeCompact;

/**
 * `--warning` seul ne passe en texte dans aucun des deux thèmes : trop clair sur
 * fond clair, et `--warning-foreground` est une couleur prévue POUR un fond
 * warning. Au-delà de 24 h on utilise donc la paire telle qu'elle a été conçue,
 * en pastille — ce qui appuie au passage l'avertissement.
 */
const TONE_CLASS: Record<FreshnessTone, string> = {
  frais: "text-success",
  neutre: "text-muted-foreground",
  ancien: "rounded-md bg-warning px-2 py-0.5 text-warning-foreground",
};

function useFreshness(iso: string | null): Freshness | null {
  // null tant que non monté côté client : évite un écart de rendu SSR, la
  // fraîcheur dépend de l'instant présent (Date.now()) donc jamais fiable côté serveur.
  const [freshness, setFreshness] = useState<Freshness | null>(null);
  useEffect(() => {
    setFreshness(computeFreshness(iso));
    const timer = setInterval(() => setFreshness(computeFreshness(iso)), 60000);
    return () => clearInterval(timer);
  }, [iso]);
  return freshness;
}

function stopsLabel(stops: number): string {
  if (stops === 0) return "Vol direct";
  return stops === 1 ? "1 escale" : `${stops} escales`;
}

/** Libellé d'un supplément bagage, tel qu'il apparaît dans la carte. */
function allowanceLabel(supplement: BaggageSupplement): string {
  if (supplement.kind === "inconnu") return "non documenté";
  if (supplement.kind === "inclus") {
    return supplement.weightKg ? `compris (${supplement.weightKg} kg)` : "compris";
  }
  const poids = supplement.weightKg ? ` (${supplement.weightKg} kg)` : "";
  // Sans plafond publié, « à partir de » — jamais un maximum reconstitué.
  // Le montant passe par `formatBaggageFee` : écrit brut, le 29,99 € de
  // Transavia s'affichait « 29.99 € », avec le point décimal anglais.
  const fourchette =
    supplement.maxEur === undefined || supplement.maxEur === supplement.minEur
      ? formatBaggageFee(supplement.minEur)
      : `${formatBaggageFee(supplement.minEur)} à ${formatBaggageFee(supplement.maxEur)}`;
  return `+${fourchette}${poids}`;
}

function allowanceClass(supplement: BaggageSupplement): string {
  if (supplement.kind === "inclus") return "font-medium text-success";
  if (supplement.kind === "inconnu") return "italic";
  return "font-medium text-foreground";
}

export function FlightCard({
  offer,
  greenest = false,
  baggageLevel = "personnel",
}: {
  offer: FlightOffer;
  greenest?: boolean;
  /** Niveau de bagage choisi par le voyageur : il pilote le prix mis en avant. */
  baggageLevel?: BaggageLevel;
}) {
  const { formatApi: format } = useCurrency();
  // Ici, la date de relevé vient du VENDEUR (`found_at` / `search_date` renvoyés
  // par l'API), pas de notre propre rafraîchissement : nous constatons l'âge du
  // prix, nous ne le maîtrisons pas. Les pages de liaison, elles, datent leurs
  // propres relevés.
  const freshness = useFreshness(offer.observedAt);
  const policy = baggagePolicy(offer.airlineCode);
  const vendeur = sellerNature(offer.seller, offer.airline);
  const departSecondaire = secondaryAirport(offer.originAirport);
  const arriveeSecondaire = secondaryAirport(offer.destinationAirport);

  // Le prix mis en avant est celui du niveau demandé ; à défaut de barème, on
  // ne majore rien plutôt que d'inventer un supplément.
  const prixAffiche =
    priceWithBaggage(offer.priceEur, offer.airlineCode, baggageLevel) ?? offer.priceEur;
  const prixSoute = priceWithBaggage(offer.priceEur, offer.airlineCode, "soute");
  const soute = baggageSupplement(offer.airlineCode, "soute");

  // Par défaut on montre « sans bagage » puis « avec soute » ; dès qu'un niveau
  // payant est demandé, le repère utile devient le prix nu.
  const secondPrix =
    baggageLevel === "personnel"
      ? prixSoute !== null && prixSoute !== offer.priceEur
        ? {
            prefixe: "· ",
            montant: prixSoute,
            suffixe: `avec ${soute.kind === "payant" && soute.weightKg ? `${soute.weightKg} kg en soute` : "bagage en soute"}`,
          }
        : null
      : prixAffiche !== offer.priceEur
        ? { prefixe: "· ", montant: offer.priceEur, suffixe: "sans bagage" }
        : null;

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold">
              <Plane className="size-4 text-primary" aria-hidden />
              {offer.airline}
            </span>
            <Badge variant="secondary">{stopsLabel(offer.stops)}</Badge>
            <Badge variant="outline">{formatDuration(offer.durationMinutes)}</Badge>
            {greenest && (
              <Badge className="bg-success text-success-foreground">
                <Leaf className="mr-1 size-3" aria-hidden />
                Vol plus écologique
              </Badge>
            )}
          </div>

          <p className="mt-2 text-sm text-muted-foreground">
            Départ {formatTime(offer.departureAt)}
            {offer.returnAt ? ` · retour ${formatTime(offer.returnAt)}` : " · aller simple"} · vol{" "}
            {offer.flightNumber}
          </p>

          {/*
            L'aéroport réel, pas le code ville : la moitié des offres « Paris »
            partent de Beauvais. Le trajet vers le centre est un coût que le
            voyageur doit voir avant de cliquer, pas découvrir en arrivant.
          */}
          <p className="mt-1 text-sm">
            {airportLabel(offer.originAirport, offer.origin)} →{" "}
            {airportLabel(offer.destinationAirport, offer.destination)}
          </p>
          {(departSecondaire || arriveeSecondaire) && (
            <ul className="mt-1 space-y-0.5">
              {[departSecondaire, arriveeSecondaire].filter(Boolean).map((a) => (
                <li
                  key={a!.code}
                  className="inline-flex items-start gap-1 text-xs text-warning-foreground"
                >
                  <TriangleAlert className="mt-0.5 size-3 shrink-0" aria-hidden />
                  <span className="rounded bg-warning px-1.5 py-0.5">
                    {a!.code} est à {a!.distanceKm} km de {a!.city} — {a!.access} à prévoir
                  </span>
                </li>
              ))}
            </ul>
          )}

          {/*
            Nommer le vendeur ne suffit pas : « Kiwi.com » ou « Clickavia » ne
            disent rien à qui ne les connaît pas, alors que ce sont des
            intermédiaires susceptibles d'ajouter des frais au paiement. La
            nature du vendeur est donc annoncée avec son nom, pas séparément.
          */}
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <p className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2 py-1 text-sm font-medium">
              <Store className="size-4 text-primary" aria-hidden />
              {/* Le groupe propriétaire fait partie du nom : quatre marques
                  d'Etraveli ne sont pas quatre options concurrentes. */}
              Vendu par {vendeur.label}
            </p>
            {vendeur.kind === "compagnie" ? (
              <Badge className="bg-success text-success-foreground">
                <BadgeCheck className="mr-1 size-3" aria-hidden />
                Vente directe compagnie
              </Badge>
            ) : (
              <Badge variant="secondary">
                <Building2 className="mr-1 size-3" aria-hidden />
                Agence en ligne
              </Badge>
            )}
          </div>
          {vendeur.kind === "agence" && (
            <p className="mt-1 text-xs text-muted-foreground">
              Frais de service possibles à l'étape paiement, chez ce vendeur.
              {vendeur.reviewsUrl && (
                <>
                  {" "}
                  {/* Lien sortant vers les avis publics. Aucune note n'est
                      récupérée : le moissonnage est contraire aux CGU de
                      Trustpilot, et le lecteur juge mieux sur pièces. */}
                  <a
                    href={vendeur.reviewsUrl}
                    target="_blank"
                    rel="noopener nofollow"
                    className="underline underline-offset-2 hover:text-foreground"
                  >
                    Voir les avis sur ce vendeur
                  </a>
                </>
              )}
            </p>
          )}

          {/*
            Le bagage est le premier coût caché d'un billet low-cost : un Ryanair
            à 20 € en vaut 65 avec une valise. Il a donc sa place dans le corps
            de la carte, pas dans une note de bas de page.
          */}
          <div className="mt-3 rounded-md border border-border/70 bg-secondary/40 p-2.5">
            {policy ? (
              <>
                <p className="inline-flex items-center gap-1.5 text-xs font-medium">
                  <Luggage className="size-3.5 shrink-0 text-primary" aria-hidden />
                  Bagages chez {policy.name}
                </p>
                <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                  {BAGGAGE_LEVELS.map((niveau) => (
                    <li key={niveau.value} className="flex flex-wrap gap-x-1.5">
                      <span>{niveau.short} :</span>
                      <span
                        className={allowanceClass(
                          baggageSupplement(offer.airlineCode, niveau.value),
                        )}
                      >
                        {allowanceLabel(baggageSupplement(offer.airlineCode, niveau.value))}
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="mt-1.5 text-[11px] text-muted-foreground/80">
                  Tarifs publiés par la compagnie, relevés le {formatDateMedium(policy.verifiedAt)}.
                  Ils varient selon la ligne, la saison et le moment de l'achat.
                </p>
              </>
            ) : (
              <p className="inline-flex items-start gap-1.5 text-xs text-muted-foreground">
                <Luggage className="mt-0.5 size-3.5 shrink-0" aria-hidden />
                Information bagage non fournie par ce vendeur — à vérifier chez lui avant de
                réserver.
              </p>
            )}
          </div>

          <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <li>Empreinte estimée : {co2Label(offer.co2Kg)}</li>
          </ul>
        </div>

        <div className="flex shrink-0 flex-col items-start gap-1.5 sm:items-end">
          {/*
            Au-delà de 24 h le montant cesse d'être présenté comme un prix : le
            tilde, la mention « estimation » et la typo atténuée disent la même
            chose que le libellé de fraîcheur juste en dessous.
          */}
          {freshness?.estimate ? (
            <p className="font-display text-2xl font-medium text-muted-foreground">
              ~{format(prixAffiche)} <span className="text-sm font-normal">(estimation)</span>
            </p>
          ) : (
            <p className="font-display text-2xl font-semibold">{format(prixAffiche)}</p>
          )}

          {/*
            Le second prix : c'est là que se joue le différenciateur. Un billet à
            45 € qui en coûte 79 avec une valise, la comparaison n'a plus rien à
            voir — autant que ce soit lisible avant le clic, pas après.
          */}
          {secondPrix && (
            <p className="text-sm text-muted-foreground">
              {secondPrix.prefixe}
              <span className="font-medium text-foreground">{format(secondPrix.montant)}</span>{" "}
              {secondPrix.suffixe}
            </p>
          )}

          {/* La fraîcheur est portée par le prix lui-même, pas reléguée à côté. */}
          {freshness && (
            <p
              className={`inline-flex items-center gap-1 text-xs font-medium ${TONE_CLASS[freshness.tone]}`}
            >
              {freshness.tone === "ancien" ? (
                <AlertTriangle className="size-3 shrink-0" aria-hidden />
              ) : (
                <Clock className="size-3 shrink-0" aria-hidden />
              )}
              {freshness.label}
            </p>
          )}

          <p className="text-xs text-muted-foreground">
            {freshness?.estimate
              ? "Estimation d'après un relevé ancien — prix à confirmer chez le vendeur"
              : "Prix total, taxes incluses"}
          </p>

          <Button asChild variant={freshness?.estimate ? "outline" : "default"} className="mt-1">
            <a
              href={offer.bookingUrl}
              target="_blank"
              rel="noopener noreferrer nofollow sponsored"
              /*
               * Le seul point du site où l'on quitte TrouveMonVol pour un vol.
               * On mesure quel VENDEUR est choisi et sur quel trajet : c'est ce
               * qui dit si l'ordre des résultats correspond à ce que les gens
               * retiennent. Aucun prix n'est envoyé — il change d'une minute à
               * l'autre et rendrait la donnée illisible plutôt qu'utile.
               */
              onClick={() =>
                trackEvent("clic_vol_sortant", {
                  vendeur: offer.seller,
                  trajet: `${offer.originAirport}-${offer.destinationAirport}`,
                })
              }
            >
              {freshness?.estimate ? "Vérifier chez" : "Réserver chez"} {offer.seller}
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
