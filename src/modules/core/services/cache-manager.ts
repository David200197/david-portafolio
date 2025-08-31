import { Injectable } from '../decorators/Injectable'

@Injectable()
export class CacheManager {
  private readonly cache = new Map<string, unknown>()

  get<T>(key: string) {
    return this.cache.get(key) as T | null
  }

  set<T>(key: string, data: T) {
    this.cache.set(key, data)
  }

  delete(key: string) {
    this.cache.delete(key)
  }

  clear() {
    this.cache.clear()
  }
}
