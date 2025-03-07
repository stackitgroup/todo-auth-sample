import { Controller, Get, Injectable, Query } from '@nestjs/common'
import { CacheManager } from './domain/cache-manager'

@Injectable()
@Controller('/cache')
export class CachingController {
  constructor(private readonly cacheManager: CacheManager) {}

  @Get('/')
  enable(@Query('status') status: string) {
    if (status === 'true') {
      this.cacheManager.CACHE_STATUS = true
    }

    if (status === 'false') {
      this.cacheManager.CACHE_STATUS = false
    }

    return {
      cache: this.cacheManager.CACHE_STATUS
    }
  }

  @Get('/clear')
  async init(): Promise<string> {
    await this.cacheManager.clear()
    return 'Cache cleared'
  }
}
