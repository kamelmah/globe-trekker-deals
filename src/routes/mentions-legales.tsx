import { createFileRoute } from "@tanstack/react-router";

import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Mentions légales | TrouveMonVol";
const DESCRIPTION =
  "Éditeur, hébergeur et informations légales du comparateur de vols TrouveMonVol.";

export const Route = createFileRoute("/mentions-legales")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/mentions-legales` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/mentions-legales` }],
  }),
  component: LegalPage,
});

function LegalPage() {
  return (
    <article className="container-page prose-page py-12">
      <h1 className="font-display text-3xl font-semibold">Mentions légales</h1>

      <h2 className="mt-8 font-display text-xl font-semibold">Éditeur du site</h2>
      <p className="mt-2 text-muted-foreground">
        Nom de l'éditeur : [à compléter]. Forme juridique : [à compléter]. Adresse du siège :
        [à compléter]. SIRET : [à compléter]. Numéro de TVA intracommunautaire : [à compléter].
        Adresse e-mail de contact : [à compléter].
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Responsable de la publication</h2>
      <p className="mt-2 text-muted-foreground">[Nom du responsable de la publication — à compléter].</p>

      <h2 className="mt-8 font-display text-xl font-semibold">Hébergeur</h2>
      <p className="mt-2 text-muted-foreground">
        Nom de l'hébergeur : [à compléter]. Adresse : [à compléter]. Téléphone : [à compléter].
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Nature du service</h2>
      <p className="mt-2 text-muted-foreground">
        TrouveMonVol est un comparateur de prix de vols. Le site ne vend aucun billet : les
        réservations sont réalisées auprès du vendeur affiché sur chaque résultat (compagnie
        aérienne ou agence de voyages), qui reste seul responsable du contrat de transport, des
        conditions tarifaires et du service après-vente. Les prix affichés sont fournis par nos
        partenaires de distribution et peuvent évoluer entre la recherche et la réservation.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Propriété intellectuelle</h2>
      <p className="mt-2 text-muted-foreground">
        Les textes, le logo et les éléments graphiques du site sont protégés. Toute reproduction
        sans autorisation écrite préalable est interdite. Les marques des compagnies aériennes et
        des agences citées appartiennent à leurs propriétaires respectifs.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Liens d'affiliation</h2>
      <p className="mt-2 text-muted-foreground">
        Le site perçoit une commission d'affiliation lorsqu'une réservation est effectuée après un
        clic depuis TrouveMonVol, sans surcoût pour vous. Les détails sont expliqués sur la page
        « Comment on gagne de l'argent ».
      </p>
    </article>
  );
}
