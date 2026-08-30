export type CurrencyCode = "EUR" | "USD" | "GBP" | "CHF" | "CAD";

export const CURRENCIES: { code: CurrencyCode; label: string; symbol: string }[] = [
  { code: "EUR", label: "Euro", symbol: "€" },
  { code: "USD", label: "Dollar US", symbol: "$" },
  { code: "GBP", label: "Livre sterling", symbol: "£" },
  { code: "CHF", label: "Franc suisse", symbol: "CHF" },
  { code: "CAD", label: "Dollar canadien", symbol: "C$" },
];

/** Taux indicatifs par rapport à l'euro, utilisés pour l'affichage uniquement. */
export const RATES_FROM_EUR: Record<CurrencyCode, number> = {
  EUR: 1,
  USD: 1.09,
  GBP: 0.85,
  CHF: 0.95,
  CAD: 1.47,
};

export function convertFromEur(amountEur: number, currency: CurrencyCode): number {
  return amountEur * RATES_FROM_EUR[currency];
}

export function formatPrice(amountEur: number, currency: CurrencyCode = "EUR"): string {
  const value = convertFromEur(amountEur, currency);
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCIES.some((c) => c.code === value);
}
