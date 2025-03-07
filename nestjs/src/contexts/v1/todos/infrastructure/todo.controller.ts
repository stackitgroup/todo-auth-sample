import { routes } from '@/config/app.routes';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
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
  async getAllTodos(): Promise<Todo[]> {
    return this.todoService.getAllTodos();
  }

  @Get(routes.v1.todo.byId)
  async getTodoById(@Param('id') id: string): Promise<Todo | null> {
    return this.todoService.getTodoById(id);
  }

  @Post(routes.v1.todo.create)
  async createTodo(@Body() data: CreateTodoDTO): Promise<Todo> {
    return this.todoService.createTodo(data)
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
