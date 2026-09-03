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
 * le PLANCHER RELEVÉ SUR CE TRAJET.
 *
 * Les grilles tarifaires par compagnie — cabine, soute, en ligne, au comptoir —
 * ne sont plus recopiées ici. Elles l'étaient à l'identique partout où la même
 * compagnie vole : Transavia sur 18 routes, Volotea sur 15, Ryanair sur 34,
 * soit ~66 mots rigoureusement dupliqués sur la majorité des pages. Elles
 * vivent maintenant en un seul exemplaire sur /bagages, indexée une fois.
 *
 * Ce qui les remplace est CALCULÉ sur le trajet : ce que la soute coûte à
 * partir du plancher de cette route, ce qu'elle représente en pourcentage de ce
 * plancher, et quelle compagnie revient la moins chère une fois la soute
 * comptée. Le même supplément de 15 € pèse 38 % sur une route à 40 € et 7 % sur
 * une route à 200 € : c'est ce rapport qui est propre à la page, pas le tarif
 * publié de la compagnie.
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

/**
 * Supplément soute d'une compagnie sur CE trajet, en euros.
 *
 * `null` quand nous ne l'avons pas documenté (easyJet vend la soute par
 * tranches de 3 kg : aucun tarif unique pour 20 kg). Une compagnie non
 * documentée est nommée comme telle, jamais comptée comme gratuite.
 */
function checkedBagSupplement(policy: AirlineBaggagePolicy): number | null {
  if (policy.checkedBag.kind === "inclus") return 0;
  if (policy.checkedBag.kind === "payant") return policy.checkedBag.minEur;
  return null;
}

type SouteParCompagnie = {
  name: string;
  /** Supplément soute au tarif publié le moins cher. */
  supplementEur: number;
  /** Prix du billet soute comprise, à partir du plancher de ce trajet. */
  totalEur: number;
  /** Ce que la soute pèse sur le plancher de ce trajet, en pourcentage. */
  partPourcent: number;
};

export type AirlinesSection = {
  section: {
    heading: string;
    paragraphs: string[];
    moreLink:
      | { to: "/bagages"; label: string }
      | { to: "/bagages/$compagnie"; params: { compagnie: string }; label: string };
  };
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
  const policies = codes.map((code) => ({ code, policy: baggagePolicy(code) }));
  /**
   * Nom d'usage d'une compagnie. Le barème bagages prime sur le référentiel
   * tarifaire : celui-ci ne connaît ni « BJ » ni « TU », et la page annonçait
   * « BJ » dans la liste des compagnies puis « Nouvelair » deux lignes plus bas.
   */
  const nameOf = (code: string) => baggagePolicy(code)?.name ?? params.airlineName(code);
  const names = codes.map(nameOf);
  const documentees = policies.filter(
    (p): p is { code: string; policy: AirlineBaggagePolicy } => p.policy !== null,
  );
  const nonDocumentees = policies.filter((p) => p.policy === null).map((p) => nameOf(p.code));
  const dateValidation = formatDateMedium(params.validatedAt) || params.validatedAt;
  const offres = whitelisted?.validation.offers ?? 0;

  const paragraphs: string[] = [];

  // Quelles compagnies, et sur quelle preuve. Propre au trajet : la liste des
  // compagnies, la date de validation et le nombre d'offres analysées.
  paragraphs.push(
    codes.length === 1
      ? `Une seule compagnie a été relevée sur ${trajet} lors de notre dernière vérification de la liaison (${dateValidation}, ${offres} offres analysées) : ${names[0]}.`
      : `${codes.length} compagnies ont été relevées sur ${trajet} lors de notre dernière vérification de la liaison (${dateValidation}, ${offres} offres analysées) : ${enumerate(names)}.`,
  );

  // Le calcul propre à ce trajet. Le plancher relevé ici est le seul chiffre qui
  // change d'une page à l'autre : c'est lui qui transforme un tarif publié
  // identique partout en une part de billet qui, elle, ne l'est pas.
  const plancher = params.observedLowestEur;
  const soutes: SouteParCompagnie[] = plancher
    ? documentees
        .map(({ policy }) => {
          const supplementEur = checkedBagSupplement(policy);
          if (supplementEur === null) return null;
          return {
            name: policy.name,
            supplementEur,
            totalEur: Math.round(plancher + supplementEur),
            partPourcent: Math.round((supplementEur / plancher) * 100),
          };
        })
        .filter((s): s is SouteParCompagnie => s !== null)
        .sort((a, b) => a.totalEur - b.totalEur)
    : [];

  if (plancher && soutes.length > 0) {
    // « à 55 € chez Volotea (+38 %) », ou « à 40 € chez Air Algérie, qui la comprend ».
    const parCompagnie = soutes.map((s) =>
      s.supplementEur === 0
        ? `${euros(s.totalEur)} chez ${s.name} (soute comprise)`
        : `${euros(s.totalEur)} chez ${s.name} (+${s.partPourcent} %)`,
    );

    // La compagnie la moins chère soute comprise est dite DANS la même phrase,
    // pas dans une seconde : l'écart en euros entre deux compagnies ne dépend
    // pas du trajet (31 € contre 15 €, c'est 16 € partout), et une phrase bâtie
    // dessus se recopiait mot pour mot d'une page à l'autre. Adossée aux
    // montants calculés ci-dessus, la conclusion ne répète aucun chiffre
    // constant.
    const moinsChere = soutes[0]!;
    const conclusion =
      soutes.length > 1 && moinsChere.totalEur < soutes[soutes.length - 1]!.totalEur
        ? ` — à prix de billet égal, c'est donc ${moinsChere.name} qui revient le moins cher soute comprise`
        : "";

    paragraphs.push(
      `Avec une valise en soute, le plancher de ${euros(plancher)} relevé sur ce trajet devient ${enumerate(parCompagnie)}${conclusion}.`,
    );
  }

  if (nonDocumentees.length > 0) {
    paragraphs.push(
      `Pour ${enumerate(nonDocumentees)}, nous n'avons pas documenté les frais de bagages : vérifiez-les sur la page du vendeur avant de réserver.`,
    );
  }

  /**
   * Conséquence bagages de CE trajet, en une clause.
   *
   * Elle remplace trois phrases génériques qui se recopiaient d'une page à
   * l'autre — « Sur ces compagnies, la valise en soute se paie en supplément :
   * comparez les prix bagages compris », « ce qui compense souvent un prix
   * d'appel plus élevé », « les compagnies ouvrent et ferment des lignes chaque
   * saison ». Elles pesaient double : la réponse de FAQ est rendue à l'écran ET
   * dans les données structurées FAQPage de la page.
   *
   * Ce qui la remplace tient au trajet : la part que la soute représente sur le
   * plancher relevé ici. Vide quand nous n'avons ni plancher ni compagnie
   * documentée — mieux vaut une réponse courte qu'un remplissage.
   */
  const gratuites = soutes.filter((s) => s.supplementEur === 0);
  const facturees = soutes.filter((s) => s.supplementEur > 0);
  const moinsChereFacturee = facturees[0];
  // « Aucune » n'est dicible que si TOUTES les compagnies du trajet sont
  // documentées. Sur Marseille — Rome, seule Ryanair l'est : écrire « aucune ne
  // comprend la valise en soute » affirmerait quelque chose d'ITA Airways et de
  // MW que nous ne savons pas. Dans ce cas, les compagnies sont nommées.
  const toutesDocumentees = nonDocumentees.length === 0;
  const sujetFacturees =
    toutesDocumentees && gratuites.length === 0 && facturees.length > 1
      ? "Aucune ne comprend la valise en soute dans son tarif de base : elle"
      : `Chez ${enumerate(facturees.map((s) => s.name))}, la valise en soute`;
  const clauseBagage =
    soutes.length === 0 || !plancher
      ? ""
      : facturees.length === 0
        ? toutesDocumentees && gratuites.length > 1
          ? " Toutes comprennent la valise en soute dans leur tarif de base."
          : ` ${enumerate(gratuites.map((s) => s.name))} ${gratuites.length > 1 ? "comprennent" : "comprend"} la valise en soute dans ${gratuites.length > 1 ? "leur" : "son"} tarif de base.`
        : moinsChereFacturee
          ? `${
              gratuites.length > 0
                ? ` ${enumerate(gratuites.map((s) => s.name))} ${gratuites.length > 1 ? "comprennent" : "comprend"} la valise en soute dans ${gratuites.length > 1 ? "leur" : "son"} tarif de base.`
                : ""
            } ${sujetFacturees} ajoute au moins ${euros(moinsChereFacturee.supplementEur)}, soit ${moinsChereFacturee.partPourcent} % du plancher de ${euros(plancher)} relevé ici.`
          : "";

  /**
   * La compagnie de la liaison, quand il n'y en a qu'une ET qu'elle est
   * documentée. `codes.length === 1` et non `documentees.length === 1` : sur une
   * route à trois compagnies dont une seule documentée, envoyer le lecteur sur
   * la page de celle-là lui cacherait les deux autres.
   */
  const seuleDocumentee = codes.length === 1 ? (documentees[0]?.policy ?? null) : null;

  const faq: DestinationFaq = {
    question: `Quelles compagnies assurent ${trajet} ?`,
    answer:
      codes.length === 1
        ? `Lors de notre dernière vérification (${dateValidation}), seule ${names[0]} proposait des vols ${trajet}.${clauseBagage}`
        : `Lors de notre dernière vérification (${dateValidation}), ${enumerate(names)} proposaient des vols ${trajet}.${clauseBagage}`,
  };

  return {
    section: {
      heading: `Compagnies et bagages sur ${trajet}`,
      paragraphs,
      // Les tarifs publiés (cabine, soute, en ligne, au comptoir, source datée)
      // vivent sur /bagages. Une seule compagnie sur la liaison et documentée :
      // le lien mène droit à SA page, qui est celle que le lecteur cherche.
      // Sinon l'aiguillage, qui les compare toutes.
      moreLink: seuleDocumentee
        ? {
            to: "/bagages/$compagnie",
            params: { compagnie: seuleDocumentee.slug },
            label: `Bagages ${seuleDocumentee.name} : franchise et tarifs détaillés`,
          }
        : { to: "/bagages", label: "Tarifs bagages détaillés, compagnie par compagnie" },
    },
    faq,
    airlineNames: names,
  };
}
