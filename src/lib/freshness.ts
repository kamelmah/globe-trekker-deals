/**
 * Âge d'un relevé de prix, en clair.
 *
 * Extrait de `FlightCard`, où ce calcul vivait seul, pour que les pages de
 * liaison disent l'âge de leur prix de référence dans les mêmes termes. Deux
 * formulations pour la même chose sur deux écrans du même site n'apprennent
 * rien de plus au lecteur et divergent au premier changement.
 *
 * Fonction pure prenant l'instant en paramètre : elle est ainsi calculable côté
 * serveur — pour un rendu SSR juste — comme côté client, sans écart d'hydratation.
 */

import { formatDateTimeShort } from "@/lib/dates";

/**
 * Au-delà de 24 h, un montant n'est plus présenté comme un prix mais comme une
 * estimation : un tarif de plusieurs jours peut avoir dérivé de 30 % chez le
 * vendeur, l'annoncer comme ferme serait trompeur.
 */
export const ESTIMATE_THRESHOLD_MS = 24 * 60 * 60 * 1000;

/** En deçà, le relevé est assez récent pour être signalé en vert. */
export const FRESH_THRESHOLD_MS = 60 * 60 * 1000;

/**
 * Au-delà, le prix de référence d'une page de liaison n'est plus affiché.
 *
 * Deux jours sans relevé sur une liaison, ce n'est pas un prix un peu ancien :
 * c'est une donnée dont nous ne savons plus rien. Une page vaut mieux sans
 * repère qu'avec un repère faux, et l'historique daté plus bas reste, lui,
 * exact quelle que soit son ancienneté.
 */
export const REFERENCE_PRICE_MAX_AGE_MS = 48 * 60 * 60 * 1000;

export type FreshnessTone = "frais" | "neutre" | "ancien";
export type Freshness = { label: string; tone: FreshnessTone; estimate: boolean; ageMs: number };

/**
 * Fraîcheur d'un relevé. `now` est explicite pour rester déterministe : c'est
 * ce qui permet de calculer la même valeur au rendu serveur et au rendu client.
 */
/**
 * Au-delà de combien d'heures le libellé repasse à une date absolue.
 *
 * 24 h par défaut : « relevé il y a 73 h » ne se lit plus, une date est plus
 * claire. Les pages de liaison passent 48 h, la durée exacte pendant laquelle
 * elles gardent leur prix de référence affiché — sans quoi la fenêtre 24-48 h
 * afficherait un bloc encore visible daté d'un horodatage, ce que ce changement
 * vise justement à supprimer.
 */
export function computeFreshness(
  iso: string | null | undefined,
  now: number = Date.now(),
  relativeUpToHours = 24,
): Freshness {
  const d = iso ? new Date(iso) : null;
  if (!d || Number.isNaN(d.getTime())) {
    // Âge inconnu : on ne peut pas affirmer que le prix est ferme.
    return {
      label: "date de relevé inconnue",
      tone: "ancien",
      estimate: true,
      ageMs: Number.POSITIVE_INFINITY,
    };
  }
  const ageMs = now - d.getTime();
  const minutes = Math.max(0, Math.round(ageMs / 60000));
  let label: string;
  if (minutes < 1) label = "relevé à l'instant";
  else if (minutes < 60) label = `relevé il y a ${minutes} min`;
  else {
    const hours = Math.round(minutes / 60);
    label =
      hours < relativeUpToHours
        ? `relevé il y a ${hours} h`
        : `relevé le ${formatDateTimeShort(d.toISOString())}`;
  }
  const tone: FreshnessTone =
    ageMs < FRESH_THRESHOLD_MS ? "frais" : ageMs <= ESTIMATE_THRESHOLD_MS ? "neutre" : "ancien";
  return { label, tone, estimate: ageMs > ESTIMATE_THRESHOLD_MS, ageMs };
}

/**
 * Le prix de référence d'une liaison est-il encore affichable ?
 *
 * Une date INCONNUE n'est pas un relevé périmé : c'est un relevé dont nous
 * n'avons pas gardé la date (le cache du balayage mondial ne la conserve pas).
 * Le masquer priverait la plupart des pages de leur repère sur une ignorance,
 * pas sur un fait. Le bloc reste, sans mention d'âge — comme aujourd'hui.
 */
export function referencePriceIsFresh(
  iso: string | null | undefined,
  now: number = Date.now(),
): boolean {
  if (!iso) return true;
  const time = Date.parse(iso);
  if (Number.isNaN(time)) return true;
  return now - time <= REFERENCE_PRICE_MAX_AGE_MS;
}
