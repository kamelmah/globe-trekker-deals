import { Car, MapPinned, ShieldCheck, Wifi } from "lucide-react";
import type { ComponentType } from "react";

import { Button } from "@/components/ui/button";
import { EKTA_URL, GETRENTACAR_URL, KLOOK_URL, YESIM_URL } from "@/lib/affiliate-partners";

export type TravelPartnerId = "esim" | "assurance" | "voiture" | "activites";

type PartnerContent = {
  icon: ComponentType<{ className?: string }>;
  partnerName: string;
  title: string;
  description: string;
  href: string;
};

/**
 * Simples liens sortants (jamais d'iframe), ouverts en nouvel onglet : pas de
 * script ni de contenu tiers chargé sur nos pages, donc pas de gate cookies
 * nécessaire ici (contrairement à Stay22).
 */
const PARTNERS: Record<TravelPartnerId, PartnerContent> = {
  esim: {
    icon: Wifi,
    partnerName: "Yesim",
    title: "Rester connecté sur place",
    description:
      "Une eSIM internationale à activer avant de partir, pour éviter les frais d'itinérance à l'arrivée.",
    href: YESIM_URL,
  },
  assurance: {
    icon: ShieldCheck,
    partnerName: "EKTA",
    title: "Voyagez assuré",
    description:
      "Annulation, bagages perdus, frais médicaux à l'étranger : une couverture à comparer avant de partir.",
    href: EKTA_URL,
  },
  voiture: {
    icon: Car,
    partnerName: "GetRentacar.com",
    title: "Louer une voiture sur place",
    description: "Comparez les loueurs disponibles à destination pour la durée de votre séjour.",
    href: GETRENTACAR_URL,
  },
  activites: {
    icon: MapPinned,
    partnerName: "Klook",
    title: "Activités et visites à faire sur place",
    description: "Excursions, musées et activités à réserver à l'avance, souvent moins chers qu'en les achetant sur place.",
    href: KLOOK_URL,
  },
};

/** Rangée compacte de compléments de voyage (eSIM, assurance, location de voiture). */
export function TravelPartnersSection({
  partners,
  className,
}: {
  partners: TravelPartnerId[];
  className?: string;
}) {
  return (
    <section className={className}>
      <h2 className="font-display text-xl font-semibold">Pour compléter votre voyage</h2>
      <div
        className={`mt-4 grid gap-4 sm:grid-cols-2 ${partners.length >= 4 ? "lg:grid-cols-4" : partners.length === 3 ? "lg:grid-cols-3" : ""}`}
      >
        {partners.map((id) => {
          const partner = PARTNERS[id];
          const Icon = partner.icon;
          return (
            <div key={id} className="rounded-xl border border-border bg-card p-4">
              <Icon className="size-5 text-primary" aria-hidden />
              <h3 className="mt-3 text-sm font-semibold">{partner.title}</h3>
              <p className="mt-1.5 text-xs text-muted-foreground">{partner.description}</p>
              <Button asChild variant="outline" size="sm" className="mt-3 w-full">
                <a href={partner.href} target="_blank" rel="noopener noreferrer nofollow sponsored">
                  Voir les offres {partner.partnerName}
                </a>
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
}
