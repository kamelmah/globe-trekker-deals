/**
 * Section « Compagnies et bagages » des pages de liaison générées.
 *
 * Elle remplace deux sections qui étaient mot pour mot identiques sur les 89
 * pages de la liste blanche (« Quand réserver » et « Réserver en toute
 * transparence »), seul le nom des villes changeant. Ce gabarit répété était le
 * principal signal de contenu dupliqué du site. Le texte générique qu'il
 * portait vit désormais en un seul exemplaire sur /methodologie.
 *
 * Tout ce qui est écrit ici part de données propres au trajet : les compagnies
 * réellement renvoyées par l'API lors de la validation de la liste blanche, et
 * leur politique bagages publiée. Deux trajets n'ont donc la même section que
 * s'ils ont exactement les mêmes compagnies — et même alors, le calcul du prix
 * « valise comprise » est fait sur le plancher observé de CE trajet.
 */

import { type AirlineBaggagePolicy, baggagePolicy } from "@/data/baggage-fees";
import type { DestinationFaq } from "@/data/destinations";
import type { WhitelistedRoute } from "@/data/route-whitelist";
import { formatDateMedium } from "@/lib/dates";

/** Liste à la française : « Transavia et Volotea », « A, B et C ». */
function enumerate(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? "";
  return `${parts.slice(0, -1).join(", ")} et ${parts[parts.length - 1]}`;
}

const euros = (value: number) => `${Math.round(value)} €`;

/** Ce qu'une compagnie prévoit pour les bagages, en une phrase sourcée par ses tarifs publiés. */
function baggageSentence(policy: AirlineBaggagePolicy): string {
  const cabine =
    policy.cabinBag.kind === "inclus"
      ? `bagage cabine${policy.cabinBag.weightKg ? ` de ${policy.cabinBag.weightKg} kg` : ""} compris`
      : policy.cabinBag.kind === "payant"
        ? `bagage cabine payant (${euros(policy.cabinBag.minEur)} à ${euros(policy.cabinBag.maxEur)} en ligne)`
        : "bagage cabine non documenté chez nous";
  const soute =
    policy.checkedBag.kind === "inclus"
      ? `valise en soute${policy.checkedBag.weightKg ? ` de ${policy.checkedBag.weightKg} kg` : ""} comprise dans le tarif de base`
      : policy.checkedBag.kind === "payant"
        ? `valise en soute${policy.checkedBag.weightKg ? ` de ${policy.checkedBag.weightKg} kg` : ""} de ${euros(policy.checkedBag.minEur)} à ${euros(policy.checkedBag.maxEur)} achetée en ligne${policy.checkedBag.atAirportEur ? `, ${euros(policy.checkedBag.atAirportEur)} au comptoir` : ""}`
        : "valise en soute vendue à un tarif que nous n'avons pas pu documenter";
  return `Chez ${policy.name} : ${cabine}, ${soute}${policy.note ? `. ${policy.note}` : "."}`;
}

export type AirlinesSection = {
  section: { heading: string; paragraphs: string[] };
  faq: DestinationFaq;
  /** Noms des compagnies relevées, pour les données structurées. */
  airlineNames: string[];
};

/**
 * Construit la section et la question de FAQ « compagnies » d'un trajet, ou
 * null quand la liste blanche ne dit rien de ce trajet : on ne nomme jamais une
 * compagnie que l'API n'a pas réellement renvoyée.
 */
export function buildAirlinesSection(params: {
  originCity: string;
  destinationCity: string;
  whitelisted: WhitelistedRoute | null;
  validatedAt: string;
  airlineName: (code: string) => string;
  /** Prix plancher observé sur le trajet, s'il existe (pour le calcul « valise comprise »). */
  observedLowestEur: number | null;
}): AirlinesSection | null {
  const { originCity, destinationCity, whitelisted } = params;
  const codes = [...new Set((whitelisted?.validation.airlines ?? []).map((c) => c.toUpperCase()))];
  if (codes.length === 0) return null;

  const trajet = `${originCity} — ${destinationCity}`;
  const names = codes.map(params.airlineName);
  const policies = codes.map((code) => ({ code, policy: baggagePolicy(code) }));
  const documentees = policies.filter(
    (p): p is { code: string; policy: AirlineBaggagePolicy } => p.policy !== null,
  );
  const nonDocumentees = policies
    .filter((p) => p.policy === null)
    .map((p) => params.airlineName(p.code));
  const dateValidation = formatDateMedium(params.validatedAt) || params.validatedAt;
  const offres = whitelisted?.validation.offers ?? 0;

  const paragraphs: string[] = [];

  paragraphs.push(
    codes.length === 1
      ? `Une seule compagnie a été relevée sur ${trajet} lors de notre dernière vérification de la liaison (${dateValidation}, ${offres} offres analysées) : ${names[0]}. Sans concurrence directe, le prix dépend surtout de l'anticipation et du mois de départ.`
      : `${codes.length} compagnies ont été relevées sur ${trajet} lors de notre dernière vérification de la liaison (${dateValidation}, ${offres} offres analysées) : ${enumerate(names)}. Elles ne vendent pas la même chose au même prix : le billet le moins cher n'est pas toujours le moins cher une fois les bagages comptés.`,
  );

  for (const { policy } of documentees) {
    paragraphs.push(baggageSentence(policy));
  }
  if (nonDocumentees.length > 0) {
    paragraphs.push(
      `Pour ${enumerate(nonDocumentees)}, nous n'avons pas documenté les frais de bagages : vérifiez-les sur la page du vendeur avant de réserver.`,
    );
  }

  // Le calcul propre à ce trajet : ce que coûte une valise en soute par rapport
  // au plancher observé, quand une compagnie l'inclut et qu'une autre la vend.
  const incluses = documentees.filter((p) => p.policy.checkedBag.kind === "inclus");
  const payantes = documentees.filter((p) => p.policy.checkedBag.kind === "payant");
  if (params.observedLowestEur && incluses.length > 0 && payantes.length > 0) {
    const plancher = params.observedLowestEur;
    const supplements = payantes.map((p) => {
      const bag = p.policy.checkedBag;
      return bag.kind === "payant" ? bag.minEur : 0;
    });
    const minSupplement = Math.min(...supplements);
    paragraphs.push(
      `Concrètement, sur le plancher de ${euros(plancher)} relevé sur ${trajet}, ajouter une valise en soute chez ${enumerate(payantes.map((p) => p.policy.name))} porte le billet à au moins ${euros(plancher + minSupplement)}. C'est à ce montant qu'il faut comparer un billet ${enumerate(incluses.map((p) => p.policy.name))}, soute comprise, et non au prix d'appel.`,
    );
  } else if (params.observedLowestEur && payantes.length > 0 && incluses.length === 0) {
    const minSupplement = Math.min(
      ...payantes.map((p) =>
        p.policy.checkedBag.kind === "payant" ? p.policy.checkedBag.minEur : 0,
      ),
    );
    paragraphs.push(
      `Avec une valise en soute, comptez donc au minimum ${euros(params.observedLowestEur + minSupplement)} sur ${trajet} à partir du plancher relevé de ${euros(params.observedLowestEur)}, et davantage si le bagage est ajouté à l'aéroport.`,
    );
  }

  const faq: DestinationFaq = {
    question: `Quelles compagnies assurent ${trajet} ?`,
    answer:
      codes.length === 1
        ? `Lors de notre dernière vérification (${dateValidation}), seule ${names[0]} proposait des vols ${trajet}. Les compagnies ouvrent et ferment des lignes chaque saison : une recherche en direct affiche l'offre du moment.`
        : `Lors de notre dernière vérification (${dateValidation}), ${enumerate(names)} proposaient des vols ${trajet}. ${
            incluses.length > 0
              ? `${enumerate(incluses.map((p) => p.policy.name))} ${incluses.length > 1 ? "incluent" : "inclut"} la valise en soute dans le tarif de base, ce qui compense souvent un prix d'appel plus élevé.`
              : "Sur ces compagnies, la valise en soute se paie en supplément : comparez les prix bagages compris."
          }`,
  };

  return {
    section: { heading: `Compagnies et bagages sur ${trajet}`, paragraphs },
    faq,
    airlineNames: names,
  };
}
