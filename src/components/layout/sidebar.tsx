"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Users,
  BarChart3,
  Settings,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/common/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import { UserRole } from "@/types";

interface SidebarProps {
  userRole: UserRole;
}

const studentLinks = [
  { href: "/dashboard/student", label: "Dashboard", icon: BookOpen },
  { href: "/courses", label: "My Courses", icon: Users },
  { href: "/dashboard/student/progress", label: "Progress", icon: BarChart3 },
  { href: "/dashboard/student/settings", label: "Settings", icon: Settings },
];

const instructorLinks = [
  { href: "/dashboard/instructor", label: "Dashboard", icon: BookOpen },
  { href: "/instructor/courses", label: "My Courses", icon: Users },
  { href: "/dashboard/instructor/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/instructor/settings", label: "Settings", icon: Settings },
];

const adminLinks = [
  { href: "/dashboard/admin", label: "Dashboard", icon: BookOpen },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/courses", label: "Courses", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();

  let links = studentLinks; // Default to student links if role unrecognized
  if (userRole === "instructor") {
    links = instructorLinks;
  } else if (userRole === "admin") {
    links = adminLinks;
  }

  return (
    <aside className="w-64 bg-background border-r flex flex-col">
      {/* Logo */}
      <Link href="/dashboard" passHref className="p-6 flex items-center gap-2 font-bold border-b">
        <GraduationCap className="h-6 w-6 text-primary" />
        <span>SkillSyncAI</span>
      </Link>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname?.startsWith(link.href);
          return (
            <Link key={link.href} href={link.href} passHref>
              <Button
                variant={isActive ? "default" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-primary text-primary-foreground"
                )}
              >
                <Icon className="h-4 w-4" />
                {link.label}
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Sign out */}
      <div className="border-t p-4">
        <SignOutButton redirectUrl="/">
          <Button variant="outline" className="w-full justify-start gap-3">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </SignOutButton>
      </div>
    </aside>
  );
}
