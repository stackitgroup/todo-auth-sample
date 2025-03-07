import { forwardRef, Global, Module, Provider } from '@nestjs/common'
import { TodoController } from './infrastructure/todo.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Todo } from './domain/entities/todo.entity';
import { TodoService } from './application/todo.service';
import { TodoRepository } from './infrastructure/persistence/todo.repository';
import { UserModule } from '../user/user.module';

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([Todo]), 
    // forwardRef(() => UserModule),
    UserModule
  ],
  providers: [TodoService, TodoRepository],
  controllers: [TodoController],
  exports: [TodoService]
})
export class TodoModule {}
