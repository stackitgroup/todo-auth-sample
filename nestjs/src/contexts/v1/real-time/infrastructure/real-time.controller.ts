import { routes } from '@/config/app.routes'
import { Controller, Get } from '@nestjs/common'
import { RealTimeService } from '../application/real-time.service'

@Controller({
  version: routes.v1.version,
  path: routes.v1.realTime.root,
})
export class RealTimeController {
  constructor(private readonly realTimeService: RealTimeService) {}

  @Get('/')
  sample() {
    return this.realTimeService.run()
  }
}
