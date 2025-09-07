export async function getPath() {
  if (typeof window === 'undefined') {
    return await import('path')
  }
  return {
    join: (): string => {
      throw new Error('Path not available in browser')
    },
    basename: (): string => {
      throw new Error('Path not available in browser')
    },
  }
}
