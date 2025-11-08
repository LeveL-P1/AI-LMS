"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BookOpen,
  Home,
  Users,
  FileText,
  BarChart3,
  Settings,
  PlusCircle,
} from "lucide-react"
import { cn } from "@/lib/utils/utils"
import { UserRole } from "@/types"

interface SidebarProps {
  userRole?: UserRole
}

export function Sidebar({ userRole = UserRole.STUDENT}: SidebarProps) {
  const pathname = usePathname()
  const isStudent = userRole === UserRole.STUDENT
  const isInstructor = userRole === UserRole.INSTRUCTOR

  const studentLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/courses", label: "My Courses", icon: BookOpen },
    { href: "/courses/browse", label: "Browse Courses", icon: BookOpen },
    { href: "/assignments", label: "Assignments", icon: FileText },
    { href: "/progress", label: "My Progress", icon: BarChart3 },
  ]

  const instructorLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/instructor/courses", label: "My Courses", icon: BookOpen },
    {
      href: "/instructor/courses/create",
      label: "Create Course",
      icon: PlusCircle,
    },
    { href: "/instructor/students", label: "Students", icon: Users },
    { href: "/instructor/analytics", label: "Analytics", icon: BarChart3 },
    { href: "/instructor/settings", label: "Settings", icon: Settings },
  ]

  const links = isInstructor ? instructorLinks : studentLinks

  return (
    <aside className="hidden md:flex w-64 flex-col border-r bg-background">
      <div className="flex-1 overflow-y-auto py-6">
        <nav className="space-y-1 px-3">
          {links.map((link) => {
            const Icon = link.icon
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
              >
                <Icon className="h-5 w-5" />
                <span>{link.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>
    </aside>
  )
}


