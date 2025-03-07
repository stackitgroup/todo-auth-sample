import { CacheManager } from '@/app/domain/cache-manager'
import { EventEmitterHandler } from '@/app/domain/event-emitter-handler'
import { InMemoryCacheManager } from '@/app/infrastructure/in-memory-cache-manager'
import { HelloWorldService } from '@/contexts/v1/hello-world/application/hello-world.service'
import { Test, TestingModule } from '@nestjs/testing'
import { beforeEach, describe, expect, it } from 'vitest'
import { MockProxy, mock } from 'vitest-mock-extended'

describe('Test Service', () => {
  let service: HelloWorldService
  let eventEmitterHandler: MockProxy<EventEmitterHandler>

  beforeEach(async () => {
    eventEmitterHandler = mock<EventEmitterHandler>()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HelloWorldService,
        { provide: EventEmitterHandler, useValue: eventEmitterHandler },
        {
          provide: CacheManager,
          useClass: InMemoryCacheManager
        }
      ]
    }).compile()

    service = module.get<HelloWorldService>(HelloWorldService)
  })

  describe('Test', () => {
    it('should return "Hello World"', () => {
      // Given
      const expected = "Hello World"

      // When
      const result = service.run()

      // Then
      expect(result.message).toEqual(expected)
    })
  })
})
