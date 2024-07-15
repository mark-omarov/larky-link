import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merges the given class names and returns a single string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Generates a random string of the specified length based on [a-zA-Z0-9] characters.
 * @default 8 length
 */
export function generateRandomString(length = 8) {
  const characters =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

/**
 * Parses and validates a number based on the given constraints.
 * If the input is not a valid number, the default value is returned.
 * If the input is less than the minimum value, the minimum value is returned.
 * If the input is greater than the maximum value, the maximum value is returned.
 * Otherwise, the input is returned as a number.
 */
export function parseAndValidateNumber({
  input = '',
  defaultValue,
  maxValue,
  minValue,
}: {
  input: string;
  defaultValue: number;
  maxValue: number;
  minValue: number;
}): number {
  const result = parseInt(input, 10);
  if (isNaN(result)) return defaultValue;
  if (result < minValue) return minValue;
  if (result > maxValue) return maxValue;
  return result;
}

/**
 * Generates an array of page numbers with ellipsis based on the current page and total pages.
 * Delta is used to determine the range of page numbers to display around the current page.
 * @default 2 delta
 */
export function getPageLinks(currentPage: number, totalPages: number) {
  const pages = [];
  const delta = 2;
  const range = {
    start: Math.max(2, currentPage - delta),
    end: Math.min(totalPages - 1, currentPage + delta),
  };

  for (let i = range.start; i <= range.end; i++) {
    pages.push(i);
  }

  if (range.start > 2) {
    pages.unshift('...');
  }
  if (range.end < totalPages - 1) {
    pages.push('...');
  }

  pages.unshift(1);
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Updates the current URL with new query parameters while preserving existing ones.
 */
export function getUrlWithUpdatedParams(
  searchParams: string[][] | Record<string, string> | string | URLSearchParams,
  newParams: { [key: string]: string | number },
): URLSearchParams {
  const params = new URLSearchParams(searchParams);
  Object.entries(newParams).forEach(([key, value]) =>
    params.set(key, value.toString()),
  );

  return params;
}
