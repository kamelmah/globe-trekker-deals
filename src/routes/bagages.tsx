import { Link, createFileRoute } from "@tanstack/react-router";

import { AIRLINE_BAGGAGE, type BaggageAllowance } from "@/data/baggage-fees";
import { formatDateMedium } from "@/lib/dates";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

/**
 * Frais de bagages par compagnie — en UN SEUL exemplaire.
 *
 * Ces grilles étaient recopiées à l'identique dans la section « Compagnies et
 * bagages » de chaque page de liaison, partout où la compagnie vole : Ryanair
 * sur 34 routes, Transavia sur 18, Volotea sur 15. Le tarif publié d'une
 * compagnie ne dépend pas du trajet — le répéter sur 126 pages n'apprenait rien
 * au lecteur et signalait un gabarit à Google.
 *
 * Les pages de liaison gardent ce qui, lui, dépend du trajet : ce que la soute
 * coûte à partir du plancher relevé sur cette route, et ce qu'elle y pèse en
 * pourcentage. Elles renvoient ici pour le détail.
 */

const TITLE = "Frais de bagages par compagnie : cabine, soute, en ligne et au comptoir";
const DESCRIPTION =
  "Ce que chaque compagnie comprend dans son tarif de base et ce qu'elle facture en supplément : objet personnel, bagage cabine, valise en soute, prix en ligne et au comptoir. Chiffres sourcés et datés.";

const linkClass = "font-medium text-primary underline-offset-2 hover:underline";

export const Route = createFileRoute("/bagages")({
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

const euros = (value: number) => `${Math.round(value)} €`;

/** Une franchise en une cellule : « Compris (10 kg) », « 31 à 45 € (20 kg) ». */
function allowanceLabel(allowance: BaggageAllowance): string {
  const poids = "weightKg" in allowance && allowance.weightKg ? ` (${allowance.weightKg} kg)` : "";
  if (allowance.kind === "inclus") return `Compris${poids}`;
  if (allowance.kind === "payant") {
    const fourchette =
      allowance.minEur === allowance.maxEur
        ? euros(allowance.minEur)
        : `${euros(allowance.minEur)} à ${euros(allowance.maxEur)}`;
    return `${fourchette}${poids}`;
  }
  return "Non documenté";
}

/** Tarif au comptoir, quand la compagnie le publie. */
function atAirportLabel(allowance: BaggageAllowance): string {
  if (allowance.kind !== "payant" || allowance.atAirportEur === undefined) return "—";
  return euros(allowance.atAirportEur);
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
        que les prix d'appel ne montrent pas. Cette page rassemble ce que chaque compagnie comprend
        dans son tarif de base et ce qu'elle facture en plus.
      </p>

      <div className="mt-10 max-w-3xl space-y-10 text-sm leading-relaxed text-muted-foreground">
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
            le triple de son prix en ligne. D'où des fourchettes, jamais un chiffre unique — le
            total que nous affichons ailleurs sur le site est une estimation basse, jamais un prix
            ferme.
          </p>
          <p className="mt-3">
            Notre source tarifaire ne renvoie aucune donnée bagage : ni champ, ni famille tarifaire,
            ni second prix. Ce barème est donc tenu à la main, et chaque ligne porte sa source et sa
            date de vérification. Une compagnie absente du tableau n'est pas une compagnie sans
            bagages : c'est une compagnie que nous n'avons pas documentée, et nous le disons plutôt
            que de laisser deviner.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Tarifs publiés par compagnie
          </h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full min-w-[42rem] border-collapse text-left text-sm">
              <caption className="sr-only">
                Franchises et suppléments bagages publiés par compagnie
              </caption>
              <thead>
                <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Compagnie
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Objet personnel
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Cabine
                  </th>
                  <th scope="col" className="py-2 pr-4 font-medium">
                    Soute en ligne
                  </th>
                  <th scope="col" className="py-2 font-medium">
                    Soute au comptoir
                  </th>
                </tr>
              </thead>
              <tbody>
                {compagnies.map((policy) => (
                  <tr key={policy.airline} className="border-b border-border/60 align-top">
                    <th scope="row" className="py-3 pr-4 font-medium text-foreground">
                      {policy.name}
                      <span className="block text-xs font-normal text-muted-foreground">
                        {policy.airline}
                      </span>
                    </th>
                    <td className="py-3 pr-4">{allowanceLabel(policy.personalItem)}</td>
                    <td className="py-3 pr-4">{allowanceLabel(policy.cabinBag)}</td>
                    <td className="py-3 pr-4">{allowanceLabel(policy.checkedBag)}</td>
                    <td className="py-3">{atAirportLabel(policy.checkedBag)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <ul className="mt-6 space-y-3">
            {compagnies
              .filter((policy) => policy.note)
              .map((policy) => (
                <li key={policy.airline}>
                  <strong className="text-foreground">{policy.name}</strong> — {policy.note}
                </li>
              ))}
          </ul>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Sources et dates de vérification
          </h2>
          <ul className="mt-3 space-y-2">
            {compagnies.map((policy) => (
              <li key={policy.airline}>
                <strong className="text-foreground">{policy.name}</strong> — vérifié le{" "}
                {formatDateMedium(policy.verifiedAt) || policy.verifiedAt},{" "}
                <a
                  href={policy.source}
                  className={linkClass}
                  rel="nofollow noopener noreferrer"
                  target="_blank"
                >
                  source
                </a>
              </li>
            ))}
          </ul>
          <p className="mt-4">
            Ce barème est revérifié tous les six mois, comme la liste des liaisons. Le reste de
            notre fonctionnement — d'où viennent les prix, ce que « taxes incluses » veut dire — est
            expliqué sur la page{" "}
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
