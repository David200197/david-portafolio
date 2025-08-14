import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

/**
 * Combines multiple class values into a single string using `clsx` and then merges Tailwind CSS classes using `tailwind-merge`.
 *
 * @param inputs - An array of class values (strings, arrays, objects, etc.) accepted by `clsx`.
 * @returns A single string of merged class names, with Tailwind CSS classes deduplicated and merged appropriately.
 */

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
