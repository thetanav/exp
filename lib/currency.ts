export type CurrencyCode = "USD" | "INR" | "EUR" | "JPY" | "CNY";

export const CURRENCY_OPTIONS: Array<{
  code: CurrencyCode;
  label: string;
  symbol: string;
}> = [
  { code: "USD", label: "Dollar (USD)", symbol: "$" },
  { code: "INR", label: "Rupee (INR)", symbol: "₹" },
  { code: "EUR", label: "Euro (EUR)", symbol: "€" },
  { code: "JPY", label: "Yen (JPY)", symbol: "¥" },
  { code: "CNY", label: "Yuan (CNY)", symbol: "¥" },
];

export function formatCurrency(amount: number, currency: CurrencyCode): string {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    const fallbackSymbol =
      CURRENCY_OPTIONS.find((option) => option.code === currency)?.symbol ?? "$";
    return `${fallbackSymbol}${amount.toFixed(2)}`;
  }
}
