import { useTodoStore } from "@/contexts/features/todos/infrastructure/todo.store"
import { TodoComponent } from "./todo"
import { Link } from "wouter"
import { ActionButton } from "../action-button/action-button"

export const TodosComponent = () => {
    const todos = useTodoStore((s) => s.todos)

    return (
        <div>
            <div className="flex items-center justify-between">
                <h1>Todos: {todos.length}</h1>
                <ActionButton>
                    <Link to="/create" className="text-white hover:text-white hover:no-underline">Create TODO</Link>
                </ActionButton>
            </div>
            {todos.map((todo) => (
                <TodoComponent todo={todo} key={todo.id} />
            ))}
        </div>
    )
}