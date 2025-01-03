/**
 * convert to kebab case
 * @param {val} str
 * @returns val
 * @example
 * ```js
 * camelCase("FooBoo") // foo-boo
 * camelCase("Foo Boo") // foo-boo
 * ```
 */
export const kebabCase = (val: string) =>
  val
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
