// src/app/layout.tsx
'use client' // Add this line at the top

import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { useEffect, useState } from 'react'
import './globals.css'
import { AuthProvider } from '@/context/auth-context'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AI-LMS',
  description: 'AI-Powered Learning Management System',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        {mounted && ( // Only render AuthProvider after mounting to avoid hydration issues
          <AuthProvider>
            {children}
          </AuthProvider>
        )}
      </body>
    </html>
  )
}