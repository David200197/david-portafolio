import { capitalCase } from './capitalCase'

/**
 * convert to capital case
 * @param {string}
 * @param {{ withSpaces: boolean = true }}
 * @returns {string}
 * @example
 * ```js
 * upperCase("FooBoo") // FOO BOO
 * upperCase("foo boo") // FOO BOO
 * ```
 *
 * if withSpaces is false
 * ```js
 * upperCase("Dragon Fly", { withSpaces: false }) // DRAGONFLY
 * upperCase("dragon fly", , { withSpaces: false }) // DRAGONFLY
 * ```
 *
 */

export const upperCase = (srt: string, { withSpaces = true } = {}) =>
  capitalCase(srt)
    .toUpperCase()
    .split(' ')
    .join(withSpaces ? ' ' : '')
