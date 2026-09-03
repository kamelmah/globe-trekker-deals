import { Link, createFileRoute, notFound } from "@tanstack/react-router";

import {
  AIRLINE_BAGGAGE,
  formatBaggageFee,
  type BaggageAllowance,
  type BaggageTier,
} from "@/data/baggage-fees";
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
        ? `Ce que ${policy.name} comprend dans son tarif de base et ce qu'elle facture en soute (à partir de ${formatBaggageFee(policy.checkedBag.minEur)}), avec le surcoût réel calculé sur ${routes.length} liaisons du site.`
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

/** Tarif publié, centimes compris quand la compagnie en affiche. */
const euros = formatBaggageFee;

/**
 * Une franchise en clair. Poids, dimensions et plafond ne sont affichés que si
 * la source les donne : « à partir de 9 € » quand la compagnie ne publie pas de
 * plafond, jamais un maximum reconstitué.
 */
function allowanceText(allowance: BaggageAllowance): string {
  if (allowance.kind === "inconnu") {
    return allowance.tiers && allowance.tiers.length > 0
      ? `Vendue en ${allowance.tiers.map((t) => `${t.weightKg} kg`).join(", ")} — tarifs non publiés sur la page relevée`
      : "Non documenté chez nous";
  }
  const detail = [
    allowance.weightKg ? `${allowance.weightKg} kg` : null,
    allowance.dimensionsCm ?? null,
  ].filter(Boolean);
  const precisions = detail.length > 0 ? ` (${detail.join(", ")})` : "";
  if (allowance.kind === "inclus") return `Compris dans le tarif de base${precisions}`;
  const tarif =
    allowance.maxEur === undefined
      ? `à partir de ${euros(allowance.minEur)}`
      : allowance.maxEur === allowance.minEur
        ? euros(allowance.minEur)
        : `de ${euros(allowance.minEur)} à ${euros(allowance.maxEur)}`;
  const surPlace = [
    allowance.atAirportEur ? `${euros(allowance.atAirportEur)} sur place` : null,
    allowance.atGateEur ? `${euros(allowance.atGateEur)} à la porte` : null,
  ].filter(Boolean);
  const fin = surPlace.length > 0 ? `, ${surPlace.join(", ")}` : "";
  return `Payant, ${tarif} à l'achat en ligne${precisions}${fin}`;
}

/** La grille de la compagnie, quand elle en publie une. */
function tiersOf(allowance: BaggageAllowance): BaggageTier[] {
  if (allowance.kind === "inclus") return [];
  return allowance.tiers ?? [];
}

function CompagnieBagagesPage() {
  const { policy, routes } = Route.useLoaderData();
  const verifie = formatDateMedium(policy.verifiedAt) || policy.verifiedAt;
  const tiersSoute = tiersOf(policy.checkedBag);
  const tarifsConnus = tiersSoute.some(
    (t) => t.onlineEur !== undefined || t.airportEur !== undefined,
  );
  const excedent =
    policy.checkedBag.kind === "payant" ? policy.checkedBag.excessPerKgEur : undefined;
  // Le poids que le plancher achète : sans lui, « 9 € » et « 29,99 € » se
  // comparent comme s'ils achetaient la même valise.
  const poidsPlancher =
    policy.checkedBag.kind === "payant" && policy.checkedBag.weightKg
      ? ` (${policy.checkedBag.weightKg} kg)`
      : "";
  // Les champs dont la source diffère de celle de l'entrée : on ne laisse pas
  // une correction officielle couvrir un chiffre qui, lui, ne l'est pas.
  // Une mise en garde ne vaut que pour ce qui manque vraiment : depuis la
  // correction Volotea, certaines franchises portent leurs dimensions.
  const dimensionsConnues = [policy.personalItem, policy.cabinBag, policy.checkedBag].some(
    (a) => a.kind !== "inconnu" && a.dimensionsCm,
  );
  const sourcesParChamp = (
    [
      ["Objet personnel", policy.sources?.personalItem],
      ["Bagage cabine", policy.sources?.cabinBag],
      ["Valise en soute", policy.sources?.checkedBag],
    ] as const
  ).flatMap(([label, source]) => (source ? [{ label, source }] : []));

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
            {dimensionsConnues
              ? "Nous ne publions pas les paliers de prix par tranche de poids : notre barème ne les contient pas, et nous ne les estimons pas."
              : "Nous ne publions ni les dimensions en centimètres, ni les paliers de prix par tranche de poids : notre barème ne les contient pas, et nous ne les estimons pas."}{" "}
            Vérifiez-les sur la page de la compagnie avant de réserver.
          </p>
        </section>

        {tiersSoute.length > 0 && (
          <section>
            <h2 className="font-display text-xl font-semibold text-foreground">
              {tarifsConnus ? "Tarifs de la soute, palier par palier" : "Formats de soute vendus"}
            </h2>
            <p className="mt-3">
              {tarifsConnus
                ? `Acheté avec le billet ou ajouté sur place, ce n'est pas le même prix. ${policy.name} publie la grille suivante, par trajet.`
                : `${policy.name} publie les formats vendus, pas leurs tarifs : les poids sont ceux de la compagnie, les prix restent absents plutôt qu'estimés.`}
            </p>
            {tarifsConnus && (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full min-w-[24rem] border-collapse text-left text-sm">
                  <caption className="sr-only">
                    Tarifs du bagage en soute {policy.name} par palier de poids
                  </caption>
                  <thead>
                    <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Poids
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium">
                        En ligne
                      </th>
                      <th scope="col" className="py-2 font-medium">
                        Sur place
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {tiersSoute.map((tier) => (
                      <tr key={tier.weightKg} className="border-b border-border/60">
                        <th scope="row" className="py-3 pr-4 font-normal">
                          {tier.weightKg} kg
                        </th>
                        <td className="py-3 pr-4">
                          {tier.onlineEur === undefined ? "—" : euros(tier.onlineEur)}
                        </td>
                        <td className="py-3">
                          {tier.airportEur === undefined ? "—" : euros(tier.airportEur)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {tarifsConnus && (
              <p className="mt-3 text-xs">
                Ces montants sont des <strong className="text-foreground">planchers</strong> : le
                tarif dépend de la destination, du vol et du moment de la réservation. Un tiret
                signale un palier que {policy.name} ne vend pas par ce canal.
              </p>
            )}
            {excedent !== undefined && (
              <p className="mt-3">
                Au-delà du palier acheté, l'excédent est facturé à partir de {euros(excedent)} par
                kilo.
              </p>
            )}
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
                : `Le supplément de ${euros(routes[0]!.supplementEur)}${poidsPlancher} est le même partout ; ce qu'il pèse ne l'est pas. Sur chacune des liaisons ci-dessous, il est rapporté au plancher que nous avons relevé sur cette route précise.`}
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
          {sourcesParChamp.length > 0 && (
            <ul className="mt-3 space-y-2">
              {sourcesParChamp.map(({ label, source }) => (
                <li key={label}>
                  {label} —{" "}
                  {source.officielle ? "source officielle" : "source secondaire, à revérifier"},{" "}
                  {formatDateMedium(source.verifiedAt) || source.verifiedAt} :{" "}
                  <a
                    href={source.url}
                    className={linkClass}
                    rel="nofollow noopener noreferrer"
                    target="_blank"
                  >
                    {new URL(source.url).hostname}
                  </a>
                </li>
              ))}
            </ul>
          )}
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
