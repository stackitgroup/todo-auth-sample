import { Global, Module } from '@nestjs/common'
import { TodoController } from './infrastructure/todo.controller'
import { TypeOrmModule } from '@nestjs/typeorm'
import { Todo } from './domain/entities/todo.entity'
import { TodoService } from './application/todo.service'
import { TodoRepository } from './infrastructure/persistence/todo.repository'

@Global()
@Module({
  imports: [TypeOrmModule.forFeature([Todo])],
  providers: [TodoService, TodoRepository],
  controllers: [TodoController],
  exports: [TodoService]
})
export class TodoModule {}
