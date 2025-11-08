"use client";

// THIS IS REMAINING IN CLAUDE

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/common/ui/button";
import { ThemeToggle } from "@/components/common/ui/theme-toggle";
import { Menu, X, GraduationCap } from "lucide-react";
import { NAV_LINKS } from "@/lib/utils/constants";

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    // <header className="sticky top-2 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]
    // :bg-background/60">
    <header className="sticky top-8 z-50 mx-auto max-w-6xl w-full bg-background/90 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 flex justify-center items-center overflow-hidden rounded-2xl border-b-2 border-solid border-border shadow-sm">
      <div className="flex h-16 items-center w-full px-4">
        {/* Logo */}
        <div className=" mr-6 ml-4 flex items-center space-x-2">
          <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
            <GraduationCap className="h-5 w-5  text-primary-foreground " />
          </div>
          <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
            SkillSyncAI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-center flex-1 space-x-6 text-sm font-medium">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-foreground/60 transition-colors hover:text-foreground hover:underline underline-offset-4"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side buttons */}
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />{/* dark light toggle*/}
          <div className="hidden sm:flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/sign-in">Sign In</Link>
            </Button>
            <Button size="sm" asChild>
              <Link href="/sign-up">Get Started</Link>
            </Button>
          </div>

          {/* Mobile menu button */}
          <button
            className="inline-flex items-center justify-center md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <nav className="flex flex-col p-4 space-y-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-foreground/60 hover:text-foreground transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-2 pt-4 border-t">
              <Button variant="ghost" size="sm" asChild>
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button size="sm" asChild>
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}

    
    </header>
  );
}

