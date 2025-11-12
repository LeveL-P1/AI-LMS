import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import type { UserRole } from '@prisma/client'


export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await req.json()
    // Accept both uppercase (ADMIN) and lowercase (admin) formats
    const normalizedRole = (role as string).toUpperCase()
    const validRoles = ['STUDENT', 'INSTRUCTOR', 'ADMIN']

    if (!normalizedRole || !validRoles.includes(normalizedRole)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    const existingUser = await db.user.findUnique({
      where: { clerkId: user.id },
    })

    if (!existingUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Update Prisma database with normalized uppercase role
    const updatedUser = await db.user.update({
      where: { clerkId: user.id },
      data: { role: normalizedRole as UserRole },
    })

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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
