/**
 * convert to camel case
 * @param {string} str
 * @returns string
 * @example
 * ```js
 * camelCase("FooBoo") // fooBoo
 * camelCase("Foo Boo") // fooBoo
 * ```
 */
export const camelCase = (str: string) => {
  return str
    .replace(/\s(.)/g, function (a) {
      return a.toUpperCase()
    })
    .replace(/\s/g, '')
    .replace(/^(.)/, function (b) {
      return b.toLowerCase()
    })
}
