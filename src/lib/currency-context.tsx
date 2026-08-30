import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import { formatAmount, formatPrice, isCurrencyCode, type CurrencyCode } from "@/lib/currency";

type CurrencyContextValue = {
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  /** Formate un montant en euros en le convertissant (données stockées en EUR). */
  format: (amountEur: number) => string;
  /** Formate un montant déjà renvoyé par l'API dans la devise choisie. */
  formatApi: (amount: number) => string;
};

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

const STORAGE_KEY = "tmv-currency";

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<CurrencyCode>("EUR");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && isCurrencyCode(stored)) setCurrencyState(stored);
  }, []);

  const setCurrency = useCallback((code: CurrencyCode) => {
    setCurrencyState(code);
    window.localStorage.setItem(STORAGE_KEY, code);
  }, []);

  const format = useCallback((amountEur: number) => formatPrice(amountEur, currency), [currency]);
  const formatApi = useCallback((amount: number) => formatAmount(amount, currency), [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency, format, formatApi }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    return {
      currency: "EUR",
      setCurrency: () => {},
      format: (amount) => formatPrice(amount, "EUR"),
      formatApi: (amount) => formatAmount(amount, "EUR"),
    };
  }
  return ctx;
}
