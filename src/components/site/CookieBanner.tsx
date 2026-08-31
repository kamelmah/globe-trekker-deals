import { Link } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCookieConsent } from "@/lib/cookie-consent-context";

/**
 * Bandeau + gestionnaire de consentement cookies (RGPD/ePrivacy, recommandations
 * CNIL) : "Refuser" a la même taille et le même niveau de visibilité que
 * "Accepter", et rien de non essentiel n'est chargé tant qu'aucun choix n'a
 * été fait (voir useMapsConsent, consommé par Stay22Map et __root.tsx).
 */
export function CookieBanner() {
  const { managerOpen, consent, acceptAll, rejectAll, savePreferences, closeManager } =
    useCookieConsent();
  const [expanded, setExpanded] = useState(false);
  const [mapsDraft, setMapsDraft] = useState(consent?.maps ?? false);

  if (!managerOpen) return null;

  return (
    <div
      role="region"
      aria-label="Gestion du consentement aux cookies"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/98 shadow-[0_-4px_24px_rgba(0,0,0,0.12)] backdrop-blur"
    >
      <div className="container-page max-w-3xl py-4 sm:py-5">
        {!expanded ? (
          <>
            <p className="text-sm text-muted-foreground">
              TrouveMonVol utilise des cookies strictement nécessaires au fonctionnement du site
              (toujours actifs), et des cookies tiers optionnels pour afficher les cartes
              d'hébergement Stay22. Ces derniers ne sont chargés qu'avec votre accord.{" "}
              <Link to="/cookies" className="underline underline-offset-2 hover:text-foreground">
                En savoir plus
              </Link>
              .
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <Button onClick={acceptAll} size="sm" className="min-w-32">
                Accepter
              </Button>
              <Button onClick={rejectAll} variant="outline" size="sm" className="min-w-32">
                Refuser
              </Button>
              <Button onClick={() => setExpanded(true)} variant="ghost" size="sm">
                Personnaliser
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold">Personnaliser les cookies</p>
            <div className="mt-3 space-y-3">
              <div className="flex items-start justify-between gap-4 rounded-lg border border-border p-3">
                <div>
                  <p className="text-sm font-medium">Nécessaires</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    Devise et thème choisis, mémorisation de vos préférences de cookies. Ne peuvent
                    pas être désactivés.
                  </p>
                </div>
                <span
                  aria-hidden
                  className="mt-0.5 inline-flex h-6 w-11 shrink-0 items-center rounded-full bg-primary/40 px-0.5"
                >
                  <span className="size-5 translate-x-5 rounded-full bg-primary" />
                </span>
              </div>

              <label className="flex cursor-pointer items-start justify-between gap-4 rounded-lg border border-border p-3">
                <span>
                  <span className="block text-sm font-medium">Cartes d'hébergement (Stay22)</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    Cartes interactives des hôtels sur la page Hébergement et les guides
                    destination, fournies par notre partenaire Stay22.
                  </span>
                </span>
                <span className="mt-0.5 inline-flex shrink-0 items-center">
                  <input
                    type="checkbox"
                    checked={mapsDraft}
                    onChange={(e) => setMapsDraft(e.target.checked)}
                    className="sr-only"
                  />
                  <span
                    aria-hidden
                    className={`inline-flex h-6 w-11 items-center rounded-full px-0.5 transition-colors ${mapsDraft ? "bg-primary/40" : "bg-secondary"}`}
                  >
                    <span
                      className={`size-5 rounded-full bg-primary transition-transform ${mapsDraft ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </span>
                </span>
              </label>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button onClick={() => savePreferences({ maps: mapsDraft })} size="sm" className="min-w-32">
                Enregistrer mes choix
              </Button>
              <Button onClick={acceptAll} variant="outline" size="sm">
                Tout accepter
              </Button>
              <Button onClick={rejectAll} variant="outline" size="sm">
                Tout refuser
              </Button>
              {consent && (
                <Button onClick={closeManager} variant="ghost" size="sm">
                  Annuler
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
