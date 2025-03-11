import { toast } from 'sonner'
import { TodoRepository } from '../domain/todo.repository'
import { HttpTodoRepository } from '../infrastructure/http-todo.repository'
import { useTodoStore } from '../infrastructure/todo.store'
import { TodoDTO } from '../domain/todo.dto'
import { useAuthStore } from '../../auth/infrastructure/auth.store'
import { authService } from '../../auth/application/auth.service'

const validateTokens = async (): Promise<void> => {
  authService.authenticate()

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
  const user = useAuthStore((s) => s.user)

  if(!user) {
    return
  }

  if(isAuthenticated) {
    return
  }

  await authService.refreshTokens()
}

export const TodoService = (repository: TodoRepository) => {
  if (repository === undefined) {
    throw new Error(
      'Repository is undefined. Please check if the repository is initialized correctly.'
    )
  }

  return {
    getTodoById: async (id: string): Promise<void> => {
        await validateTokens()

        const response = await repository.getTodoById(id)
    
        useTodoStore.setState({ selectedTodo: response })
    },
    getTodosByUserId: async (): Promise<void> => {
      await validateTokens()
        const user = useAuthStore((s) => s.user)

        if(!user) {
          return
        }

        const response = await repository.getTodosByUserId(user.id)
    
        useTodoStore.setState({todos: response})
    },
    createTodo: async (dto: TodoDTO): Promise<void> => {
        // await validateTokens()
        await repository.createTodo(dto)
    },
    updateTodo: async (id: string, dto: Partial<TodoDTO>): Promise<void> => {
        await validateTokens()
        const todos = useTodoStore((s) => s.todos)
        const todo = todos.find((t) => t.id === id)
        
        if(!todo) {
            return;
        } 
        
        const idx = todos.indexOf(todo)
        const todoUpdated = await repository.updateTodo(id, dto)
        todos[idx] = todoUpdated
        
        useTodoStore.setState({todos})
    },
    deleteTodo: async (id: string): Promise<void> => {
        await validateTokens()
        await repository.deleteTodo(id)
        
        const todos = useTodoStore((s) => s.todos)
        const newTodos = todos.filter((t) => t.id !== id)
    
        useTodoStore.setState({ todos: newTodos })
    }
  }
}

export const todoService = TodoService(new HttpTodoRepository())
