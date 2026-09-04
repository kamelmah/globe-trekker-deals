import { createFileRoute } from "@tanstack/react-router";

import { analyticsEnabled } from "@/lib/analytics";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Politique de confidentialité | TrouveMonVol";
const DESCRIPTION =
  "Quelles données TrouveMonVol collecte, pourquoi, combien de temps, et comment exercer vos droits.";

export const Route = createFileRoute("/confidentialite")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // Page de service, sans valeur pour la recherche : `noindex, follow`
      // pour ne pas la faire évaluer, sans couper la circulation du crawl.
      { name: "robots", content: "noindex, follow" },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/confidentialite` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/confidentialite` }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  // Branché sur la même constante que le script (src/lib/analytics.ts) : cette
  // page ne peut ni annoncer une mesure absente, ni taire une mesure active.
  const mesureActive = analyticsEnabled();
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Politique de confidentialité</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : [date à compléter]. Responsable du traitement : [nom de l'éditeur — à
        compléter], [adresse — à compléter], SIRET [à compléter].
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Données collectées</h2>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
        <li>
          <strong>Alertes prix :</strong> votre adresse e-mail, le trajet et les dates suivis, ainsi
          que les prix relevés. Base légale : votre consentement.
        </li>
        <li>
          <strong>Recherches :</strong> villes, dates et budget, utilisés pour interroger nos
          partenaires de prix et mémoriser un historique de tarifs par trajet (données non
          nominatives).
        </li>
        <li>
          <strong>Mesure d'audience et affiliation :</strong> données techniques limitées permettant
          d'attribuer une réservation à une visite.
        </li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-semibold">Durée de conservation</h2>
      <p className="mt-2 text-muted-foreground">
        Les alertes sont conservées tant que vous ne vous désinscrivez pas, puis supprimées dans un
        délai raisonnable. L'historique de prix par trajet est conservé de façon agrégée pour
        alimenter les graphiques d'évolution.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Destinataires</h2>
      <p className="mt-2 text-muted-foreground">
        Vos données ne sont ni vendues ni louées. Elles sont traitées par nos prestataires
        techniques : hébergement ([à compléter]), base de données et envoi d'e-mails ([à
        compléter]), et partenaires de distribution de prix aériens.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Cookies</h2>
      <p className="mt-2 text-muted-foreground">
        Le site utilise des cookies techniques strictement nécessaires (devise, thème, mémorisation
        de votre choix de consentement), et un cookie tiers optionnel de notre partenaire Stay22
        pour les cartes d'hébergement, chargé uniquement après votre accord.{" "}
        {mesureActive
          ? "La mesure d'audience du site (Plausible Analytics) ne dépose aucun cookie, ne conserve pas votre adresse IP et ne vous suit pas d'un site à l'autre : elle ne relève donc pas du consentement aux cookies."
          : "Aucun outil de mesure d'audience n'est actuellement intégré au site."}{" "}
        Le détail complet, catégorie par catégorie, est sur la page{" "}
        <a href="/cookies" className="underline underline-offset-2 hover:text-foreground">
          Gestion des cookies
        </a>
        , où vous pouvez aussi modifier votre choix à tout moment.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Vos droits</h2>
      <p className="mt-2 text-muted-foreground">
        Vous disposez d'un droit d'accès, de rectification, d'effacement, d'opposition et de
        portabilité. Pour l'exercer, écrivez à [adresse e-mail à compléter]. Vous pouvez également
        introduire une réclamation auprès de la CNIL.
      </p>
    </article>
  );
}
