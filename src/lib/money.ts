export function formatMoney(cents: number, currency: string) {
  const value = (cents ?? 0) / 100;
  return new Intl.NumberFormat("ru-RU", { style: "currency", currency }).format(value);
}
