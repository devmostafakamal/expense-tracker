// context/CurrencyContext.tsx
"use client";

import { fetchExchangeRates } from "@/utlis/currency";
import { createContext, useContext, useEffect, useState } from "react";

type CurrencyContextType = {
  currency: string;
  setCurrency: (c: string) => void;
  rates: Record<string, number>;
  convert: (amount: number, from?: string) => number;
  symbol: string;
  loading: boolean;
};

const CurrencyContext = createContext<CurrencyContextType>({
  currency: "BDT",
  setCurrency: () => {},
  rates: {},
  convert: (a) => a,
  symbol: "৳",
  loading: true,
});

const SYMBOLS: Record<string, string> = {
  BDT: "৳",
  USD: "$",
  EUR: "€",
  GBP: "£",
  INR: "₹",
};

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState("BDT");
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // localStorage থেকে saved currency load করো
    const saved = localStorage.getItem("preferred_currency");
    if (saved) setCurrencyState(saved);
  }, []);

  useEffect(() => {
    // BDT base rate দিয়ে fetch করো
    fetchExchangeRates("BDT")
      .then(setRates)
      .finally(() => setLoading(false));
  }, []);

  const setCurrency = (c: string) => {
    setCurrencyState(c);
    localStorage.setItem("preferred_currency", c);
  };

  const convert = (amount: number, from = "BDT") => {
    if (from === currency) return amount;
    if (!rates[currency]) return amount;
    // BDT থেকে target currency তে convert
    if (from === "BDT") return amount * (rates[currency] ?? 1);
    // অন্য currency থেকে আগে BDT তে আনো, তারপর target এ
    const inBDT = amount / (rates[from] ?? 1);
    return inBDT * (rates[currency] ?? 1);
  };

  return (
    <CurrencyContext.Provider
      value={{
        currency,
        setCurrency,
        rates,
        convert,
        symbol: SYMBOLS[currency] ?? currency,
        loading,
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
