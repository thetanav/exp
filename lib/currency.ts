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

export function cstr(currency: CurrencyCode): string {
  return CURRENCY_OPTIONS.find(cur => cur.code == currency)?.symbol || ""
}
