import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import { AIRLINE_BAGGAGE, type BaggageAllowance } from "@/data/baggage-fees";
import { airlineBySlug, routesForAirline } from "@/lib/baggage-routes";
import { formatDateMedium } from "@/lib/dates";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

/**
 * Franchise et frais de bagages d'UNE compagnie.
 *
 * Les requêtes réelles sont nommées : « bagage cabine Transavia », « soute
 * Ryanair prix ». Une page unique qui empile sept compagnies ne se positionne
 * sur aucune. /bagages reste, en aiguillage.
 *
 * CE QUI REND CETTE PAGE UNIQUE, et la relie au reste du site, est le dernier
 * bloc : les liaisons du site desservies par la compagnie, avec le surcoût
 * soute calculé sur le plancher de chacune. Il est CALCULÉ (voir
 * `routesForAirline`), jamais rédigé — le tarif publié d'une compagnie est le
 * même partout, sa part du billet ne l'est pas.
 *
 * CE QUE CETTE PAGE N'AFFICHE PAS, faute de source : les dimensions en
 * centimètres des bagages, les paliers de prix par tranche de poids, et les
 * pénalités de dépassement autres que le tarif au comptoir. Rien de tout cela
 * n'est dans notre barème, et il n'est pas question de l'estimer. Les champs
 * sont absents, pas approximés.
 */

const linkClass = "font-medium text-primary underline-offset-2 hover:underline";

export const Route = createFileRoute("/bagages/$compagnie")({
  loader: ({ params }) => {
    const policy = airlineBySlug(params.compagnie, AIRLINE_BAGGAGE);
    if (!policy) throw notFound();
    return { policy, routes: routesForAirline(policy) };
  },

  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [
          { title: "Compagnie introuvable | TrouveMonVol" },
          { name: "robots", content: "noindex" },
        ],
      };
    }
    const { policy, routes } = loaderData;
    const url = `${SITE_URL}/bagages/${policy.slug}`;
    const title = `Bagages ${policy.name} : cabine, soute et tarifs`;
    const description =
      policy.checkedBag.kind === "payant"
        ? `Ce que ${policy.name} comprend dans son tarif de base et ce qu'elle facture en soute (à partir de ${Math.round(policy.checkedBag.minEur)} €), avec le surcoût réel calculé sur ${routes.length} liaisons du site.`
        : `Ce que ${policy.name} comprend dans son tarif de base pour la cabine et la soute, source et date de vérification à l'appui.`;
    return {
      meta: [
        { title: `${title} | TrouveMonVol` },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:url", content: url },
        { property: "og:image", content: DEFAULT_OG_IMAGE },
        { name: "twitter:image", content: DEFAULT_OG_IMAGE },
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Accueil", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Bagages", item: `${SITE_URL}/bagages` },
              { "@type": "ListItem", position: 3, name: policy.name, item: url },
            ],
          }),
        },
      ],
    };
  },

  component: CompagnieBagagesPage,
});

const euros = (value: number) => `${Math.round(value)} €`;

/** Une franchise en clair. Le poids n'est affiché que si la source le donne. */
function allowanceText(allowance: BaggageAllowance): string {
  const poids =
    "weightKg" in allowance && allowance.weightKg ? ` jusqu'à ${allowance.weightKg} kg` : "";
  if (allowance.kind === "inclus") return `Compris dans le tarif de base${poids}`;
  if (allowance.kind === "payant") {
    const fourchette =
      allowance.minEur === allowance.maxEur
        ? euros(allowance.minEur)
        : `de ${euros(allowance.minEur)} à ${euros(allowance.maxEur)}`;
    return `Payant, ${fourchette} à l'achat en ligne${poids}`;
  }
  return "Non documenté chez nous";
}

function CompagnieBagagesPage() {
  const { policy, routes } = Route.useLoaderData();
  const verifie = formatDateMedium(policy.verifiedAt) || policy.verifiedAt;
  const comptoir = policy.checkedBag.kind === "payant" ? policy.checkedBag.atAirportEur : undefined;
  const enLigne = policy.checkedBag.kind === "payant" ? policy.checkedBag.minEur : undefined;

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        /{" "}
        <Link to="/bagages" className="hover:text-foreground">
          Bagages
        </Link>{" "}
        / {policy.name}
      </nav>

      <h1 className="mt-4 font-display text-3xl font-semibold">
        Bagages {policy.name} : ce qui est compris, ce qui se paie
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Franchise et suppléments publiés par {policy.name}, vérifiés le {verifie}.
        {routes.length > 0
          ? ` Plus bas, les ${routes.length} liaisons du site desservies par la compagnie, avec ce que la soute y ajoute.`
          : ""}
      </p>

      <div className="mt-10 max-w-3xl space-y-10 text-sm leading-relaxed text-muted-foreground">
        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">
            Ce que comprend le tarif de base
          </h2>
          <dl className="mt-4 space-y-3">
            <div className="rounded-lg border border-border bg-card p-4">
              <dt className="font-medium text-foreground">Objet personnel (sac sous le siège)</dt>
              <dd className="mt-1">{allowanceText(policy.personalItem)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <dt className="font-medium text-foreground">Bagage cabine (coffre à bagages)</dt>
              <dd className="mt-1">{allowanceText(policy.cabinBag)}</dd>
            </div>
            <div className="rounded-lg border border-border bg-card p-4">
              <dt className="font-medium text-foreground">Valise en soute</dt>
              <dd className="mt-1">{allowanceText(policy.checkedBag)}</dd>
            </div>
          </dl>
          {policy.note && <p className="mt-4">{policy.note}</p>}
          <p className="mt-4 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-xs">
            Nous ne publions ni les dimensions en centimètres, ni les paliers de prix par tranche de
            poids : notre barème ne les contient pas, et nous ne les estimons pas. Vérifiez-les sur
            la page de la compagnie avant de réserver.
          </p>
        </section>

        {enLigne !== undefined && (
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">
              En ligne ou au comptoir
            </h2>
            <p className="mt-3">
              Acheté en même temps que le billet, le bagage en soute démarre à {euros(enLigne)}.
              {comptoir !== undefined
                ? ` Ajouté au comptoir de l'aéroport, ${policy.name} le facture ${euros(comptoir)}, soit ${Math.round(comptoir / enLigne)} fois son prix en ligne — c'est le prix d'un oubli, pas d'un service différent.`
                : ` Le tarif au comptoir n'est pas publié par ${policy.name} dans notre source : nous ne l'affichons pas plutôt que de l'estimer.`}
            </p>
          </section>
        )}

        {routes.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {routes[0]!.supplementEur === null
                ? "Les liaisons du site desservies par la compagnie"
                : "Ce que la soute coûte vraiment, liaison par liaison"}
            </h2>
            <p className="mt-3">
              {routes[0]!.supplementEur === null
                ? `Nous n'avons pas de tarif soute pour ${policy.name} : les liaisons et leurs planchers sont réels, la colonne du surcoût reste vide plutôt qu'estimée.`
                : `Le supplément de ${euros(routes[0]!.supplementEur)} est le même partout ; ce qu'il pèse ne l'est pas. Sur chacune des liaisons ci-dessous, il est rapporté au plancher que nous avons relevé sur cette route précise.`}
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
                <caption className="sr-only">
                  {routes[0]!.supplementEur === null
                    ? `Liaisons desservies par ${policy.name} et plancher relevé sur chacune`
                    : `Surcoût de la valise en soute ${policy.name} par liaison`}
                </caption>
                <thead>
                  <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Liaison
                    </th>
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Plancher relevé
                    </th>
                    <th scope="col" className="py-2 pr-4 font-medium">
                      Soute comprise
                    </th>
                    <th scope="col" className="py-2 font-medium">
                      Part du billet
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {routes.map((row) => (
                    <tr key={row.slug} className="border-b border-border/60">
                      <th scope="row" className="py-3 pr-4 font-normal">
                        <Link to="/vols/$slug" params={{ slug: row.slug }} className={linkClass}>
                          {row.originCity} — {row.destinationCity}
                        </Link>
                        <span className="block text-xs text-muted-foreground">{row.country}</span>
                      </th>
                      <td className="py-3 pr-4">{euros(row.floorEur)}</td>
                      <td className="py-3 pr-4 font-medium text-foreground">
                        {row.totalEur === null ? "—" : euros(row.totalEur)}
                      </td>
                      <td className="py-3">
                        {row.supplementEur === null
                          ? "non documenté"
                          : row.supplementEur === 0
                            ? "comprise"
                            : `+${row.partPourcent} %`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 text-xs">
              Planchers relevés par notre source tarifaire lors de la validation de chaque liaison.
              Un prix de vol bouge : le rapport, lui, donne l'ordre de grandeur du poids de la soute
              sur cette route.
            </p>
          </section>
        )}

        <section>
          <h2 className="font-display text-xl font-semibold text-foreground">Source</h2>
          <p className="mt-3">
            {policy.sourceOfficielle
              ? `Chiffres relevés sur le site de ${policy.name}, le ${verifie} :`
              : `Chiffres relevés le ${verifie} sur une source secondaire — pas la page officielle de ${policy.name}, et nous le disons plutôt que de le laisser croire :`}{" "}
            <a
              href={policy.source}
              className={linkClass}
              rel="nofollow noopener noreferrer"
              target="_blank"
            >
              {new URL(policy.source).hostname}
            </a>
            .
          </p>
          <p className="mt-3">
            Barème revérifié tous les six mois. Le comparatif des sept compagnies est sur la page{" "}
            <Link to="/bagages" className={linkClass}>
              bagages
            </Link>
            , et notre fonctionnement sur{" "}
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
