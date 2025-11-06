import { headers } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { Webhook } from 'svix'
import { db } from '@/lib/prisma'

type EventType = 'user.created' | 'user.updated' | '*'

type Event = {
  data: {
    id: string
    email_addresses: Array<{
      email_address: string
      id: string
    }>
    first_name: string
    last_name: string
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
  console.log(`Webhook with and ID of ${data.id} and type of ${type}`)

  if (type === 'user.created' || type === 'user.updated') {
    try {
      // Get the role from public_metadata, default to STUDENT
      const role = data.public_metadata?.role || 'STUDENT'
      
      // Get primary email
      const email = data.email_addresses.find(email => email.id === data.email_addresses[0]?.id)?.email_address
      
      if (!email) {
        console.error('No email found for user:', data.id)
        return new Response('No email found', { status: 400 })
      }

      // Upsert user in database
      await db.user.upsert({
        where: {
          clerkId: data.id,
        },
        update: {
          email,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
          role: role.toUpperCase() as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN',
        },
        create: {
          clerkId: data.id,
          email,
          firstName: data.first_name,
          lastName: data.last_name,
          imageUrl: data.image_url,
          role: role.toUpperCase() as 'STUDENT' | 'INSTRUCTOR' | 'ADMIN',
        },
      })

      console.log(`User ${data.id} synced to database with role: ${role}`)
    } catch (error) {
      console.error('Error syncing user to database:', error)
      return new Response('Error syncing user', { status: 500 })
    }
  }

  return new NextResponse('', { status: 200 })
}