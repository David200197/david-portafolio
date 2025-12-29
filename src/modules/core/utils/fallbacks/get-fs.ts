import { createServerGetter } from './server-import'

export const getFs =
  createServerGetter<typeof import('fs/promises')>('fs/promises')
