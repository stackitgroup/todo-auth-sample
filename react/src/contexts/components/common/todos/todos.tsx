import { useTodoStore } from "@/contexts/features/todos/infrastructure/todo.store"
import { TodoComponent } from "./todo"
import { Link } from "wouter"
import { ActionButton } from "../action-button/action-button"
import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { useEffect } from "react"
import { todoService } from "@/contexts/features/todos/application/todo.service"

export const TodosComponent = () => {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    const userAccessToken = useAuthStore((s) => s.userAccessToken)
    const user = useAuthStore((s) => s.user)
    const todos = useTodoStore((s) => s.todos)

    useEffect(() => {
        const fetchTodos = async () => {
            await todoService.getTodosByUserId(user, userAccessToken)
        }
        fetchTodos()
    }, [])

    return (
        <div>
            <small>{JSON.stringify(user)} -</small><small>{userAccessToken.slice(0, 8)}...{userAccessToken.slice(userAccessToken.length - 8, userAccessToken.length)}</small>
            <div className="flex items-center justify-between">
                <h1>Todos: {todos.length}</h1>
                <ActionButton>
                    <Link to="/create" className="text-white hover:text-white hover:no-underline">Create TODO</Link>
                </ActionButton>
            </div>
            <div className="grid grid-cols-4 gap-5">
                {todos.map((todo) => (
                    <TodoComponent todo={todo} key={todo.id} />
                ))}
            </div>
        </div>
    )
}