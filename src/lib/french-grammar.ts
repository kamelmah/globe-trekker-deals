/** Contraction correcte de "à"/"de" devant un nom de ville avec article (Le Caire, Les Sables…). */
export function withPreposition(preposition: "à" | "de", city: string): string {
  if (city.startsWith("Le ")) return `${preposition === "à" ? "au" : "du"} ${city.slice(3)}`;
  if (city.startsWith("Les ")) return `${preposition === "à" ? "aux" : "des"} ${city.slice(4)}`;
  return `${preposition} ${city}`;
}
