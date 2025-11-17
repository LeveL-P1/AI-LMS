/**
 * Session API Endpoint
 * Fast, optimized endpoint for getting current user session
 */

import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth/session'

export async function GET() {
  try {
    const session = await getSession()

    if (!session) {
      return NextResponse.json(
        {
          error: {
            code: 'UNAUTHORIZED',
            message: 'Not authenticated'
          }
        },
        { status: 401 }
      )
    }

    // Return session with caching headers
    return NextResponse.json(
      { user: session },
      {
        headers: {
          'Cache-Control': 'private, max-age=300', // 5 minutes
          'Content-Type': 'application/json'
        }
      }
    )
  } catch (error) {
    console.error('Session endpoint error:', error)
    return NextResponse.json(
      {
        error: {
          code: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to get session'
        }
      },
      { status: 500 }
    )
  }
}
