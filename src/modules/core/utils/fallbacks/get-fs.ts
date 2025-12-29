import { createServerGetter } from '../create-server-getter'

export const getFs =
  createServerGetter<typeof import('fs/promises')>('fs/promises')
