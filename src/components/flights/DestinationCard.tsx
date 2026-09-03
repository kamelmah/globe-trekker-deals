import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

import { ResponsivePicture } from "@/components/site/ResponsivePicture";
import { badgeVariants } from "@/components/ui/badge";
import { useCurrency } from "@/lib/currency-context";
import { formatDateMedium } from "@/lib/dates";
import { cn } from "@/lib/utils";

export type DestinationCardProps = {
  /** Slug de la liaison : la carte entière pointe vers /vols/<slug>. */
  slug: string;
  ville: string;
  /** Photo de la destination, avec son repli WebP et son alt (voir getDestinationImage). */
  photoUrl: string;
  photoWebpUrl: string;
  photoAlt: string;
  prixDepuis: number;
  /** Compagnie du relevé, absente quand la source ne la porte pas. */
  compagnie?: string | null;
  direct: boolean;
  /**
   * Date nue (AAAA-MM-JJ) du relevé, absente quand la fraîcheur est inconnue.
   * Jamais remplacée par la date du jour : un prix sans date reste sans date.
   */
  dateReleve?: string | null;
  /** Rang dans la grille : décale l'apparition, plafonné pour ne pas traîner. */
  index?: number;
  className?: string;
};

/**
 * Carte destination de l'accueil : photo, ville, plancher relevé, puis le
 * contexte du relevé (compagnie, date). Ce n'est pas une offre réservable —
 * le lien mène à la page de liaison, pas à un tunnel d'achat, et le montant
 * est un prix observé daté, pas un tarif garanti. D'où « Voir les prix »
 * plutôt qu'un bouton de réservation, et la date affichée en clair.
 *
 * L'apparition réutilise `.card-in` (styles.css) comme les résultats de
 * recherche : même fondu, et le bloc `prefers-reduced-motion` existant la
 * coupe déjà. Une librairie d'animation JS ferait le même effet en pesant
 * plus lourd que la page.
 */
export function DestinationCard({
  slug,
  ville,
  photoUrl,
  photoWebpUrl,
  photoAlt,
  prixDepuis,
  compagnie,
  direct,
  dateReleve,
  index = 0,
  className,
}: DestinationCardProps) {
  const { format } = useCurrency();

  return (
    /*
     * L'apparition est portée par ce conteneur, pas par le lien : une
     * animation en `both` fige son `transform` final et écraserait le léger
     * soulèvement au survol appliqué sur le lien.
     */
    <div
      className={cn("card-in h-full", className)}
      style={{ animationDelay: `${Math.min(index, 6) * 60}ms` }}
    >
      <Link
        to="/vols/$slug"
        params={{ slug }}
        className={cn(
          "group flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card",
          "transition-[border-color,box-shadow,transform] duration-200",
          "hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        )}
      >
        <span className="relative block">
          <ResponsivePicture
            src={photoUrl}
            webp={photoWebpUrl}
            alt={photoAlt}
            loading="lazy"
            width={256}
            height={192}
            className="h-24 w-full object-cover sm:h-32"
          />
          {/*
            Les classes de <Badge> sur un <span> et non le composant lui-même :
            il rend un <div>, invalide à l'intérieur d'un <span>, et toute la
            carte est un lien fait de contenu phrasé.

            Fond opaque pris dans le thème plutôt qu'un simple voile : posé sur
            une photo, donc sur une couleur inconnue, un badge translucide
            disparaît sur les vues claires (plage, neige).
          */}
          <span
            className={cn(
              badgeVariants({ variant: "secondary" }),
              "absolute left-2 top-2 border-border/60 bg-card/90 text-[0.7rem] font-semibold text-foreground backdrop-blur-sm",
            )}
          >
            {direct ? "Direct" : "Avec escale"}
          </span>
        </span>

        <span className="flex flex-1 flex-col p-3 sm:p-4">
          <span className="flex items-start justify-between gap-2">
            <span className="min-w-0">
              <span className="block truncate text-sm font-semibold">{ville}</span>
              {compagnie && (
                <span className="mt-0.5 block truncate text-xs text-muted-foreground">
                  {compagnie}
                </span>
              )}
            </span>
            <span className="shrink-0 text-right">
              <span className="block text-[0.7rem] leading-none text-muted-foreground">dès</span>
              <span className="mt-0.5 block font-display text-lg font-semibold text-primary">
                {format(prixDepuis)}
              </span>
            </span>
          </span>

          {dateReleve && (
            <span className="mt-2 block text-xs leading-relaxed text-muted-foreground">
              relevé le {formatDateMedium(dateReleve)}
            </span>
          )}

          <span className="mt-auto flex items-center justify-between gap-2 border-t border-border pt-3 text-xs font-medium text-primary">
            Voir les prix
            <ArrowRight
              className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              aria-hidden
            />
          </span>
        </span>
      </Link>
    </div>
  );
}
