import { createFileRoute } from "@tanstack/react-router";

import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Gestion des cookies | TrouveMonVol";
const DESCRIPTION =
  "Quels cookies TrouveMonVol utilise, à quoi ils servent et comment modifier votre choix à tout moment.";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/cookies` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/cookies` }],
  }),
  component: CookiesPage,
});

function CookiesPage() {
  return (
    <article className="container-page prose-page py-12">
      <h1 className="font-display text-3xl font-semibold">Gestion des cookies</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        Dernière mise à jour : [date à compléter]. Éditeur : [nom de l'éditeur — à compléter].
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Cookies strictement nécessaires</h2>
      <p className="mt-2 text-muted-foreground">
        Ils assurent le fonctionnement du site : mémorisation de la devise choisie, sécurité et
        préférences d'affichage. Ils ne nécessitent pas de consentement.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Mesure d'audience</h2>
      <p className="mt-2 text-muted-foreground">
        Ces cookies nous indiquent quelles pages sont consultées, de façon agrégée, pour améliorer le
        site. Ils sont déposés uniquement après votre accord.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Cookies d'affiliation</h2>
      <p className="mt-2 text-muted-foreground">
        Quand vous cliquez sur un résultat, un cookie du partenaire permet de rattacher une
        éventuelle réservation à votre visite. C'est ce mécanisme qui finance le site, sans surcoût
        pour vous : nous n'ajoutons aucun frais au prix du vendeur.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Modifier votre choix</h2>
      <p className="mt-2 text-muted-foreground">
        Vous pouvez rouvrir le gestionnaire de consentement affiché sur le site pour changer d'avis à
        tout moment, ou supprimer les cookies déjà enregistrés depuis les réglages de votre
        navigateur (section « Confidentialité et sécurité »). Refuser les cookies non nécessaires
        n'empêche pas d'utiliser le comparateur.
      </p>
    </article>
  );
}
