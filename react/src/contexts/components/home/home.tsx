import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { TodosComponent } from "../common/todos/todos"
import { Redirect } from "wouter"
import { useEffect } from "react"
import { authService } from "@/contexts/features/auth/application/auth.service"

export const HomeView = () => {
    const user = useAuthStore((s) => s.user)
    const userAccessToken = useAuthStore((s) => s.userAccessToken)
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

    useEffect(() => {
        const verify = async () => {
            await authService.verifyTokens(user, userAccessToken)
        }

        verify()
    }, [])

    return (
        <div>
            {isAuthenticated ? <TodosComponent /> : (<Redirect to="/access" />)}
        </div>
    )
}