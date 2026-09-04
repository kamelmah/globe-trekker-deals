import { BedDouble } from "lucide-react";

import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/analytics";
import { lienHotelsVille } from "@/lib/hotels";
import { cn } from "@/lib/utils";

/**
 * Lien partenaire vers la recherche d'hôtels d'une ville sur Hotels.com.
 *
 * Point d'entrée UNIQUE : les attributs qui comptent — `rel="sponsored
 * nofollow"` exigé par Google sur un lien rémunéré, l'ouverture en nouvel
 * onglet avec `noopener`, et la mention de transparence — sont décidés ici une
 * fois, et pas recopiés sur chacune des pages qui posent ce lien.
 *
 * Ce que devient le clic — réservation ou non, commission ou non — reste connu
 * de CJ seul, via le `sid` transmis : nous ne le journalisons pas, et rien ici
 * ne cherche à le reconstituer. Le seul compteur posé de notre côté est un
 * `clic_hotel` anonyme et agrégé, qui répond à une question que le rapport CJ
 * ne pose pas : depuis QUELLES pages du site part-on chercher un hôtel. Il ne
 * porte que la ville et l'emplacement du lien, jamais d'identifiant de visite.
 */
export function LienHotelsCom({
  ville,
  sid,
  arrivee,
  depart,
  voyageurs,
  libelle,
  variant = "default",
  size = "default",
  mention = false,
  precision,
  className,
}: {
  /** Nom de ville tel qu'il sera cherché chez le partenaire (jamais un code IATA). */
  ville: string;
  /** Identifiant d'origine du clic dans les rapports CJ, ex. "vols-marseille-alger". */
  sid: string;
  /** Dates du séjour : transmises seulement si les deux sont connues (voir hotels.ts). */
  arrivee?: string | undefined;
  depart?: string | undefined;
  voyageurs?: number | undefined;
  libelle?: string;
  variant?: "default" | "outline" | "secondary" | "link";
  size?: "default" | "sm" | "lg";
  /** Affiche la mention de transparence sous le bouton. */
  mention?: boolean;
  /**
   * Précision affichée sous le bouton, avant la mention partenaire.
   *
   * Sert à dater un montant annoncé dans le libellé : un prix sans date de
   * relevé n'est pas vérifiable, et le site ne s'autorise nulle part ailleurs à
   * en afficher un.
   */
  precision?: string;
  className?: string;
}) {
  const href = lienHotelsVille(ville, {
    sid,
    ...(arrivee ? { arrivee } : {}),
    ...(depart ? { depart } : {}),
    ...(voyageurs ? { voyageurs } : {}),
  });

  return (
    <div className={cn("min-w-0", className)}>
      <Button asChild variant={variant} size={size} className="w-full">
        <a
          href={href}
          target="_blank"
          rel="sponsored nofollow noopener"
          className="gap-2 whitespace-normal text-center"
          onClick={() => trackEvent("clic_hotel", { ville, depuis: sid })}
        >
          <BedDouble className="size-4 shrink-0" aria-hidden />
          {libelle ?? `Voir les hôtels sur Hotels.com`}
        </a>
      </Button>
      {precision && <p className="mt-2 text-xs text-muted-foreground">{precision}</p>}
      {mention && (
        <p className="mt-2 text-xs text-muted-foreground">
          Lien partenaire : la commission ne change pas votre prix.
        </p>
      )}
    </div>
  );
}
