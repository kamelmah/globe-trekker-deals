import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

/**
 * Habillage du site (en-tête, barre d'onglets, pied de page) rendu à la demande
 * d'une page nue.
 *
 * Les pages d'atterrissage n'ont qu'une action et masquent tout ce qui pourrait
 * en détourner — mais une fois cette action faite, il n'y a plus rien à
 * protéger : au contraire, c'est le moment d'ouvrir le site. L'état ne peut donc
 * plus se déduire du seul chemin, comme le faisait `PAGES_NUES` : il dépend de
 * ce qui s'est passé dans la page.
 *
 * Volontairement un simple booléen « la page redemande l'habillage », et non
 * « la page est nue » : le défaut reste calculé depuis le chemin, côté serveur,
 * donc le premier rendu d'une page nue l'est déjà sans habillage. Un état qui
 * porterait toute la décision partirait à `false` sur le serveur et ferait
 * clignoter l'en-tête entre le rendu HTML et l'hydratation.
 */
type HabillageContextValue = {
  /** Vrai quand une page nue redemande l'habillage complet. */
  revele: boolean;
  setRevele: (revele: boolean) => void;
};

const HabillageContext = createContext<HabillageContextValue | null>(null);

export function HabillageProvider({ children }: { children: ReactNode }) {
  const [revele, setRevele] = useState(false);
  const valeur = useMemo(() => ({ revele, setRevele }), [revele]);
  return <HabillageContext.Provider value={valeur}>{children}</HabillageContext.Provider>;
}

export function useHabillage(): HabillageContextValue {
  const contexte = useContext(HabillageContext);
  if (!contexte) throw new Error("useHabillage exige un HabillageProvider au-dessus.");
  return contexte;
}
