import { Controller, Get, Injectable } from '@nestjs/common'
import packageJson from '../../../package.json'

@Injectable()
@Controller('health')
export class HealthController {
  @Get('/')
  init(): string {
    return `Backend ${packageJson.version}`
  }
}
