import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { TodoRepository } from '../infrastructure/persistence/todo.repository'
import { Todo } from '../domain/entities/todo.entity';
import { CreateTodoDTO } from '../infrastructure/dto/create-todo.dto';

@Injectable()
export class TodoService {
  constructor(private readonly todoRepository: TodoRepository) {}

  async getAllTodos(): Promise<Todo[]> {
    return this.todoRepository.findAll();
  }

  async getTodoById(id: string): Promise<Todo | null> {
    const found = await this.todoRepository.findById(id);
    
    if(!found) {
      throw new NotFoundException(`Id ${id} not found`)
    }

    return found
  }

  async createTodo(data : CreateTodoDTO): Promise<Todo> {
    const alreadyExists = (
      await this.todoRepository.findByCondition(
        {
          condition: {
            title : data.title
          }
        }
      )
    )[0]

    if(alreadyExists) {
      throw new BadRequestException('Todo already exists')
    }
    
    return this.todoRepository.create({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      // userId
    });
  }

  async updateTodo(id: string, todo: Partial<Todo>): Promise<void> {
    await this.existsId(id);

    await this.todoRepository.update(id, todo);
  }

  async deleteTodo(id: string): Promise<void> {
    await this.existsId(id)

    await this.todoRepository.delete(id);
  }

  private async existsId(id: string) : Promise<void> {
    const found = await this.todoRepository.findById(id);

    if(!found) {
      throw new NotFoundException(`TODO with ID ${id} not found`)
    }
    
    return;
  }
}
