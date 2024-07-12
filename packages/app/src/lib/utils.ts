import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
