/**
 * HOF para crear getters de módulos server-only
 */
export function createServerGetter<T extends object>(
  moduleName: string
): () => Promise<T> {
  let cached: T | undefined

  return async (): Promise<T> => {
    if (typeof window !== 'undefined') {
      throw new Error(`Module "${moduleName}" is not available in browser`)
    }

    if (cached === undefined) {
      cached = await import(/* webpackIgnore: true */ moduleName)
    }

    return cached!
  }
}
