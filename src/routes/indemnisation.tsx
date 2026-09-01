import { Link, createFileRoute } from "@tanstack/react-router";

import { Button } from "@/components/ui/button";
import { AIRHELP_URL } from "@/lib/affiliate-partners";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Vol retardé ou annulé : vos droits à indemnisation | TrouveMonVol";
const DESCRIPTION =
  "Retard, annulation, refus d'embarquement : dans quels cas un vol au départ ou à destination de l'UE ouvre droit à une indemnisation, et comment faire la demande.";

export const Route = createFileRoute("/indemnisation")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/indemnisation` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/indemnisation` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
            {
              "@type": "ListItem",
              position: 2,
              name: "Indemnisation vol retardé ou annulé",
              item: `${SITE_URL}/indemnisation`,
            },
          ],
        }),
      },
    ],
  }),
  component: IndemnisationPage,
});

function IndemnisationPage() {
  return (
    <article className="container-page max-w-3xl py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        / Indemnisation
      </nav>

      <h1 className="mt-3 font-display">Vol retardé ou annulé : vos droits à indemnisation</h1>
      <p className="mt-4 text-base text-muted-foreground">
        Un vol perturbé n'est pas seulement une contrariété : dans de nombreux cas, la réglementation
        européenne vous donne droit à une compensation financière, indépendamment du prix payé pour le
        billet. Voici dans quels cas, et comment faire valoir ce droit sans y passer des heures.
      </p>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Dans quels cas êtes-vous éligible ?</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Le règlement européen (CE) n° 261/2004 s'applique à tout vol au départ d'un aéroport de l'UE,
          ainsi qu'aux vols à destination de l'UE opérés par une compagnie européenne. Il couvre trois
          situations :
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
          <li>
            <strong className="text-foreground">Retard à l'arrivée de 3 heures ou plus</strong> par
            rapport à l'horaire prévu.
          </li>
          <li>
            <strong className="text-foreground">Annulation</strong> notifiée moins de 14 jours avant le
            départ.
          </li>
          <li>
            <strong className="text-foreground">Refus d'embarquement</strong> pour surbooking, contre
            votre volonté.
          </li>
        </ul>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Le montant de l'indemnisation dépend de la distance du vol : 250 € pour moins de 1 500 km,
          400 € entre 1 500 et 3 500 km, 600 € au-delà, sous réserve des conditions exactes du
          règlement.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Ce qui n'est pas indemnisé</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          La compagnie n'est pas tenue de vous indemniser si le retard ou l'annulation résulte de
          « circonstances extraordinaires » qu'elle ne pouvait pas raisonnablement éviter : conditions
          météorologiques dangereuses, grève du contrôle aérien, risque pour la sécurité, ou instabilité
          politique. Un problème technique récurrent ou un souci d'organisation de la compagnie, en
          revanche, ne compte généralement pas comme circonstance extraordinaire — c'est souvent là que
          se joue un dossier.
        </p>
      </section>

      <section className="mt-8">
        <h2 className="font-display text-xl font-semibold">Comment faire la demande</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Vous pouvez adresser la demande directement à la compagnie aérienne, gratuitement. Si elle ne
          répond pas ou refuse à tort, un service spécialisé comme AirHelp peut se charger du dossier
          (vérification d'éligibilité, relance de la compagnie, procédure si nécessaire) contre une
          commission prélevée uniquement en cas d'indemnisation obtenue.
        </p>
        <Button asChild size="lg" className="mt-4">
          <a href={AIRHELP_URL} target="_blank" rel="noopener noreferrer nofollow sponsored">
            Vérifier mon éligibilité sur AirHelp
          </a>
        </Button>
      </section>

      <section className="mt-10 rounded-xl border border-border bg-card p-5">
        <h2 className="font-display text-base font-semibold">Un prochain vol à comparer ?</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Prix total taxes incluses, vendeur réel affiché sur chaque résultat, lien direct vers ce
          vendeur.
        </p>
        <Button asChild variant="outline" className="mt-3">
          <a href="/#recherche">Rechercher un vol</a>
        </Button>
      </section>
    </article>
  );
}
