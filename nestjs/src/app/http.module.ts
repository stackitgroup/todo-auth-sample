import { HttpModule as AxiosHttpModule } from '@nestjs/axios'
import { Global, Module } from '@nestjs/common'
import { HttpService } from './domain/http-service'
import { NestHttpService } from './infrastructure/nest-http-service'

@Global()
@Module({
  imports: [
    AxiosHttpModule.register({
      timeout: 600000
    })
  ],
  providers: [
    {
      provide: HttpService,
      useClass: NestHttpService
    }
  ],
  exports: [
    {
      provide: HttpService,
      useClass: NestHttpService
    },
    AxiosHttpModule.register({
      timeout: 600000
    })
  ]
})
export class HttpModule {}
