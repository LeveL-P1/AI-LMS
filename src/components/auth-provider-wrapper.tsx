'use client'

import { useEffect, useState } from 'react'
import { AuthProvider } from '@/context/auth-context'

export function AuthProviderWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Only render AuthProvider after mounting to avoid hydration issues
  if (!mounted) {
    return <>{children}</>
  }

  return <AuthProvider>{children}</AuthProvider>
}
