import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import { syncUser } from '@/lib/auth/sync-user'
import type { UserRole } from '@prisma/client'


export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    console.log('Current user:', user?.id)
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await req.json()
    console.log('Requested role:', role)
    // Accept both uppercase (ADMIN) and lowercase (admin) formats
    const normalizedRole = (role as string).toUpperCase()
    const validRoles = ['STUDENT', 'INSTRUCTOR', 'ADMIN']

    if (!normalizedRole || !validRoles.includes(normalizedRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    console.log('Normalized role:', normalizedRole)

    // Ensure user exists in database by syncing from Clerk
    console.log('Finding user with clerkId:', user.id)
    let dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
    })

    console.log('Database user found:', dbUser?.id)

    if (!dbUser) {
      console.log('User not found, syncing from Clerk...')
      // Sync user from Clerk to database
      dbUser = await syncUser()
      
      if (!dbUser) {
        return NextResponse.json({ error: 'Failed to sync user' }, { status: 500 })
      }
      console.log('User synced:', dbUser.id)
    }

    // Update Prisma database with normalized uppercase role
    console.log('Updating user role...')
    const updatedUser = await db.user.update({
      where: { clerkId: user.id },
      data: { role: normalizedRole as UserRole },
    })
    console.log('User role updated:', updatedUser.role)

    // Update Clerk's publicMetadata with lowercase role for consistency with frontend
    try {
      const clerk = await clerkClient()
      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: normalizedRole.toLowerCase(),
          onboardingCompleted: true,
        },
      })
    } catch (clerkError) {
      console.error('Error updating Clerk metadata:', clerkError)
      // Continue even if Clerk update fails, database is updated
    }

    return NextResponse.json({ message: 'Role updated', user: updatedUser })

  } catch (error) {
    console.error('Error updating user role:', error)
    const errorMessage = error instanceof Error ? error.message : String(error)
    console.error('Error details:', errorMessage)
    return NextResponse.json({ 
      error: 'Internal server error',
      details: errorMessage 
    }, { status: 500 })
  }
}
