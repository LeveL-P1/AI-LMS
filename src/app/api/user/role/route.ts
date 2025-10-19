import { NextRequest, NextResponse } from 'next/server'
import { currentUser, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    const user = await currentUser()
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { role } = await req.json()

    if (!role || !['STUDENT', 'INSTRUCTOR', 'ADMIN'].includes(role)) {
      return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
    }

    // Update user role in database
    const updatedUser = await db.user.update({
      where: {
        clerkId: user.id,
      },
      data: {
        role: role,
      },
    })

    // Update user metadata in Clerk
    const clerk = await clerkClient()
    await clerk.users.updateUserMetadata(user.id, {
      unsafeMetadata: {
        role: role.toLowerCase(),
        onboardingCompleted: true
      }
    })

    return NextResponse.json({ 
      message: 'Role updated successfully',
      user: updatedUser 
    })
  } catch (error) {
    console.error('Error updating user role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
