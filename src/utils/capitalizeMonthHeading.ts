/** Garante o mês com inicial maiúscula (ex.: "abril de 2026" → "Abril de 2026"). */
export function capitalizeMonthHeading(label: string, locale: string): string {
  if (!label) return label
  const head = label.charAt(0).toLocaleUpperCase(locale)
  return head + label.slice(1)
}
