import { createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/lib/cookie-consent-context";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Gestion des cookies | TrouveMonVol";
const DESCRIPTION =
  "Quels cookies TrouveMonVol utilise, à quoi ils servent et comment modifier votre choix à tout moment.";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      // Page de service, sans valeur pour la recherche : `noindex, follow`
      // pour ne pas la faire évaluer, sans couper la circulation du crawl.
      { name: "robots", content: "noindex, follow" },
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
  const { openManager } = useCookieConsent();
  return (
    <article className="container-page max-w-3xl py-12">
      <h1 className="font-display text-3xl font-semibold">Gestion des cookies</h1>
      <p className="mt-2 text-sm text-muted-foreground">Dernière mise à jour : 2026-08-31.</p>

      <p className="mt-4 text-muted-foreground">
        Cette page liste précisément les cookies et technologies similaires utilisés par
        TrouveMonVol au moment de la rédaction. Nous ne décrivons ici que ce qui est réellement en
        place : aucun outil de mesure d'audience (type Google Analytics) n'est actuellement intégré
        au site.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Cookies strictement nécessaires</h2>
      <p className="mt-2 text-muted-foreground">
        Stockés localement dans votre navigateur (localStorage), sans consentement requis :
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-muted-foreground">
        <li>Devise d'affichage choisie</li>
        <li>Thème clair ou sombre choisi</li>
        <li>
          Votre choix de consentement aux cookies lui-même (catégories ci-dessous), pendant 13 mois
          maximum
        </li>
        <li>
          Votre dernière recherche de vol — villes, dates et nombre de voyageurs, pendant 30 jours —
          pour vous la reproposer sur la page Hébergement plutôt que de vous la faire ressaisir.
          Elle ne quitte jamais votre navigateur et ne contient ni adresse e-mail ni identifiant
        </li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-semibold">
        Cartes d'hébergement Stay22 (nécessite votre accord)
      </h2>
      <p className="mt-2 text-muted-foreground">
        Les pages Hébergement et les guides destination intègrent une carte interactive fournie par
        notre partenaire Stay22, ainsi qu'un script d'affiliation associé. Ce sont des cookies tiers
        déposés par stay22.com, pas par TrouveMonVol : ils ne se chargent que si vous avez accepté
        cette catégorie. Refuser n'empêche pas d'utiliser le reste du site — vous pouvez toujours
        rechercher et comparer des vols normalement.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">
        Cookies déposés par nos partenaires de réservation
      </h2>
      <p className="mt-2 text-muted-foreground">
        Quand vous cliquez sur « Réserver » vers une compagnie ou une agence, vous quittez
        TrouveMonVol : c'est ce site partenaire qui dépose alors ses propres cookies (permettant
        notamment de rattacher une éventuelle réservation à votre visite). Nous n'avons pas la main
        sur ces cookies-là ; c'est ce mécanisme d'affiliation qui finance le site, sans surcoût pour
        vous ni influence sur l'ordre des résultats.
      </p>
      <p className="mt-2 text-muted-foreground">
        Il en va de même des liens « hôtels » vers Hotels.com : ils passent par la plateforme
        d'affiliation CJ, qui dépose ses propres cookies au moment du clic pour rattacher une
        éventuelle réservation à notre site. Rien n'est déposé tant que vous ne cliquez pas, et ces
        liens sont signalés comme partenaires là où ils apparaissent.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Modifier votre choix</h2>
      <p className="mt-2 text-muted-foreground">
        Vous pouvez revenir sur votre choix à tout moment, sans avoir à vider votre cache :
      </p>
      <Button onClick={openManager} variant="outline" className="mt-3">
        Gérer mes cookies
      </Button>
    </article>
  );
}
