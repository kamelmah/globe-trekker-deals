import { Link, createFileRoute } from "@tanstack/react-router";

import { AIRLINE_BAGGAGE, formatBaggageFee, type BaggageAllowance } from "@/data/baggage-fees";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

/**
 * Aiguillage vers les pages bagages par compagnie.
 *
 * Cette page portait le détail des sept compagnies. Les requêtes réelles étant
 * nommées — « bagage cabine Transavia », « prix soute Ryanair » —, une page
 * généraliste ne se positionne sur aucune d'elles. Le détail vit maintenant sur
 * /bagages/<compagnie>, et il n'est PAS recopié ici : ce tableau ne porte que
 * les deux colonnes qui servent à choisir où aller.
 *
 * Les pages de liaison, elles, gardent ce qui dépend du trajet : ce que la
 * soute coûte à partir du plancher relevé sur cette route.
 */

const TITLE = "Frais de bagages : comparatif des compagnies";
const DESCRIPTION =
  "Quelles compagnies comprennent le bagage cabine, à partir de quel prix elles facturent la soute, et la page détaillée de chacune. Chiffres sourcés et datés.";

const linkClass = "font-medium text-primary underline-offset-2 hover:underline";

export const Route = createFileRoute("/bagages/")({
  head: () => ({
    meta: [
      { title: `${TITLE} | TrouveMonVol` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/bagages` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/bagages` }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
            { "@type": "ListItem", position: 2, name: "Bagages", item: `${SITE_URL}/bagages` },
          ],
        }),
      },
    ],
  }),
  component: BagagesPage,
});

/** Tarif publié, centimes compris quand la compagnie en affiche. */
const euros = formatBaggageFee;

/**
 * Colonnes du tableau d'aiguillage. « Compris » n'est écrit que si la franchise
 * l'est vraiment : Volotea affichait « Compris (10 kg) » en cabine alors que son
 * tarif standard ne couvre que le sac sous le siège.
 */
function cabinSummary(allowance: BaggageAllowance): string {
  if (allowance.kind === "inclus") {
    return allowance.weightKg ? `Compris (${allowance.weightKg} kg)` : "Compris";
  }
  if (allowance.kind === "payant") return `À partir de ${euros(allowance.minEur)}`;
  return "Non documenté";
}

/** Colonne « soute » : le prix de départ, ou le fait qu'elle soit comprise. */
function checkedSummary(allowance: BaggageAllowance): string {
  if (allowance.kind === "inclus") {
    return allowance.weightKg ? `Comprise (${allowance.weightKg} kg)` : "Comprise";
  }
  if (allowance.kind === "payant") {
    return allowance.weightKg
      ? `${euros(allowance.minEur)} (${allowance.weightKg} kg)`
      : euros(allowance.minEur);
  }
  // Formats vendus connus, tarifs non publiés : le dire plutôt que « non documenté ».
  return allowance.tiers && allowance.tiers.length > 0
    ? `${allowance.tiers.map((t) => `${t.weightKg} kg`).join(", ")} — prix non publié`
    : "Non documenté";
}

function BagagesPage() {
  const compagnies = [...AIRLINE_BAGGAGE].sort((a, b) => a.name.localeCompare(b.name, "fr"));

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        / Bagages
      </nav>

      <h1 className="mt-4 font-display text-3xl font-semibold">
        Frais de bagages, compagnie par compagnie
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Un billet à 40 € avec une valise à 31 € coûte 71 €. C'est ce total qui compte, et c'est lui
        que les prix d'appel ne montrent pas. Choisissez une compagnie pour sa franchise détaillée,
        ses tarifs en ligne et au comptoir, et ce que la soute ajoute sur chaque liaison que nous
        couvrons.
      </p>

      <div className="mt-10 max-w-3xl space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Les {compagnies.length} compagnies documentées
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[32rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Bagage cabine et prix de départ de la soute, par compagnie
              </caption>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Compagnie
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Bagage cabine
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Soute à partir de
                  </th>
                </tr>
              </thead>
              <tbody>
                {compagnies.map((policy) => (
                  <tr key={policy.airline} className="border-b border-border/60">
                    <th scope="row" className="py-3 pr-4 font-normal">
                      <Link
                        to="/bagages/$compagnie"
                        params={{ compagnie: policy.slug }}
                        className={linkClass}
                      >
                        {policy.name}
                      </Link>
                    </th>
                    <td className="py-3 pr-4">{cabinSummary(policy.cabinBag)}</td>
                    <td className="py-3">{checkedSummary(policy.checkedBag)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-xs">
            Franchises détaillées, tarifs au comptoir, sources datées et surcoût par liaison : sur
            la page de chaque compagnie.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Les trois niveaux de bagage
          </h2>
          <p className="mt-3">
            Un <strong className="text-foreground">objet personnel</strong> est le petit sac qui
            passe sous le siège. Le <strong className="text-foreground">bagage cabine</strong> est
            la valise du coffre à bagages : compris chez la plupart des compagnies, payant chez
            Ryanair et easyJet. La <strong className="text-foreground">valise en soute</strong> est
            enregistrée au départ.
          </p>
          <p className="mt-3">
            Ces trois niveaux sont alternatifs, pas cumulatifs : prendre une soute chez Ryanair
            n'oblige pas à payer aussi le bagage cabine. L'objet personnel reste compris dans tous
            les cas.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ce que ces montants sont, et ne sont pas
          </h2>
          <p className="mt-3">
            Ce sont les frais <strong className="text-foreground">publiés</strong> par la compagnie,
            pas un prix négocié pour un vol précis. Ils varient selon la ligne, la saison, le poids
            et surtout le moment de l'achat : un bagage payé au comptoir coûte souvent le double ou
            le triple de son prix en ligne. D'où des fourchettes, jamais un chiffre unique.
          </p>
          <p className="mt-3">
            Notre source tarifaire ne renvoie aucune donnée bagage. Ce barème est donc tenu à la
            main, et chaque page porte sa source et sa date de vérification. Une compagnie absente
            n'est pas une compagnie sans bagages : c'est une compagnie que nous n'avons pas
            documentée, et nous le disons plutôt que de laisser deviner. Le reste de notre
            fonctionnement est expliqué sur{" "}
            <Link to="/methodologie" className={linkClass}>
              méthodologie
            </Link>
            .
          </p>
        </section>
      </div>
    </article>
  );
}
