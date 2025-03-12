import { LoginContainer } from "@/contexts/components/login-container/login-container"
import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { Redirect } from "wouter"

export const LoginView = () => {
    const user = useAuthStore((s) => s.user)

    return (
        <div>
            {!user ? <LoginContainer /> : <Redirect to="/" />}
        </div>
    )
}