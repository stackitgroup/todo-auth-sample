import { useTodoStore } from "@/contexts/features/todos/infrastructure/todo.store"
import { CreateForm } from "../create/create-form"
import { navigate } from "wouter/use-browser-location"
import DatePicker from "react-datepicker"
import { ChangeEvent, useState } from "react"
import { TodoDTO } from "@/contexts/features/todos/domain/todo.dto"
import { todoService } from "@/contexts/features/todos/application/todo.service"
import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"

type Props = {
    id: string
}

export const UpdateView = ({ id }: Props) => {
    const user = useAuthStore((s) => s.user)
    const userAccessToken = useAuthStore((s) => s.userAccessToken)
    const todoStore = useTodoStore((s) => s.selectedTodo)
    const todos = useTodoStore((s) => s.todos)
    const [todo, setTodo] = useState<TodoDTO>({
        title: todoStore ? todoStore.title : '',
        description: todoStore ? todoStore.description : '',
        dueDate: todoStore ? todoStore.dueDate : new Date(),
        userId: user ? user.id : ''
    })

    if (!todoStore) {
        navigate("/")
    }

    if (todoStore?.id !== id) {
        navigate("/")
    }

    const handleChangeInput = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setTodo({ ...todo, [name]: value });
    }

    const handleDateChange = (date: Date | null) => {
        if (date) {
            setTodo({ ...todo, dueDate: date });
        }
    };

    const handleUpdateTodo = async (): Promise<void> => {
        if (!user) return;

        setTodo({ ...todo, userId: user.id })

        await todoService.updateTodo(id, todo, user, userAccessToken, todos)

        useTodoStore.setState({ selectedTodo: null })
    }

    return (
        <div>
            {id}
            <div className="flex flex-col space-y-4 max-w-sm mx-auto my-8">
                <div>
                    <label htmlFor="title" className="block text-gray-700 font-medium">
                        Title
                    </label>
                    <input
                        id="title"
                        name="title"
                        type="text"
                        value={todo.title}
                        onChange={handleChangeInput}
                        placeholder="I have to..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="description" className="block text-gray-700 font-medium">
                        Description
                    </label>
                    <input
                        id="description"
                        name="description"
                        type="text"
                        value={todo.description}
                        onChange={handleChangeInput}
                        placeholder="Description for..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label htmlFor="dueDate" className="block text-gray-700 font-medium">
                        Date
                    </label>
                    <DatePicker
                        selected={todo.dueDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        className="w-full p-2 border border-gray-300 rounded"
                    />
                </div>

                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200" onClick={handleUpdateTodo}>
                    Update
                </button>
            </div>
        </div>
    )
}