import { Navbar } from "@/contexts/components/common/layout/navbar"
import { ReactNode } from "react"

type Props = {
  readonly children: ReactNode
}

export const Layout = ({ children }: Props) => {
  return (
    <div>
      <Navbar />
      <main className="container">
        {children}
      </main>
    </div>
  )
}
