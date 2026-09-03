/**
 * Prix indicatif d'une nuit d'hôtel, par ville de destination.
 *
 * Alimente le libellé du bouton hôtel : « Alger : 3 nuits à partir de 180 € »
 * plutôt que « Voir les hôtels à Alger ». Un montant vaut mieux qu'une
 * invitation, à condition d'être vrai.
 *
 * CE FICHIER EST VIDE, ET C'EST VOULU.
 *
 * Aucune source de prix hôtelier n'existe dans le site : Stay22 et Hotels.com
 * sont des widgets rendus dans le navigateur du visiteur, ils ne nous renvoient
 * rien côté serveur, et notre source tarifaire ne couvre que l'aérien. Écrire
 * ici des montants « plausibles » produirait exactement ce que le reste du site
 * refuse — un prix affiché que personne n'a relevé.
 *
 * Chaque entrée porte donc sa DATE de relevé, affichée sous le bouton. Une
 * ligne sans date n'a rien à faire ici : le jour où ces montants arrivent, ils
 * arriveront datés ou pas du tout.
 *
 * Tant que la table est vide, le bouton garde son libellé « Voir les hôtels
 * à … ». Le repli n'est pas une dégradation, c'est le comportement actuel.
 */

export type PrixNuit = {
  /** Prix minimum d'une nuit, dans la devise indiquée. */
  prixNuitMin: number;
  /** Code ISO 4217, ex. « EUR ». Explicite : toutes les villes ne sont pas en euros. */
  devise: string;
  /** Jour du relevé, AAAA-MM-JJ. Sans lui, le montant n'est pas affichable. */
  releveLe: string;
};

/** Clé : code IATA de la ville, comme partout ailleurs dans le site. */
export const HOTEL_NIGHT_PRICES: Record<string, PrixNuit> = {};

/** Nombre de nuits sur lequel le libellé annonce un total. */
export const NUITS_ANNONCEES = 3;

export function prixNuit(code: string | null | undefined): PrixNuit | null {
  if (!code) return null;
  return HOTEL_NIGHT_PRICES[code.toUpperCase()] ?? null;
}

/**
 * Total pour `NUITS_ANNONCEES` nuits, arrondi.
 *
 * Le multiplicateur est appliqué ici et pas au rendu : c'est le genre de calcul
 * qui finit dupliqué dans trois composants avec trois arrondis différents.
 */
export function totalNuits(prix: PrixNuit, nuits: number = NUITS_ANNONCEES): number {
  return Math.round(prix.prixNuitMin * nuits);
}
