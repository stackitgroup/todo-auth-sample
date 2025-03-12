import { Todo } from "@/contexts/features/todos/domain/todo"
import { ActionButton } from "../action-button/action-button"
import { todoService } from "@/contexts/features/todos/application/todo.service"
import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"

type Props = {
    todo: Todo
}

export const TodoComponent = ({ todo }: Props) => {
    const { user, isAuthenticated, userAccessToken } = useAuthStore()

    const handleDelete = async () => {
        await todoService.deleteTodo(todo.id, user, userAccessToken)
    }

    return (
        <div className="border p-5 rounded-2xl bg-slate-200 hover:bg-slate-100">
            <small>#{todo.id.slice(0, 5)}...</small>
            <h2>{todo.title}</h2>
            <h4>{todo.description}</h4>
            <h5>{String(todo.dueDate)}</h5>
            <ActionButton onClick={handleDelete}>Delete</ActionButton>
        </div>
    )
}