'use server'

import { auth, clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'

export async function updateUserRole(role: string) {
  try {
    // Get the current user from Clerk
    const { userId } = await auth()
    
    if (!userId) {
      throw new Error('User not authenticated')
    }

    // Validate role
    const validRoles = ['STUDENT', 'INSTRUCTOR', 'ADMIN']
    const upperRole = role.toUpperCase()
    
    if (!validRoles.includes(upperRole)) {
      throw new Error('Invalid role')
    }

    // Update user role in Clerk's public metadata
    const clerk = await clerkClient()
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: {
        role: upperRole
      }
    })

    // Update user role in our database
    await db.user.update({
      where: {
        clerkId: userId
      },
      data: {
        role: upperRole as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN',
        status: 'ACTIVE'
      }
    })

    console.log(`Updated user ${userId} role to ${upperRole}`)
    
    return { success: true, role: upperRole }
    
  } catch (error) {
    console.error('Error updating user role:', error)
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
  }
}

