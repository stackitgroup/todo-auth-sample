import { HttpService } from '@/contexts/shared/infrastructure/http-service'
import { TodoRepository } from '../domain/todo.repository'
import { Todo } from '../domain/todo'
import { TodoDTO } from '../domain/todo.dto'
import Cookies from 'js-cookie'

export class HttpTodoRepository extends HttpService implements TodoRepository {
  constructor() {
    super()
    this.serviceUrl = '/v1/todo'
  }
    async getAllTodos(): Promise<Todo[]> {
        return await this.request<Todo[]>({
            url: "/", 
            options: {
                method: 'GET'
            }
        })
    }

    async getTodoById (id: string): Promise<Todo> {
        return await this.request<Todo>({
            url: `/${id}`,
            options: {
                method: 'GET'
            }
        })
    }

    async getTodosByUserId(userId: string): Promise<Todo[]> {
        return await this.request<Todo[]>({
            url: `/user/${userId}`,
            options: {
                method: 'GET'
            }
        })
    }

    async createTodo(dto: TodoDTO): Promise<Todo> {
        return await this.request<Todo>({
            url: `/create`,
            options: {
                method: 'POST',
                body: JSON.stringify(dto)
            }
        })
    }

    async updateTodo(id: string, dto: Partial<TodoDTO>): Promise<Todo> {
        return await this.request<Todo>({
            url: `/${id}`,
            options: {
                method: 'PUT',
                body: JSON.stringify(dto)
            }
        })
    }

    async deleteTodo(id: string): Promise<void> {
        await this.request<void>({
            url: `/${id}`,
            options: {
                method: 'DELETE'
            }
        })
        return
    }
}
