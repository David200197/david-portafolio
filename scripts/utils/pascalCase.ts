/**
 * convert to pascal case
 * @param {string} str
 * @returns string
 * @example
 * ```js
 * pascalCase("fooBoo") // FooBoo
 * pascalCase("foo Boo") // FooBoo
 * ```
 */
export const pascalCase = (str: string) =>
  (str.match(/[a-zA-Z0-9]+/g) || []).map(w => `${w.charAt(0).toUpperCase()}${w.slice(1)}`).join('')
