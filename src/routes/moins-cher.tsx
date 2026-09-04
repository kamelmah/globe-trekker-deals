import { Link, createFileRoute } from "@tanstack/react-router";

import { cheapestRoutes } from "@/lib/cheapest-routes.functions";
import { CHEAPEST_LIMIT, MAX_AGE_DAYS } from "@/lib/cheapest-routes.server";
import { formatPrice } from "@/lib/currency";
import { formatDateMedium } from "@/lib/dates";
import { DEFAULT_OG_IMAGE, SITE_URL } from "@/lib/site";

/**
 * Les planchers les plus bas du site, toutes routes confondues.
 *
 * Une page d'entrée pour la recherche « vol pas cher » sans destination, qui
 * n'existait nulle part : l'accueil propose une recherche, le mode budget
 * demande une origine et un budget. Ici, rien à saisir.
 *
 * Recalculée à chaque affichage, pas figée au build : le loader relit
 * `price_observations`. Un prix affiché ici a donc toujours la fraîcheur du
 * dernier passage de la tâche planifiée, et sa date est écrite à côté.
 */

const TITLE = "Les vols les moins chers relevés sur TrouveMonVol";
const DESCRIPTION =
  "Les 20 prix les plus bas que nous avons réellement relevés, taxes incluses, avec la date de chaque mesure. Aucun prix estimé, aucun tarif d'appel.";

const linkClass = "font-medium text-primary underline-offset-2 hover:underline";

export const Route = createFileRoute("/moins-cher")({
  loader: async () => {
    const { routes } = await cheapestRoutes({ data: { limit: CHEAPEST_LIMIT } });
    return { routes };
  },

  head: () => ({
    meta: [
      { title: `${TITLE} | TrouveMonVol` },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:url", content: `${SITE_URL}/moins-cher` },
      { property: "og:image", content: DEFAULT_OG_IMAGE },
      { name: "twitter:image", content: DEFAULT_OG_IMAGE },
    ],
    links: [{ rel: "canonical", href: `${SITE_URL}/moins-cher` }],
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
              name: "Les moins chers",
              item: `${SITE_URL}/moins-cher`,
            },
          ],
        }),
      },
    ],
  }),

  component: MoinsCherPage,
});

function MoinsCherPage() {
  const { routes } = Route.useLoaderData();

  return (
    <article className="container-page py-10">
      <nav className="text-xs text-muted-foreground" aria-label="Fil d'ariane">
        <Link to="/" className="hover:text-foreground">
          Accueil
        </Link>{" "}
        / Les moins chers
      </nav>

      <h1 className="mt-4 font-display text-3xl font-semibold">
        Les vols les moins chers que nous avons relevés
      </h1>
      <p className="mt-3 max-w-2xl text-base text-muted-foreground">
        Chaque prix de cette page est un montant réellement relevé sur la liaison, taxes incluses,
        et porte la date à laquelle nous l'avons mesuré. Aucun n'est une estimation, une moyenne ou
        un tarif d'appel : les liaisons dont le dernier relevé remonte à plus de {MAX_AGE_DAYS}{" "}
        jours sont retirées plutôt qu'affichées avec un prix périmé.
      </p>

      {routes.length === 0 ? (
        <p className="mt-10 rounded-lg border border-border bg-secondary/40 px-4 py-3 text-sm text-muted-foreground">
          Aucun relevé de moins de {MAX_AGE_DAYS} jours n'est disponible pour le moment. Cette page
          se remplit au fil des passages de nos relevés automatiques — nous préférons ne rien
          afficher qu'un prix que nous ne pouvons pas dater.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto">
          <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
            <caption className="sr-only">
              Les {routes.length} prix les plus bas relevés, du moins cher au plus cher
            </caption>
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th scope="col" className="py-2 pr-4 font-medium">
                  Trajet
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Pays
                </th>
                <th scope="col" className="py-2 pr-4 font-medium">
                  Prix relevé
                </th>
                <th scope="col" className="py-2 font-medium">
                  Date du relevé
                </th>
              </tr>
            </thead>
            <tbody>
              {routes.map((route) => (
                <tr key={route.slug} className="border-b border-border/60">
                  <th scope="row" className="py-3 pr-4 font-normal">
                    <Link to="/vols/$slug" params={{ slug: route.slug }} className={linkClass}>
                      {route.originCity} — {route.destinationCity}
                    </Link>
                  </th>
                  <td className="py-3 pr-4 text-muted-foreground">{route.country}</td>
                  <td className="py-3 pr-4 font-semibold text-primary">
                    {formatPrice(route.priceEur)}
                  </td>
                  <td className="py-3 text-muted-foreground">
                    {formatDateMedium(route.observedOn)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <p className="mt-6 max-w-2xl text-xs text-muted-foreground">
        Un prix de vol bouge en permanence : celui affiché ici est celui du jour du relevé, pas une
        garantie pour aujourd'hui. Chaque lien mène à la fiche du trajet, où une recherche en direct
        donne les tarifs du moment.{" "}
        <Link to="/methodologie" className={linkClass}>
          Comment nous relevons et comparons les prix
        </Link>
      </p>
    </article>
  );
}
