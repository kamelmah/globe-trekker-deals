import { Link, createFileRoute } from "@tanstack/react-router";

import { FaqAccordion } from "@/components/site/FaqAccordion";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Questions fréquentes sur TrouveMonVol | comparateur de vols";
const DESCRIPTION =
  "Comment fonctionne TrouveMonVol, pourquoi un prix peut changer, qui vend réellement le billet et comment marchent les alertes prix par email.";

const FAQ = [
  {
    question: "Comment fonctionne TrouveMonVol ?",
    answer:
      "Nous interrogeons les bases tarifaires de nos partenaires de distribution pour la route et les dates que vous demandez. Important à savoir : cette source renvoie le meilleur prix trouvé par date de départ, et non la liste complète des vols d'une journée. Une recherche sur une date précise affiche donc souvent une seule offre — la moins chère observée — et une recherche en dates flexibles ± 3 jours en affiche une par date testée, ce qui vous permet de comparer les jours entre eux. Quand vous cliquez sur « Réserver », vous êtes envoyé directement chez le vendeur du billet, où vous payez. Nous ne vendons pas de billets nous-mêmes et nous n'ajoutons aucun frais de service.",
  },
  {
    question: "Pourquoi les prix peuvent-ils changer entre la recherche et la réservation ?",
    answer:
      "Les prix des billets d'avion évoluent en continu : chaque compagnie ouvre et ferme des classes tarifaires selon le remplissage du vol. Un tarif trouvé il y a dix minutes peut donc avoir disparu. Nous affichons le dernier prix connu et l'heure de la recherche ; si l'écart est important à l'arrivée chez le vendeur, revenez comparer, une autre offre est souvent plus intéressante.",
  },
  {
    question: "Est-ce que je paie plus cher en passant par vous ?",
    answer:
      "Non. Le prix que vous payez est celui du vendeur, exactement comme si vous étiez allé sur son site directement. Notre rémunération vient d'une commission d'affiliation versée par le vendeur, prélevée sur sa marge, pas ajoutée à votre facture.",
  },
  {
    question: "Qui vend réellement le billet ?",
    answer:
      "Chaque résultat affiche le nom du vendeur : soit la compagnie aérienne elle-même, soit une agence de voyage en ligne nommée. Nous n'affichons jamais un intermédiaire anonyme, et le bouton de réservation ouvre en un clic le lien de réservation de ce vendeur (le lien passe par la redirection technique Aviasales qui porte notre identifiant d'affiliation, invisible et instantanée pour vous), sans comparateur intermédiaire caché ni page de captation. C'est important : en cas de retard, d'annulation ou de remboursement, c'est ce vendeur qui est votre interlocuteur.",
  },
  {
    question: "Comment fonctionnent les alertes prix ?",
    answer:
      "Vous laissez votre email sur une page de résultats ou de destination, sans créer de compte. Nous enregistrons le trajet, les dates et le prix du moment. Une fois par jour, nous revérifions ce prix et nous vous écrivons uniquement s'il a baissé. Chaque email contient un lien de désinscription en un clic.",
  },
  {
    question: "Pourquoi n'affichez-vous pas de compte à rebours ni de « dernières places » ?",
    answer:
      "Parce que ces éléments sont conçus pour créer de l'urgence, pas pour vous informer. Nous préférons vous donner l'historique des prix sur douze mois et la vue calendrier du mois : avec ces deux repères, vous pouvez juger vous-même si le prix affiché est bon.",
  },
  {
    question: "Les prix incluent-ils les bagages ?",
    answer:
      "Le prix affiché est le prix total taxes et frais obligatoires inclus, hors bagages. Notre source de prix ne précise pas de façon fiable ce qui est inclus en cabine ou en soute pour chaque résultat : plutôt que d'afficher une estimation qui pourrait être fausse, nous vous renvoyons vers la page du vendeur pour vérifier les conditions exactes avant de réserver. Sur les compagnies à bas coût, une valise en soute peut ajouter plusieurs dizaines d'euros et changer le classement des offres.",
  },
  // Ces trois questions viennent de l'ancienne FAQ de la page d'accueil,
  // retirée lors de sa refonte : elles n'existaient nulle part ailleurs.
  {
    question: "Le prix affiché est-il vraiment le prix final ?",
    answer:
      "C'est le prix total : taxes et frais obligatoires sont déjà inclus, sans tarif d'appel qui gonfle au paiement. Deux réserves que nous préférons écrire plutôt que taire — certains revendeurs ajoutent des frais de service au moment de payer, et le bagage en soute n'est presque jamais compris dans les tarifs les plus bas.",
  },
  {
    question: "À quelle fréquence les prix sont-ils mis à jour ?",
    answer:
      "Environ une fois par heure en journée, avec des intervalles plus longs la nuit ; la cadence réellement mesurée est affichée en bas de la page de résultats. Mais la date qui compte est celle du vendeur : c'est lui qui a daté son tarif, et aucune actualisation de notre côté ne peut la rajeunir. C'est cette date-là que porte chaque prix.",
  },
  {
    question: "Pourquoi certains vols « Paris » partent-ils de Beauvais ?",
    answer:
      "Parce que les compagnies à bas coût vendent Beauvais sous le libellé Paris, alors que l'aéroport est à 85 km du centre et impose une navette, en temps comme en budget. Nous affichons l'aéroport réel sur chaque offre et signalons ces aéroports secondaires, à Paris comme à Milan, Bruxelles ou Barcelone. Un filtre permet de s'en tenir à Roissy et Orly.",
  },
  {
    question: "Comment est calculée l'estimation CO₂ ?",
    answer:
      "Nous estimons les émissions à partir de la distance réelle entre les aéroports, d'un facteur d'émission par passager qui varie selon la longueur du vol, et d'une majoration lorsque le trajet comporte des escales. C'est un ordre de grandeur destiné à comparer deux itinéraires, pas une mesure certifiée.",
  },
  {
    question: "Mon vol a été retardé ou annulé, ai-je droit à une indemnisation ?",
    answer:
      "Dans plusieurs cas (retard de 3 heures ou plus, annulation tardive, refus d'embarquement pour surbooking), la réglementation européenne prévoit une compensation financière, indépendamment du prix du billet. Consultez notre page dédiée « Indemnisation » (accessible depuis le pied de page) pour connaître les conditions exactes et faire votre demande.",
  },
];

export const Route = createFileRoute("/faq")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/faq` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/faq` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          name: TITLE,
          url: `${SITE_URL}/faq`,
          inLanguage: "fr-FR",
          mainEntity: FAQ.map((item) => ({
            "@type": "Question",
            name: item.question,
            acceptedAnswer: { "@type": "Answer", text: item.answer },
          })),
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "FAQ", item: `${SITE_URL}/faq` },
          ],
        }),
      },
    ],
  }),
  component: FaqPage,
});

function FaqPage() {
  return (
    <div className="container-page py-10">
      <h1 className="font-display text-3xl font-semibold">Questions fréquentes</h1>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Tout ce qu'il faut savoir sur le fonctionnement du site, la formation des prix et notre
        modèle économique. Pour les conseils de réservation, rendez-vous dans nos{" "}
        <Link
          to="/conseils"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          articles
        </Link>
        . Vol retardé ou annulé ?{" "}
        <Link
          to="/indemnisation"
          className="font-medium text-primary underline-offset-2 hover:underline"
        >
          Voir vos droits à indemnisation
        </Link>
        .
      </p>

      <div className="mt-8 max-w-3xl">
        <FaqAccordion items={FAQ} />
      </div>
    </div>
  );
}
