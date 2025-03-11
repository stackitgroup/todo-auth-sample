import { authService } from "@/contexts/features/auth/application/auth.service";
import { AuthState, useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store";
import { useState } from "react";

export const LoginContainer = () => {
    const [isLogin, setIsLogin] = useState(false)
    const [text, setText] = useState('');
    const [password, setPassword] = useState('');

    const handleSignUp = async () => {
        await authService.signUp({
            username: text,
            password
        })
    }

    const handleLogIn = async () => {
        await authService.logIn({
            username: text,
            password
        })
    }

    return (
        <div className="flex flex-col space-y-4 max-w-sm mx-auto my-8">
            <div>
                <label htmlFor="text" className="block text-gray-700 font-medium">
                    Username
                </label>
                <input
                    id="text"
                    type="text"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="John Doe..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            <div>
                <label htmlFor="password" className="block text-gray-700 font-medium">
                    Password
                </label>
                <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="****"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>

            {isLogin ? (
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200" onClick={handleLogIn}>
                    Log In
                </button>
            ) : (
                <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-200" onClick={handleSignUp}>
                    Sign Up
                </button>
            )}
            <button className="hover:underline hover:text-blue-500 italic" onClick={() => setIsLogin(!isLogin)}>
                <small>
                    {isLogin ? "First time? Sign Up!" : "Already have an account? Log In!"}
                </small>
            </button>
        </div>
    )
}