import { Todo } from "@/contexts/features/todos/domain/todo"

type Props = {
    todo: Todo
}

export const TodoComponent = ({ todo }: Props) => {
    return (
        <div>
            <small>{todo.id.slice(0, 5)}...</small>
            <h2>{todo.title}</h2>
            <h4>{todo.description}</h4>
        </div>
    )
}