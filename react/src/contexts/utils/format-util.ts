export const formatDecimal = (
  value: number | undefined,
  decimalPlaces = 2,
  suffix?: string
): string => {
  if (value === undefined || value === null) return '-'

  const formattedValue = Intl.NumberFormat('en-US', {
    minimumFractionDigits: decimalPlaces,
    maximumFractionDigits: decimalPlaces
  }).format(value)

  if (suffix) {
    suffix = suffix.replace('ft2', 'ft²')
  }

  return suffix ? `${formattedValue} ${suffix}` : formattedValue
}

export const formatCurrency = (value: number | undefined): string => {
  if (value === undefined || value === null) return '-'

  return Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Math.round(value))
}

export const formatYears = (value: number | undefined): string => {
  if (value === undefined || value === null || value < 0) return '-'

  return `${String(value.toFixed(1))} ${value !== 1 ? 'years' : 'year'}`
}

export const formatRoundNumber = (value: number | undefined): number => {
  if (value === undefined || value === null) return 0

  return Math.round(value)
}
