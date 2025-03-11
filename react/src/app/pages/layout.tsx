import { Navbar } from "@/contexts/components/common/layout/navbar"
import { useAuthStore } from "@/contexts/features/auth/infrastructure/auth.store"
import { ReactNode } from "react"

type Props = {
  readonly children: ReactNode
}

export const Layout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <main>
        {children}
      </main>
    </div>
  )
}
