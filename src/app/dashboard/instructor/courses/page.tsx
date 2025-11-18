import { redirect } from 'next/navigation'
import Link from 'next/link'
import { db } from '@/lib/prisma/prisma'
import { Button } from '@/components/common/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/ui/card'

export default async function InstructorCoursesPage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const instructor = await db.user.findUnique({ where: { clerkId: userId } })
  if (!instructor || instructor.role !== 'INSTRUCTOR') redirect('/dashboard')

  const courses = await db.course.findMany({
    where: { instructorId: instructor.id },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Your courses</h1>
        <Link href="/dashboard/instructor/courses/new">
          <Button>Create course</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Manage your published and draft courses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            {courses.length === 0 && (
              <p className="text-sm text-muted-foreground">No courses yet. Create your first course.</p>
            )}
            {courses.map((c) => (
              <Link key={c.id} href={`/dashboard/instructor/courses/${c.id}`} className="border rounded-md p-4 hover:bg-accent">
                <div className="font-medium">{c.title}</div>
                <div className="text-sm text-muted-foreground line-clamp-2">{c.description}</div>
                <div className="mt-2 text-xs">{c.isPublished ? 'Published' : 'Draft'}</div>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


