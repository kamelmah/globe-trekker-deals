import { Link, createFileRoute } from "@tanstack/react-router";

import { AIRLINE_BAGGAGE } from "@/data/baggage-fees";
import { ROUTE_WHITELIST, WHITELIST_VALIDATED_AT } from "@/data/route-whitelist";
import { formatDateMedium } from "@/lib/dates";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

/**
 * Comment les prix sont relevés et comparés — en UN SEUL exemplaire.
 *
 * Ce texte était répété, au nom des villes près, sur chacune des pages de
 * liaison générées (« Quand réserver », « Réserver en toute transparence »,
 * « Chez qui vais-je réserver ? »). Une même explication copiée sur 89 pages
 * n'apprend rien de plus au lecteur et signale à Google un gabarit, pas un
 * contenu. Elle vit ici, et chaque page de liaison y renvoie.
 */

const TITLE = "Comment TrouveMonVol relève et compare les prix des vols";
const DESCRIPTION =
  "D'où viennent nos prix, à quelle fréquence ils sont relevés, ce que « taxes incluses » veut dire, comment nous traitons les bagages et ce que nous refusons d'afficher.";

const linkClass = "font-medium text-primary underline-offset-2 hover:underline";

export const Route = createFileRoute("/methodologie")({
  head: () => ({
    meta: [
      { title: `${TITLE} | TrouveMonVol` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/methodologie` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/methodologie` }],
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
              name: "Méthodologie",
              item: `${SITE_URL}/methodologie`,
            },
          ],
        }),
      },
    ],
  }),
  component: MethodologiePage,
});

function MethodologiePage() {
  const routesValidees = ROUTE_WHITELIST.length;
  const dateValidation = formatDateMedium(WHITELIST_VALIDATED_AT) || WHITELIST_VALIDATED_AT;
  const compagniesDocumentees = AIRLINE_BAGGAGE.map((p) => p.name);

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        / Méthodologie
      </nav>

      <h1 className="mt-4 font-display text-3xl font-semibold">
        Comment nous relevons et comparons les prix
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Chaque prix affiché sur TrouveMonVol a une origine, une date et un vendeur. Cette page
        explique d'où il vient, ce qu'il contient, ce que nous en faisons — et ce que nous refusons
        d'afficher. Les questions plus courtes ont leur réponse dans la{" "}
        <Link to="/faq" className={linkClass}>
          FAQ
        </Link>
        .
      </p>

      <div className="mt-10 max-w-3xl space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            D'où viennent les prix
          </h2>
          <p className="mt-3">
            Nous interrogeons les bases tarifaires de nos partenaires de distribution, qui agrègent
            les offres des compagnies aériennes et des agences de voyage en ligne. Cette source
            renvoie, pour un trajet et une date de départ, le meilleur prix trouvé — pas la liste
            complète des vols de la journée. Une recherche sur une date précise affiche donc souvent
            une seule offre, la moins chère observée ; une recherche en dates flexibles (± 3 jours)
            en affiche une par jour testé, ce qui permet de comparer les jours entre eux.
          </p>
          <p className="mt-3">
            Nous ne vendons pas de billets. Quand vous cliquez sur « Réserver », vous êtes envoyé
            chez le vendeur du billet — la compagnie elle-même ou une agence nommée — et c'est là
            que vous payez, au prix que nous avons affiché. Le lien passe par une redirection
            technique qui porte notre identifiant d'affiliation ; elle est instantanée et ne modifie
            pas le prix.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ce que « taxes incluses » veut dire
          </h2>
          <p className="mt-3">
            Le montant affiché est le prix total du billet : tarif, taxes d'aéroport et frais
            obligatoires. C'est celui que le vendeur renvoie, sans arrondi de notre part et sans
            supplément découvert au moment du paiement. Il ne comprend pas les options — bagages,
            choix du siège, assurance — que le vendeur propose ensuite.
          </p>
          <p className="mt-3">
            Les prix des billets d'avion changent en continu : chaque compagnie ouvre et ferme des
            classes tarifaires selon le remplissage. Un prix relevé il y a dix minutes peut avoir
            disparu. C'est pourquoi chaque prix affiché sur le site est accompagné de sa date de
            relevé, et pourquoi les pages de liaison parlent de « prix relevé » et non de « prix
            garanti ».
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Relevés automatiques et saisonnalité
          </h2>
          <p className="mt-3">
            Nos pages de liaison ne déclenchent aucune recherche quand vous les ouvrez : elles
            lisent des relevés déjà enregistrés. Deux tâches tournent en arrière-plan. La première
            rafraîchit chaque heure les prix d'appel des liaisons suivies. La seconde relève, trajet
            par trajet, le prix le plus bas pour chacun des douze prochains mois de départ ; c'est
            elle qui alimente le graphique « Quand partir » et la phrase de saisonnalité de chaque
            page.
          </p>
          <p className="mt-3">
            Une saisonnalité n'est affichée qu'à partir de trois mois relevés : deux points font une
            droite, pas une saison. Les mois sans relevé restent vides plutôt que comblés par une
            estimation, et le « prix plancher » d'une page est le plus bas jamais observé sur le
            trajet, daté. Les pages sur lesquelles aucun relevé n'existe encore le disent plutôt que
            d'afficher un chiffre inventé.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Quelles liaisons ont une page
          </h2>
          <p className="mt-3">
            Le site compte {routesValidees} liaisons vérifiées. Chacune a été confrontée à l'API
            tarifaire le {dateValidation} sur trois mois de départ : une liaison n'entre dans la
            liste que si de vraies offres en vol direct ont été renvoyées. Les quelques trajets avec
            escale qui figurent malgré tout dans la liste sont signalés comme tels sur leur page,
            sans durée de vol direct annoncée. Cette liste est revalidée tous les six mois, comme le
            barème des bagages.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Bagages : ce que nous savons, et ce que nous ne savons pas
          </h2>
          <p className="mt-3">
            Notre source tarifaire ne renvoie aucune information bagage. Plutôt que d'afficher une
            inclusion que rien ne garantit, nous tenons à la main un barème des frais publiés par
            les compagnies les plus présentes sur nos liaisons — aujourd'hui{" "}
            {compagniesDocumentees.slice(0, -1).join(", ")} et {compagniesDocumentees.at(-1)}.
            Chaque entrée porte sa source et sa date de vérification.
          </p>
          <p className="mt-3">
            Ces montants sont des fourchettes publiées, jamais un prix ferme : ils varient selon la
            ligne, la saison et surtout le moment de l'achat, un bagage acheté au comptoir coûtant
            souvent le double de son prix en ligne. Le prix « valise comprise » que nous calculons
            est donc une estimation basse. Une compagnie absente du barème n'est pas une compagnie
            sans bagages : c'est une compagnie que nous n'avons pas documentée, et la page le dit.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Dates flexibles, calendrier et alertes
          </h2>
          <p className="mt-3">
            Le calendrier des prix du formulaire de recherche affiche, pour chaque jour du mois, le
            prix le plus bas réellement trouvé ; les jours sans donnée restent vides. L'option «
            dates flexibles ± 3 jours » interroge plusieurs journées autour de la date choisie et
            conserve la meilleure offre.
          </p>
          <p className="mt-3">
            Les alertes prix ne demandent pas de compte : vous laissez un e-mail sur une page de
            résultats ou de liaison, nous enregistrons le trajet et le prix du moment, nous le
            revérifions une fois par jour et nous n'écrivons que s'il a baissé. Chaque message
            contient un lien de désinscription en un clic.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ce que nous n'affichons pas
          </h2>
          <p className="mt-3">
            Pas de compte à rebours, pas de « dernières places », pas de publicité tierce et pas
            d'offre mise en avant contre rémunération. Le classement des résultats se fait par prix
            total réel, et toutes les liaisons sont comparées avec les mêmes règles. Chaque résultat
            affiche une estimation de l'empreinte carbone du vol, calculée à partir de la distance
            et majorée en cas d'escale : un ordre de grandeur pour comparer deux itinéraires, pas
            une mesure certifiée.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Comment nous sommes rémunérés
          </h2>
          <p className="mt-3">
            Quand vous réservez chez un vendeur après être passé par TrouveMonVol, il nous verse une
            commission d'affiliation, prélevée sur sa marge. Elle ne s'ajoute pas à votre facture et
            n'influence pas l'ordre des résultats.
          </p>
          <p className="mt-3">
            Certains liens vers Hotels.com sont des liens partenaires : si vous réservez,
            TrouveMonVol perçoit une commission de la plateforme, sans modification du prix affiché.
            Ils sont signalés comme tels partout où ils apparaissent, et n'ouvrent jamais autre
            chose que la recherche d'hôtels de la ville que vous consultiez.
          </p>
          <p className="mt-3">
            Une question sur tout cela ?{" "}
            <Link to="/contact" className={linkClass}>
              Écrivez-nous
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
