import { create } from 'zustand'
import { Todo } from '../domain/todo'

export type TodoState = {
  todos: Todo[]
  selectedTodo: Todo | null
}

export const useTodoStore = create<TodoState>(() => ({
  todos: [],
  selectedTodo: null
}))
