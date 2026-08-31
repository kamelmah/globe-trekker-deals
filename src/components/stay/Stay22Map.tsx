import { useEffect, useMemo, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/lib/cookie-consent-context";

/** Identifiant d'affiliation Stay22 (Let Me Allez). */
export const STAY22_LMA_ID = "6a94b04440e01477bf8d234c";

/** Délai maximum d'attente du chargement de l'iframe Stay22 (ms). */
const LOAD_TIMEOUT_MS = 7000;

type LoadStatus = "idle" | "loading" | "loaded" | "error";

/**
 * Carte d'hébergement Stay22, pré-configurée sur une ville (et des dates si connues).
 * Le chargement de l'iframe est différé jusqu'à ce que la section entre dans le viewport,
 * afin de ne pas ralentir l'affichage initial de la page. Si le widget ne charge pas
 * dans un délai raisonnable, un état de repli propose d'ouvrir la carte dans un nouvel onglet.
 */
export function Stay22Map({
  city,
  checkin,
  checkout,
  title,
  description,
  className,
  id = "hebergement",
}: {
  city: string;
  checkin?: string;
  checkout?: string;
  title: string;
  description?: string;
  className?: string;
  id?: string;
}) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  const [status, setStatus] = useState<LoadStatus>("idle");
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Cookie tiers optionnel (voir /cookies) : l'iframe Stay22 ne doit jamais se
  // charger avant un accord explicite pour cette catégorie.
  const { consent, savePreferences } = useCookieConsent();
  const mapsConsent = consent?.maps === true;

  useEffect(() => {
    const node = containerRef.current;
    if (!node || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  const src = useMemo(() => {
    const params = new URLSearchParams({
      aid: STAY22_LMA_ID,
      address: city,
      hidefooter: "true",
      // Le bouton de redirection Allez charge systématiquement la page partenaire
      // dans le cadre du widget, ce que des sites comme Booking.com refusent
      // (X-Frame-Options → ERR_BLOCKED_BY_RESPONSE). On le masque en plus du
      // sandbox de l'iframe (voir plus bas) qui couvre les autres clics.
      hideallezbutton: "true",
      currency: "EUR",
      supportedlang: "fr",
      unitsystem: "metric",
    });
    if (checkin) params.set("checkin", checkin);
    if (checkout) params.set("checkout", checkout);
    return `https://www.stay22.com/embed/gm?${params.toString()}`;
  }, [city, checkin, checkout]);

  // Démarre un timeout de 7 s dès que la section devient visible ou que la ville/dates changent
  // (seulement une fois le consentement "Cartes Stay22" accordé).
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (!visible || !mapsConsent) {
      setStatus("idle");
      return;
    }
    setStatus("loading");
    timeoutRef.current = setTimeout(() => {
      setStatus("error");
    }, LOAD_TIMEOUT_MS);
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [visible, src, mapsConsent]);

  const handleLoad = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("loaded");
  };

  const handleError = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setStatus("error");
  };

  return (
    <section ref={containerRef} id={id} className={`scroll-mt-24 ${className ?? ""}`}>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-4 overflow-hidden rounded-xl border border-border bg-card">
        {!mapsConsent ? (
          <div className="flex h-[420px] w-full flex-col items-center justify-center gap-4 p-6 text-center sm:h-[520px]">
            <p className="max-w-sm text-sm text-muted-foreground">
              Cette carte est fournie par notre partenaire Stay22 et dépose des cookies tiers.
              Elle ne s'affiche qu'avec votre accord.
            </p>
            <Button onClick={() => savePreferences({ maps: true })} size="sm">
              Autoriser les cartes Stay22
            </Button>
          </div>
        ) : visible ? (
          <div className="relative h-[420px] w-full sm:h-[520px]">
            {status !== "error" && (
              <iframe
                src={src}
                title={title}
                loading="lazy"
                // Autorise les popups (un clic sur un hôtel doit ouvrir un nouvel
                // onglet) mais interdit explicitement la navigation du cadre lui-même
                // vers un site externe. Sans ça, certaines fiches hôtel (ex.
                // Booking.com) chargent leur page dans le cadre du widget, qui la
                // refuse par sécurité (X-Frame-Options → ERR_BLOCKED_BY_RESPONSE) :
                // l'utilisateur voit une page d'erreur au lieu de l'offre.
                sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
                referrerPolicy="no-referrer-when-downgrade"
                onLoad={handleLoad}
                onError={handleError}
                className={`absolute inset-0 h-full w-full border-0 transition-opacity duration-300 ${status === "loaded" ? "opacity-100" : "opacity-0"}`}
              />
            )}
            {status === "loading" && (
              <div
                className="absolute inset-0 animate-pulse bg-secondary"
                role="status"
                aria-label="Chargement de la carte des hébergements"
              />
            )}
            {status === "error" && (
              <div className="flex h-full flex-col items-center justify-center gap-4 p-6 text-center">
                <p className="text-sm text-muted-foreground">La carte met du temps à charger</p>
                <Button asChild variant="outline">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Voir les hébergements à ${city} dans un nouvel onglet`}
                  >
                    Voir les hébergements à {city}
                  </a>
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div
            className="h-[420px] w-full animate-pulse bg-secondary sm:h-[520px]"
            role="status"
            aria-label="Chargement de la carte des hébergements"
          />
        )}
      </div>
    </section>
  );
}


