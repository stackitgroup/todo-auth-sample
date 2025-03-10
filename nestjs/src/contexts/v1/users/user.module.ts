import { Global, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserService } from './application/user.service'
import { UserRepository } from './infrastructure/persistence/user.repository'
import { UserController } from './infrastructure/user.controller'
import { User } from './domain/entities/user.entity'
import { JwtModule } from '@nestjs/jwt'
import { JWT_SECRET } from '@/app/env.config'

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true,
      verifyOptions: { ignoreExpiration: false, algorithms: ['HS256'] },
      secret: JWT_SECRET,
      signOptions: { expiresIn: 86400 }
    })
  ],
  providers: [UserService, UserRepository],
  controllers: [UserController],
  exports: [UserService]
})
export class UserModule {}
