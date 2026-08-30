import { distanceKm } from "@/data/airports";

/**
 * Estimation simplifiée des émissions de CO2 par passager, en kg.
 * Méthode : distance à vol d'oiseau × facteur d'émission par km, majoré pour
 * les vols courts (phases de décollage plus coûteuses) et pour chaque escale
 * (kilomètres supplémentaires + un décollage de plus).
 */
export function estimateCo2Kg(origin: string, destination: string, stops = 0): number {
  const km = distanceKm(origin, destination);
  const factor = km < 1500 ? 0.158 : km < 4000 ? 0.13 : 0.114;
  const detour = 1 + stops * 0.12;
  const takeoffPenalty = stops * 12;
  return Math.round(km * factor * detour + takeoffPenalty);
}

export function co2Label(kg: number): string {
  return `${new Intl.NumberFormat("fr-FR").format(kg)} kg CO₂e`;
}
