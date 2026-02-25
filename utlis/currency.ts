// utils/currency.ts

export const CURRENCIES = [
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
];

export function getCurrencySymbol(code: string) {
  return CURRENCIES.find((c) => c.code === code)?.symbol ?? code;
}

export async function fetchExchangeRates(baseCurrency = "BDT") {
  const apiKey = process.env.NEXT_PUBLIC_EXCHANGE_API_KEY;
  const res = await fetch(
    `https://v6.exchangerate-api.com/v6/${apiKey}/latest/${baseCurrency}`,
  );
  const data = await res.json();
  return data.conversion_rates as Record<string, number>;
}

export function convertAmount(
  amount: number,
  fromCurrency: string,
  toCurrency: string,
  rates: Record<string, number>,
): number {
  if (fromCurrency === toCurrency) return amount;
  const toRate = rates[toCurrency];
  if (!toRate) return amount;
  return amount * toRate;
}
