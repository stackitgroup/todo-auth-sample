import { AppModule } from '@/app/app.module'
import { INestApplication, ValidationPipe } from '@nestjs/common'
import { Test, TestingModule } from '@nestjs/testing'
import request from 'supertest'
import { beforeAll, describe, it } from 'vitest'

describe('Test e2e', () => {
  let app: INestApplication

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule]
    }).compile()

    app = moduleFixture.createNestApplication()
    app.useGlobalPipes(
      new ValidationPipe({
        transform: false,
        whitelist: true,
        forbidNonWhitelisted: true
      })
    )
    await app.init()
  })

  it('Step 1: Test', async () => {
    await request(app.getHttpServer())
      .get('/v1/hello-world/sample')
      .send({})
      .expect(200)
      .expect({ message: "Hello World" })
  })

  afterAll(async () => {
    if (app) await app.close()
  })
})
