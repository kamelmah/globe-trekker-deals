/**
 * Annotations de langue (`hreflang`).
 *
 * Le site sert une seule version de chaque page, en français, identique en
 * France, en Belgique, en Suisse et au Québec : même contenu, mêmes vendeurs,
 * mêmes aéroports de départ. Or une annotation régionale — fr-FR, fr-BE, fr-CH,
 * fr-CA — n'a de sens que si chacune pointe vers une URL distincte qui lui
 * répond en retour. Déclarées toutes les quatre sur une seule et même URL,
 * elles n'apprennent rien à Google, qui ignore le groupe entier.
 *
 * `fr` sans région dit exactement ce qui est vrai : cette page s'adresse à tous
 * les francophones, pas seulement à la France. C'est précisément ce qui lève
 * l'ambiguïté pour la Belgique, la Suisse et le Québec, et c'est la seule
 * annotation qui produise un effet tant qu'il n'existe qu'une version.
 *
 * Pour que des annotations régionales deviennent utiles, il faudrait de vraies
 * versions par pays — départs de Bruxelles, Genève, Montréal, devise et
 * mentions légales locales. Ces départs n'existent pas dans la liste blanche,
 * et rien ne doit être généré hors de cette liste. Le jour où ces versions
 * existent, ajouter ici une entrée par URL réelle suffit.
 */
export function hreflangLinks(pageUrl: string) {
  return [
    { rel: "alternate", hreflang: "fr", href: pageUrl },
    { rel: "alternate", hreflang: "x-default", href: pageUrl },
  ];
}
