/**
 * Format a date string into a localized date string
 * @param dateString ISO date string
 * @param locale Locale string (defaults to 'en')
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  locale: string = "en"
): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
};

/**
 * Format currency value
 * @param amount Number to format
 * @param locale Locale string (defaults to 'en')
 * @param currency Currency code (defaults to 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  locale: string = "en",
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount);
};
