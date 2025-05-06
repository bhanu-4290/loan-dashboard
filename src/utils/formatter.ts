export const formatCurrency = (
  amount: number, 
  currencyCode: string = 'USD', 
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currencyCode,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);
};

export const formatNumber = (
  number: number,
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits,
    maximumFractionDigits
  }).format(number);
};

export const formatPercent = (
  number: number,
  minimumFractionDigits: number = 2,
  maximumFractionDigits: number = 2
): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'percent',
    minimumFractionDigits,
    maximumFractionDigits
  }).format(number / 100);
};