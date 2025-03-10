import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { TodoRepository } from '../infrastructure/persistence/todo.repository'
import { Todo } from '../domain/entities/todo.entity';
import { CreateTodoDTO } from '../infrastructure/dto/create-todo.dto';
import { User } from '../../users/domain/entities/user.entity';
import { UserService } from '../../users/application/user.service';
import { NODE_ENV } from '@/app/env.config';
import { JwtService } from '@nestjs/jwt';
import { JWTBody } from '../../users/domain/jwt-body';

@Injectable()
export class TodoService {
  constructor(
    private readonly userService: UserService,
    private readonly todoRepository: TodoRepository,
    private readonly jwtService: JwtService
  ) {}

  async getAllTodos(): Promise<Todo[]> {
    if (NODE_ENV === 'development' || NODE_ENV === 'test') {
      return await this.todoRepository.findAll()
    }

    return []
  }

  async getTodoById(id: string): Promise<Todo | null> {
    const found = await this.todoRepository.findById(id);
    
    if(!found) {
      throw new NotFoundException(`Id ${id} not found`)
    }

    return found
  }

  async getTodosByUserId(userId: string, userAgent: string, authHeader: string): Promise<Todo[] | null> {
    const user = await this.userService.getUserById(userId)

    if(!user) {
      throw new NotFoundException(`User ID ${userId} not found`)
    }

    const accessToken = authHeader.split(' ')[1]

    const {
      userId: userIdToken
    }: JWTBody = await this.jwtService.verifyAsync(accessToken)

    if(userId !== userIdToken) {
      throw new UnauthorizedException()
    }

    const found = (await this.todoRepository.findByCondition(
      {
        condition: {
          user: {
            id: userId
          }
        }
      }
    ))

    return found
  }

  async createTodo(data : CreateTodoDTO, userAgent: string): Promise<Todo> {
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

    const user = await this.userService.getUserById(data.userId)

    if(!user) {
      throw new NotFoundException(`User ID ${data.userId} does not exist`)
    }

    if(user.userAgent !== userAgent) {
      await this.userService.clearUserCredentials(data.userId)
      throw new UnauthorizedException()
    }
    
    return this.todoRepository.create({
      title: data.title,
      description: data.description,
      dueDate: data.dueDate,
      user: new User(data.userId)
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
