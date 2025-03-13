import { Todo } from "@/contexts/features/todos/domain/todo"
import { ActionButton } from "../action-button/action-button"
import { todoService } from "@/contexts/features/todos/application/todo.service"
import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { useTodoStore } from "@/contexts/features/todos/infrastructure/todo.store"
import { navigate } from "wouter/use-browser-location"

type Props = {
    todo: Todo
}

export const TodoComponent = ({ todo }: Props) => {
    const todos = useTodoStore((s) => s.todos)
    const { user, userAccessToken } = useAuthStore()

    const handleDelete = async () => {
        await todoService.deleteTodo(todo.id, user, userAccessToken, todos)
    }

    const handleUpdate = () => {
        navigate(`/update/${todo.id}`)
        useTodoStore.setState({ selectedTodo: todo })
    }

    return (
        <div className="border p-5 rounded-2xl bg-slate-200 hover:bg-slate-100">
            <small>#{todo.id.slice(0, 5)}...</small>
            <h2>{todo.title}</h2>
            <h4>{todo.description}</h4>
            <h5>{String(todo.dueDate)}</h5>
            <div className="flex gap-2 justify-between">
                <ActionButton onClick={handleDelete}>Delete</ActionButton>
                <ActionButton onClick={handleUpdate}>Update</ActionButton>
            </div>
        </div>
    )
}