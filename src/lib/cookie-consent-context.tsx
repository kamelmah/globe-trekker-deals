import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

/**
 * Catégories réellement utilisées sur le site (voir /cookies) : pas de
 * catégorie "mesure d'audience" ou "marketing" tant qu'aucun outil de ce
 * type n'est réellement intégré, pour ne jamais afficher un choix fictif.
 */
export type ConsentCategories = {
  /** Cartes Stay22 (page Hébergement, guides destination) + script d'affiliation associé. */
  maps: boolean;
};

type StoredConsent = ConsentCategories & { decidedAt: string };

const STORAGE_KEY = "tmv-cookie-consent";
/** Recommandation CNIL : 13 mois maximum avant de redemander le consentement. */
const MAX_CONSENT_AGE_MS = 396 * 24 * 60 * 60 * 1000;

function readStoredConsent(): StoredConsent | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredConsent>;
    if (typeof parsed.decidedAt !== "string" || typeof parsed.maps !== "boolean") return null;
    const age = Date.now() - Date.parse(parsed.decidedAt);
    if (!Number.isFinite(age) || age > MAX_CONSENT_AGE_MS) return null;
    return { maps: parsed.maps, decidedAt: parsed.decidedAt };
  } catch {
    return null;
  }
}

type CookieConsentContextValue = {
  /** null tant qu'aucun choix valide n'est enregistré (bandeau à afficher). */
  consent: ConsentCategories | null;
  /** Bandeau ou gestionnaire à afficher (premier chargement, choix expiré, ou rouvert manuellement). */
  managerOpen: boolean;
  acceptAll: () => void;
  rejectAll: () => void;
  savePreferences: (categories: ConsentCategories) => void;
  openManager: () => void;
  closeManager: () => void;
};

const CookieConsentContext = createContext<CookieConsentContextValue | null>(null);

export function CookieConsentProvider({ children }: { children: ReactNode }) {
  // null le temps de l'hydratation : on ne sait pas encore si un choix existe.
  const [consent, setConsent] = useState<ConsentCategories | null>(null);
  const [checked, setChecked] = useState(false);
  const [managerOpen, setManagerOpen] = useState(false);

  useEffect(() => {
    const stored = readStoredConsent();
    if (stored) setConsent({ maps: stored.maps });
    else setManagerOpen(true);
    setChecked(true);
  }, []);

  const persist = useCallback((categories: ConsentCategories) => {
    setConsent(categories);
    setManagerOpen(false);
    try {
      const payload: StoredConsent = { ...categories, decidedAt: new Date().toISOString() };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* stockage indisponible (navigation privée...) : le choix ne sera pas mémorisé */
    }
  }, []);

  const acceptAll = useCallback(() => persist({ maps: true }), [persist]);
  const rejectAll = useCallback(() => persist({ maps: false }), [persist]);
  const savePreferences = useCallback((categories: ConsentCategories) => persist(categories), [persist]);
  const openManager = useCallback(() => setManagerOpen(true), []);
  const closeManager = useCallback(() => setManagerOpen(false), []);

  return (
    <CookieConsentContext.Provider
      value={{
        consent,
        // Tant que l'hydratation n'a pas vérifié le stockage, ne pas afficher
        // le bandeau (évite un flash) : on attend `checked`.
        managerOpen: checked && managerOpen,
        acceptAll,
        rejectAll,
        savePreferences,
        openManager,
        closeManager,
      }}
    >
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent(): CookieConsentContextValue {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error("useCookieConsent doit être utilisé sous CookieConsentProvider");
  }
  return ctx;
}

/** Cartes Stay22 : true seulement si le visiteur a explicitement accepté cette catégorie. */
export function useMapsConsent(): boolean {
  const { consent } = useCookieConsent();
  return consent?.maps === true;
}
