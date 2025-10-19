import { ReactNode } from "react"
import { Navbar } from "./navbar"
import { Sidebar } from "./sidebar"
import { UserRole } from "@/types"


interface DashboardLayoutProps {
  children: ReactNode
  userRole?: UserRole
}

export function DashboardLayout({
  children,
  userRole = UserRole.STUDENT,
}: DashboardLayoutProps) {
  return (
    <div className="min-h-screen">
      <Navbar userRole={userRole} />
      <div className="flex">
        <Sidebar userRole={userRole} />
        <main className="flex-1 p-6 lg:p-8">
          <div className="container mx-auto">{children}</div>
        </main>
      </div>
    </div>
  )
}