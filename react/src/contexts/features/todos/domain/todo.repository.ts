import { Todo } from "./todo"
import { TodoDTO } from "./todo.dto"

export abstract class TodoRepository {
  getAllTodos: () => Promise<Todo[]>
  getTodoById: (id: string) => Promise<Todo>
  getTodosByUserId: (userId: string) => Promise<Todo[]>
  createTodo: (dto: TodoDTO) => Promise<Todo>
  updateTodo: (id: string, dto: Partial<TodoDTO>) => Promise<Todo>
  deleteTodo: (id: string) => Promise<void>
}
