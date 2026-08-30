import { Link, createFileRoute } from "@tanstack/react-router";

import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

const TITLE = "Comment on gagne de l'argent — transparence TrouveMonVol";
const DESCRIPTION =
  "Notre modèle économique en clair : une commission d'affiliation versée par le vendeur du billet, sans surcoût pour vous et sans revente de données.";

export const Route = createFileRoute("/comment-on-gagne-de-l-argent")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/comment-on-gagne-de-l-argent` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/comment-on-gagne-de-l-argent` }],
  }),
  component: MoneyPage,
});

function MoneyPage() {
  return (
    <div className="container-page max-w-3xl py-10">
      <h1 className="font-display text-3xl font-semibold">Comment on gagne de l'argent</h1>

      <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
        Un comparateur gratuit doit bien se financer d'une manière ou d'une autre. Chez la plupart des
        sites, cela passe par la publicité, la mise en avant payante de certains partenaires ou la
        revente de données de navigation. Nous avons choisi deux sources de revenus seulement, et les
        voici en entier.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Un partenaire publicitaire</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Le site charge un script publicitaire tiers qui peut afficher des emplacements sponsorisés et
        gère votre consentement aux cookies. Il ne modifie jamais le classement des vols : les
        résultats restent triés par prix réel, et aucun vendeur ne peut payer pour remonter dans la
        liste. Vous pouvez refuser le dépôt de cookies publicitaires depuis la bannière de
        consentement.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Une commission versée par le vendeur</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Lorsque vous cliquez sur « Réserver », vous arrivez chez le vendeur du billet — la compagnie
        aérienne ou l'agence nommée sur le résultat. Si vous achetez, ce vendeur nous verse une
        commission d'affiliation, prélevée sur sa propre marge. Le prix que vous payez est identique à
        celui que vous auriez obtenu en allant directement sur son site. Nous n'ajoutons aucun frais de
        dossier, aucune assurance cochée par défaut, aucun supplément de service.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Ce que la commission ne change pas</h2>
      <ul className="mt-3 space-y-2 text-sm leading-relaxed text-muted-foreground">
        <li>
          • <strong className="text-foreground">L'ordre des résultats.</strong> Les vols sont triés par
          prix total, taxes incluses. Aucun vendeur ne peut acheter la première place.
        </li>
        <li>
          • <strong className="text-foreground">Les offres affichées.</strong> Nous n'excluons pas une
          offre parce qu'elle rapporte moins, et nous affichons aussi les vols vendus directement par
          les compagnies.
        </li>
        <li>
          • <strong className="text-foreground">Le prix.</strong> Il n'existe pas de version « plus
          chère parce que passée par un comparateur ».
        </li>
      </ul>

      <h2 className="mt-8 font-display text-xl font-semibold">Ce que nous ne faisons pas</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Pas de comptes à rebours, pas de faux « plus que 2 places à ce
        prix », pas de prix d'appel qui gonfle à l'étape du paiement. Nous ne revendons pas votre email
        : il ne sert qu'aux alertes que vous demandez, et chaque message contient un lien de
        désinscription immédiate.
      </p>

      <h2 className="mt-8 font-display text-xl font-semibold">Nos limites, dites franchement</h2>
      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
        Nous ne couvrons pas la totalité du marché : certaines compagnies ne distribuent pas leurs
        tarifs aux comparateurs. Les prix proviennent des bases tarifaires de nos partenaires et
        peuvent évoluer en quelques minutes. Enfin, en cas de problème sur votre voyage, votre
        interlocuteur est le vendeur du billet — c'est précisément pour cela que nous affichons toujours
        son nom.
      </p>

      <div className="mt-10 rounded-xl border border-border bg-secondary/40 p-5 text-sm text-muted-foreground">
        Une question qui n'est pas traitée ici ? Elle est peut-être dans la{" "}
        <Link to="/faq" className="font-medium text-primary underline-offset-2 hover:underline">
          FAQ
        </Link>
        .
      </div>
    </div>
  );
}
