import { createFileRoute } from "@tanstack/react-router";

import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Conditions générales d'utilisation | TrouveMonVol";
const DESCRIPTION =
  "Règles d'utilisation du comparateur de vols TrouveMonVol : rôle du site, responsabilités, alertes prix et données.";

export const Route = createFileRoute("/cgu")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/cgu` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cgu` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Conditions générales d'utilisation</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : [date à compléter]. Éditeur : [nom de l'éditeur — à compléter].
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">1. Objet</h2>
      <p className="mt-2 text-muted-foreground">
        Les présentes conditions encadrent l'utilisation du site TrouveMonVol, service gratuit de
        comparaison de prix de vols. En utilisant le site, vous acceptez ces conditions.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">2. Rôle du site</h2>
      <p className="mt-2 text-muted-foreground">
        TrouveMonVol agrège des prix communiqués par des partenaires de distribution et redirige
        l'utilisateur vers le vendeur du billet. Le site n'est ni transporteur, ni agence de
        voyages, et n'intervient pas dans le contrat conclu entre vous et le vendeur.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">3. Exactitude des prix</h2>
      <p className="mt-2 text-muted-foreground">
        Les prix sont donnés à titre indicatif, taxes incluses au moment de l'affichage. Les tarifs
        aériens varient en permanence : le prix définitif est celui affiché par le vendeur au moment
        du paiement. Nous ne garantissons ni la disponibilité, ni le maintien d'un tarif affiché.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">4. Alertes prix</h2>
      <p className="mt-2 text-muted-foreground">
        Les alertes par e-mail sont un service informatif, sans création de compte. Elles peuvent
        être interrompues à tout moment via le lien de désinscription présent dans chaque e-mail.
        Aucun engagement de fréquence ou de résultat n'est pris.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">5. Utilisation acceptable</h2>
      <p className="mt-2 text-muted-foreground">
        Il est interdit d'extraire massivement les données du site, de contourner ses protections
        techniques, ou d'en perturber le fonctionnement. Un usage automatisé abusif peut entraîner
        un blocage d'accès.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">6. Responsabilité</h2>
      <p className="mt-2 text-muted-foreground">
        Le site est fourni en l'état. Notre responsabilité ne peut être engagée pour les
        conséquences d'une réservation effectuée auprès d'un vendeur tiers, d'une indisponibilité
        temporaire du service, ou d'une erreur de données transmises par un partenaire.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">7. Modification et droit applicable</h2>
      <p className="mt-2 text-muted-foreground">
        Ces conditions peuvent être modifiées à tout moment ; la version en ligne est celle
        applicable. Le droit français s'applique, sous réserve des règles protectrices des
        consommateurs. Contact : [adresse e-mail à compléter].
      </p>
    </article>
  );
}
