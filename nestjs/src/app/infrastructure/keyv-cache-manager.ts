import { Global, Inject, Injectable } from '@nestjs/common'
import { Cacheable } from 'cacheable'
import { CacheManager } from '../domain/cache-manager'

@Global()
@Injectable()
export class KeyVCacheManager implements CacheManager {
  private keys: string[] = []

  CACHE_STATUS = true

  constructor(@Inject('CACHE_INSTANCE') private readonly cache: Cacheable) {}

  async get<T>(key: string): Promise<T> {
    if (!this.keys.find((k) => k === key)) {
      this.keys.push(key)
    }

    if (this.CACHE_STATUS) {
      return (await this.cache.get(key)) as T
    }

    return (await undefined) as T
  }

  async set<T>(key: string, value: T, expireInSeconds: number | string = '1h') {
    await this.cache.set(key, value, expireInSeconds)
  }

  async getAll() {
    return await Promise.all(
      this.keys.map(async (key) => ({
        key,
        value: await this.cache.get(key)
      }))
    )
  }

  async clear() {
    await this.cache.clear()
  }
}
