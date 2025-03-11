import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { Redirect } from "wouter"
import { CreateForm } from "./create-form"

export const CreateView = () => {
    const user = useAuthStore((s) => s.user)

    return (
        <div>
            {user ? <CreateForm /> : (<Redirect to="/access" />)}
        </div>
    )
}