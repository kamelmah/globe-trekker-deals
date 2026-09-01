/**
 * Liens d'affiliation des compléments de voyage, générés depuis le même
 * compte Travelpayouts que les vols (identifiants/marker déjà en place).
 */
export const YESIM_URL = "https://yesim.tpm.lv/PEdLZQY9";
export const EKTA_URL = "https://ektatraveling.tpm.lv/5Y1DIOZU";
export const AIRHELP_URL = "https://airhelp.tpm.lv/djwdHJDm";
export const GETRENTACAR_URL = "https://getrentacar.tpm.lv/LnU88AJ2";
/**
 * Lien générique (pas de paramètre de recherche pré-rempli) : c'est un lien
 * de tracking d'affiliation (tpm.lv), pas l'URL de recherche Kiwi.com elle-même —
 * rien ne garantit qu'ajouter origine/destination/dates en paramètres serait
 * transmis jusqu'au moteur de recherche Kiwi une fois la redirection passée.
 * À vérifier avec Travelpayouts avant de tenter un pré-remplissage.
 */
export const KIWI_FALLBACK_URL = "https://kiwi.tpm.lv/efaL5TCr";
/** Même remarque que ci-dessus : lien générique, pas ciblé sur une ville précise. */
export const KLOOK_URL = "https://klook.tpm.lv/BADTXluA";
