/**
 * Role Update Endpoint
 * Fast, production-ready role assignment with cache invalidation
 */

import { NextRequest, NextResponse } from 'next/server'
import { currentUser } from '@clerk/nextjs/server'
import { clerkClient } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import { invalidateSessionCache, invalidateAllSessionCaches } from '@/lib/auth/session'
import type { UserRole } from '@prisma/client'

const VALID_ROLES = ['STUDENT', 'INSTRUCTOR', 'ADMIN'] as const

/**
 * POST /api/auth/role
 * Update user role
 */
export async function POST(request: NextRequest) {
  try {
    // Get authenticated user
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    // Parse request body
    const { role } = await request.json()

    // Validate role
    const normalizedRole = (role as string).toUpperCase()
    if (!VALID_ROLES.includes(normalizedRole as any)) {
      return NextResponse.json(
        { error: { code: 'INVALID_ROLE', message: 'Invalid role provided' } },
        { status: 400 }
      )
    }

    // Update user in database
    const updatedUser = await db.user.upsert({
      where: { clerkId: user.id },
      update: {
        role: normalizedRole as UserRole
      },
      create: {
        clerkId: user.id,
        email: user.emailAddresses[0]?.emailAddress || '',
        name: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        firstName: user.firstName || null,
        lastName: user.lastName || null,
        imageUrl: user.imageUrl || null,
        role: normalizedRole as UserRole
      },
      select: {
        id: true,
        clerkId: true,
        email: true,
        name: true,
        role: true,
        imageUrl: true
      }
    })

    // Update Clerk metadata
    try {
      const clerk = await clerkClient()
      await clerk.users.updateUserMetadata(user.id, {
        publicMetadata: {
          role: normalizedRole.toLowerCase(),
          onboardingCompleted: true,
          updatedAt: new Date().toISOString()
        }
      })
    } catch (clerkError) {
      console.error('Warning: Failed to update Clerk metadata:', clerkError)
      // Continue - database update is what matters
    }

    // Invalidate session cache
    invalidateSessionCache(user.id)

    return NextResponse.json(
      {
        success: true,
        user: updatedUser,
        message: `Role updated to ${normalizedRole}`
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('Role update error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to update role',
          details: process.env.NODE_ENV === 'development' ? errorMessage : undefined
        }
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/auth/role
 * Get current user role
 */
export async function GET() {
  try {
    const user = await currentUser()
    if (!user) {
      return NextResponse.json(
        { error: { code: 'UNAUTHORIZED', message: 'Not authenticated' } },
        { status: 401 }
      )
    }

    const dbUser = await db.user.findUnique({
      where: { clerkId: user.id },
      select: { role: true }
    })

    if (!dbUser) {
      return NextResponse.json(
        { error: { code: 'NOT_FOUND', message: 'User not found' } },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { role: dbUser.role },
      {
        headers: {
          'Cache-Control': 'private, max-age=300'
        }
      }
    )
  } catch (error) {
    console.error('Get role error:', error)
    return NextResponse.json(
      { error: { code: 'INTERNAL_SERVER_ERROR', message: 'Failed to get role' } },
      { status: 500 }
    )
  }
}
