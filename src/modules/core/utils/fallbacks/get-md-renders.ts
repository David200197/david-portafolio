import { createServerGetter } from './server-import'

export const getGrayMatter = async () => {
  const mod =
    await createServerGetter<typeof import('gray-matter')>('gray-matter')()
  return (
    (mod as unknown as { default: typeof import('gray-matter') }).default ?? mod
  )
}

export const getUnified =
  createServerGetter<typeof import('unified')>('unified')
export const getRemarkParse =
  createServerGetter<typeof import('remark-parse')>('remark-parse')
export const getRemarkGfm =
  createServerGetter<typeof import('remark-gfm')>('remark-gfm')
export const getRemarkRehype =
  createServerGetter<typeof import('remark-rehype')>('remark-rehype')
export const getRehypeRaw =
  createServerGetter<typeof import('rehype-raw')>('rehype-raw')
export const getRehypeHighlight =
  createServerGetter<typeof import('rehype-highlight')>('rehype-highlight')
export const getRehypeStringify =
  createServerGetter<typeof import('rehype-stringify')>('rehype-stringify')
