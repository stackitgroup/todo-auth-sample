import { Global, Module, Provider } from '@nestjs/common'
import { EventsGateway } from './application/events/events.gateway'
import { RealTimeService } from './application/real-time.service'
import { RealTimeController } from './infrastructure/real-time.controller'

const providers: Provider[] = [RealTimeService, EventsGateway]

@Global()
@Module({
  imports: [],
  controllers: [RealTimeController],
  providers,
  exports: [...providers]
})
export class RealTimeModule {}
