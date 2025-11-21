import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a date string into a medium date and short time format suitable for the Indonesian locale (id-ID).
 * Example: Nov 21, 2025, 9:40 PM
 * @param date A valid date string (e.g., from new Date().toISOString()).
 * @returns The formatted date string.
 */
export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(date));
}

/**
 * Removes all non-digit characters from a string.
 * Useful for cleaning up numeric input before conversion or calculation.
 * @param val The input string.
 * @returns A string containing only digits.
 */
export const parseNumber = (val: string) => {
  return val.replace(/\D/g, '');
};

/**
 * Formats a number into the Indonesian Rupiah currency format (Rp).
 * This function strips non-digit characters and applies the standard Indonesian thousands separator format.
 * @param val The value as a string or number.
 * @returns The formatted string prefixed with "Rp ".
 */
export const formatRupiah = (val: string | number) => {
  if (val === undefined || val === null || val === '') return '';
  const num = typeof val === 'string' ? val.replace(/\D/g, '') : val;
  return 'Rp ' + Number(num).toLocaleString('id-ID');
};

/**
 * Returns the current date and time string formatted specifically for update timestamps.
 * Example format: 21 Nov 2025, 21:40 (using 24-hour time).
 * @returns A string containing the formatted current date and time.
 */
export const formatUpdatedDate = () => {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date());
};