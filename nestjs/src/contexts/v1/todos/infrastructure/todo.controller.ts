import { routes } from '@/config/app.routes';
import { Body, Controller, Delete, Get, Param, Post, Put, Headers } from '@nestjs/common';
import { Todo } from '../domain/entities/todo.entity';
import { TodoService } from '../application/todo.service';
import { CreateTodoDTO } from './dto/create-todo.dto';

@Controller({
  version: routes.v1.version,
  path: routes.v1.todo.root,
})
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get(routes.v1.todo.findAll)
  getAllTodos(): Promise<Todo[]> {
    return this.todoService.getAllTodos();
  }

  @Get(routes.v1.todo.byId)
  getTodoById(@Param('id') id: string): Promise<Todo | null> {
    return this.todoService.getTodoById(id);
  }

  @Get(routes.v1.todo.byUserId)
  getTodoByUserId(
    @Headers('User-Agent') userAgent: string,
    @Headers('Authorization') authHeader: string,
    @Param('userId') userId: string
  ): Promise<Todo[] | null> {
    return this.todoService.getTodosByUserId(userId, userAgent, authHeader);
  }

  @Post(routes.v1.todo.create)
  createTodo(
    @Headers('User-Agent') userAgent: string,
    @Body() data: CreateTodoDTO
  ): Promise<Todo> {
    return this.todoService.createTodo(data, userAgent)
  }

  @Put(routes.v1.todo.byId)
  async updateTodo(@Param('id') id: string, @Body() data: Partial<Todo>): Promise<void> {
    await this.todoService.updateTodo(id, data);
  }

  @Delete(routes.v1.todo.byId)
  async deleteTodo(@Param('id') id: string): Promise<void> {
    await this.todoService.deleteTodo(id);
  }
}
