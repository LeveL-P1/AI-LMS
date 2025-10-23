
"use client"

import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { BookOpen, Home, Users, BarChart3, Settings } from "lucide-react"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useUser } from "@/hooks/use-user"
import { UserRole } from "@/types"

interface NavbarProps {
  userRole?: UserRole
}

export function Navbar({ userRole }: NavbarProps) {
  const { isLoaded, isSignedIn, role, isStudent, isInstructor } = useUser()

  // Don't render until loaded
  if (!isLoaded) return null

  return (
    <nav className="border-b bg-background">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <BookOpen className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">AI LMS</span>
          </Link>

          {isSignedIn && (
            <div className="hidden md:flex items-center space-x-6">
              <Link
                href="/dashboard"
                className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-primary"
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>

              {isStudent && (
                <Link
                  href="/courses"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  My Courses
                </Link>
              )}

              {isInstructor && (
                <Link
                  href="/instructor/courses"
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  My Courses
                </Link>
              )}
            </div>
          )}

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            {isSignedIn && (
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              />
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}