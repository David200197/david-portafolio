import { kebabCase } from './kebabCase'

/**
 * convert to capital case
 * @param {string} str
 * @returns string
 * @example
 * ```js
 * camelCase("FooBoo") // Foo Boo
 * camelCase("foo boo") // Foo Boo
 * ```
 */

export const capitalCase = (str: string) => {
  return kebabCase(str)
    .split('-')
    .map((word: string) => {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    })
    .join(' ')
}
