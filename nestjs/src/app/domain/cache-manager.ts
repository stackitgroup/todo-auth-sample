export abstract class CacheManager {
  CACHE_STATUS: boolean

  abstract get<T>(key: string): Promise<T>
  abstract set<T>(
    key: string,
    value: T,
    expireInSeconds?: number
  ): Promise<void>
  abstract getAll(): Promise<unknown[]>
  abstract clear(): Promise<void>
}
