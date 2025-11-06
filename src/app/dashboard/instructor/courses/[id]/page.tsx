import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function ManageCoursePage({ params }: { params: { id: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const course = await db.course.findFirst({
    where: { id: params.id },
  })

  if (!course) redirect('/dashboard/instructor/courses')

  // TODO: add lesson management interface

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Course: {course.title}</h1>
        <Link href="/dashboard/instructor/courses">
          <Button variant="outline">Back to courses</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course details</CardTitle>
          <CardDescription>Title, description, and status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-lg font-semibold">
            {course.title}
          </div>
          <div className="mb-2 text-muted-foreground">
            {course.description}
          </div>
          <div>Status: {course.isPublished ? 'Published' : 'Draft'}</div>
        </CardContent>
      </Card>

      {/* TODO: Add lesson list & add lesson form here */}
    </div>
  )
}
