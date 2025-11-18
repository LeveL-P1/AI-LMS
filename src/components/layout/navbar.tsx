
"use client"

import Link from "next/link"
import { BookOpen, Home, Users, BarChart3, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/common/ui/theme-toggle"
import { UserRole } from "@/types"

export function Navbar({ userRole = UserRole.STUDENT }: { userRole?: UserRole }) {
  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI LMS</span>
          </Link>
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}

