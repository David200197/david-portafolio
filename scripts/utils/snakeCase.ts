import { kebabCase } from './kebabCase'

export const snakeCase = (str: string) => {
  return kebabCase(str)
    .split('-')
    .map((word: string) => {
      return word.charAt(0).toLowerCase() + word.slice(1).toLowerCase()
    })
    .join('_')
}
