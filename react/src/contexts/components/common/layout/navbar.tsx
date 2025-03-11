import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { Link } from "wouter";
import { ActionButton } from "../action-button/action-button";
import { authService } from "@/contexts/features/auth/application/auth.service";

export const Navbar = () => {
    const user = useAuthStore((s) => s.user)

    return (
        <nav className="bg-white border-gray-200 dark:bg-gray-900">
            <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
                <div className="flex items-center space-x-3 rtl:space-x-reverse">
                    <Link to="/">
                        <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">TODO App</span>
                    </Link>
                </div>
                <div className="flex items-center space-x-6 rtl:space-x-reverse">
                    {user ? (
                        <div className="flex gap-5 items-center">
                            <span className="text-white">@{user.username}</span>
                            <ActionButton onClick={async () => await authService.logOut(user)}>Logout</ActionButton>
                        </div>
                    ) : (
                        <Link to="/access" className="text-blue-600 dark:text-blue-500 hover:underline">Login</Link>
                    )}
                </div>
            </div>
        </nav>
    )
}