export async function getFs() {
  if (typeof window === 'undefined') {
    return await import('fs/promises')
  }
  return {
    readFile: () =>
      Promise.reject(new Error('File system not available in browser')),
    writeFile: () =>
      Promise.reject(new Error('File system not available in browser')),
    readdir: () =>
      Promise.reject(new Error('File system not available in browser')),
  }
}
