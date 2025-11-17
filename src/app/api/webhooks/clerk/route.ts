import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/prisma/prisma'
import { invalidateAllSessionCaches } from '@/lib/auth/session'

type EventType = 'user.created' | 'user.updated' | 'user.deleted' | '*'

type Event = {
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string | null
    last_name: string | null
    image_url: string
    public_metadata: {
      role?: string
    }
  }
  object: 'event'
  type: EventType
}

export async function POST(req: NextRequest) {
  // You can find this in the Clerk Dashboard -> Webhooks -> choose the webhook
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  if (!WEBHOOK_SECRET) {
    throw new Error('Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env or .env.local')
  }

  // Get the headers
  const headerPayload = await headers()
  const svix_id = headerPayload.get('svix-id')
  const svix_timestamp = headerPayload.get('svix-timestamp')
  const svix_signature = headerPayload.get('svix-signature')

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occured -- no svix headers', {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(WEBHOOK_SECRET)

  let evt: Event

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as Event
  } catch (err) {
    console.error('Error verifying webhook:', err)
    return new Response('Error occured', {
      status: 400,
    })
  }

  // Handle the webhook
  const { type, data } = evt

  if (type === 'user.created' || type === 'user.updated') {
    try {
      // Get email
      const email = data.email_addresses[0]?.email_address
      if (!email) {
        console.error('No email found for user:', data.id)
        return new Response('No email found', { status: 400 })
      }

      // Get role from metadata, default to STUDENT
      const role = ((data.public_metadata?.role as string) || 'STUDENT').toUpperCase()

      // Build name
      const name = [data.first_name, data.last_name]
        .filter(Boolean)
        .join(' ')
        .trim() || null

      // Upsert user with clerkId as primary identifier
      await db.user.upsert({
        where: { clerkId: data.id },
        update: {
          email,
          name,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url || null,
          role: role as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
        },
        create: {
          clerkId: data.id,
          email,
          name,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url || null,
          role: role as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN'
        }
      })

      // Invalidate cache after user update
      invalidateAllSessionCaches()

      console.log(`✓ User ${data.id} synced (role: ${role})`)
    } catch (error) {
      console.error('✗ Error syncing user:', error)
      return new Response('Error syncing user', { status: 500 })
    }
  } else if (type === 'user.deleted') {
    try {
      // Delete user from database
      await db.user.delete({
        where: { clerkId: data.id }
      })

      // Invalidate cache
      invalidateAllSessionCaches()

      console.log(`✓ User ${data.id} deleted`)
    } catch (error) {
      console.error('✗ Error deleting user:', error)
      // Don't fail on delete errors
    }
  }

  return new NextResponse('', { status: 200 })
}

