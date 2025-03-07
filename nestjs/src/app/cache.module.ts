import keyvSqLite from '@keyv/sqlite'
import { Global, Module, Provider } from '@nestjs/common'
import { Cacheable } from 'cacheable'
import { CachingController } from './caching.controller'
import { CacheManager } from './domain/cache-manager'
import { KeyVCacheManager } from './infrastructure/keyv-cache-manager'

const providers: Provider[] = [
  {
    provide: 'CACHE_INSTANCE',
    useFactory: () => {
      const secondary = new keyvSqLite('sqlite://./db.sqlite')
      return new Cacheable({ secondary, ttl: '1m' })
    }
  },
  {
    provide: CacheManager,
    useClass: KeyVCacheManager
  }
]
@Global()
@Module({
  providers,
  controllers: [CachingController],
  exports: providers
})
export class CacheModule {}
