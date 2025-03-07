import { createHash } from 'node:crypto'
import { Injectable } from '@nestjs/common'
import { CacheManager } from '../domain/cache-manager'

@Injectable()
export class InMemoryCacheManager implements CacheManager {
  clear(): Promise<void> {
    throw new Error('Method not implemented.')
  }
  CACHE_STATUS: boolean
  private cache: Map<string, unknown> = new Map()
  private keys: string[] = []

  async get<T>(key: string): Promise<T> {
    const hashedKey = this.generateHash(key)

    return (await Promise.resolve(this.cache.get(hashedKey))) as T
  }

  async set<T>(
    key: string,
    value: T,
    _expireInSeconds: number | string = '1h'
  ) {
    const hashedKey = this.generateHash(key)
    this.keys.push(hashedKey)

    await Promise.resolve(this.cache.set(hashedKey, value))
  }

  async getAll() {
    return await Promise.all(this.keys.map((key) => this.cache.get(key)))
  }

  generateHash(input: string): string {
    return createHash('sha256').update(input).digest('hex')
  }
}
