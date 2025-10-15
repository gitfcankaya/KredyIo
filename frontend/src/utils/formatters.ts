/**
 * Utility functions for formatting numbers, currency, and percentages
 * Used throughout the KredyIo application
 */

/**
 * Format number as Turkish Lira currency
 * @param amount - Amount to format
 * @param options - Intl.NumberFormatOptions
 * @returns Formatted currency string (e.g., "₺10.000,00")
 */
export const formatCurrency = (
  amount: number,
  options?: Intl.NumberFormatOptions
): string => {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
    ...options,
  }).format(amount);
};

/**
 * Format number as percentage
 * @param value - Value to format (0.15 = 15%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "%15,00")
 */
export const formatPercentage = (
  value: number,
  decimals: number = 2
): string => {
  return `%${value.toFixed(decimals).replace('.', ',')}`;
};

/**
 * Format large numbers with K, M, B suffixes
 * @param num - Number to format
 * @returns Formatted string (e.g., "1.5K", "2.3M")
 */
export const formatCompactNumber = (num: number): string => {
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(1)}B`;
  }
  if (num >= 1_000_000) {
    return `${(num / 1_000_000).toFixed(1)}M`;
  }
  if (num >= 1_000) {
    return `${(num / 1_000).toFixed(1)}K`;
  }
  return num.toString();
};

/**
 * Format phone number to Turkish format
 * @param phone - Phone number (e.g., "5551234567")
 * @returns Formatted phone (e.g., "(555) 123 45 67")
 */
export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');
  
  if (cleaned.length === 10 && cleaned.startsWith('5')) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)} ${cleaned.slice(6, 8)} ${cleaned.slice(8)}`;
  }
  
  if (cleaned.length === 11 && cleaned.startsWith('0')) {
    return `(${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)} ${cleaned.slice(7, 9)} ${cleaned.slice(9)}`;
  }
  
  return phone;
};

/**
 * Format date to Turkish locale
 * @param date - Date to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    ...options,
  }).format(dateObj);
};

/**
 * Format number with Turkish locale (thousands separator)
 * @param num - Number to format
 * @returns Formatted number string (e.g., "10.000")
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('tr-TR').format(num);
};

/**
 * Parse currency string to number
 * @param currency - Currency string (e.g., "₺10.000,50")
 * @returns Parsed number (e.g., 10000.5)
 */
export const parseCurrency = (currency: string): number => {
  const cleaned = currency
    .replace(/[₺\s]/g, '')
    .replace(/\./g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
};

/**
 * Parse percentage string to number
 * @param percentage - Percentage string (e.g., "%15,50")
 * @returns Parsed number (e.g., 15.5)
 */
export const parsePercentage = (percentage: string): number => {
  const cleaned = percentage
    .replace(/%/g, '')
    .replace(',', '.');
  return parseFloat(cleaned) || 0;
};
