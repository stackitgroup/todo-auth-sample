import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { TodosComponent } from "../common/todos/todos"
import { Redirect } from "wouter"

export const HomeView = () => {
    const user = useAuthStore((s) => s.user)

    return (
        <div className="container">
            {user ? <TodosComponent /> : (<Redirect to="/access" />)}
        </div>
    )
}