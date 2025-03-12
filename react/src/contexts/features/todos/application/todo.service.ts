import { toast } from 'sonner'
import { TodoRepository } from '../domain/todo.repository'
import { HttpTodoRepository } from '../infrastructure/http-todo.repository'
import { useTodoStore } from '../infrastructure/todo.store'
import { TodoDTO } from '../domain/todo.dto'
import { useAuthStore } from '../../auth/infrastructure/auth.store'
import { authService } from '../../auth/application/auth.service'
import { User } from '../../auth/domain/user'
import { navigate } from 'wouter/use-browser-location'

export const TodoService = (repository: TodoRepository) => {
  if (repository === undefined) {
    throw new Error(
      'Repository is undefined. Please check if the repository is initialized correctly.'
    )
  }

  return {
    getTodoById: async (id: string, isAuthenticated: boolean, user: User | null, accessToken: string): Promise<void> => {
        await authService.verifyTokens(user, accessToken)

        const response = await repository.getTodoById(id)
    
        useTodoStore.setState({ selectedTodo: response })
    },
    getTodosByUserId: async (user: User | null, accessToken :string): Promise<void> => {
      await authService.verifyTokens(user, accessToken)

      if(!user) {
        return
      }

      try {
        const response = await repository.getTodosByUserId(user.id)
      
        useTodoStore.setState({todos: response})
      } catch (error) {
        const err = `${error}`
        const errType : string | undefined = err.split(' ')[1]
        const UNAUTHORIZED = "Unauthorized"

        if(errType === UNAUTHORIZED) {
          useAuthStore.setState({user: null, userAccessToken: "", isAuthenticated: false})
        }
      }
    },
    createTodo: async (dto: TodoDTO, isAuthenticated: boolean, user: User | null, accessToken: string): Promise<void> => {
        await authService.verifyTokens(user, accessToken)
      
      try {
        await repository.createTodo(dto)
        navigate("/")
      } catch (error) {
        toast.error(`${error}`)
      }

    },
    updateTodo: async (id: string, dto: Partial<TodoDTO>, isAuthenticated: boolean, user: User | null,  accessToken:  string): Promise<void> => {
        await authService.verifyTokens(user, accessToken)
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
    deleteTodo: async (id: string, user: User | null, accessToken: string): Promise<void> => {
        await authService.verifyTokens(user, accessToken)
        await repository.deleteTodo(id)
        
        const todos = useTodoStore((s) => s.todos)
        const newTodos = todos.filter((t) => t.id !== id)
    
        useTodoStore.setState({ todos: [] })
    }
  }
}

export const todoService = TodoService(new HttpTodoRepository())
