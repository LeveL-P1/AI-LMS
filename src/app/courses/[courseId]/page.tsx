import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'

export default async function CourseDetailPage(props: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await props.params
  const { userId } = await auth()

  // Fetch course detail & lessons  
  const course = await db.course.findUnique({
    where: { id: courseId },
  })

  if (!course) return <div className="p-8 text-center text-muted-foreground">Course not found.</div>

  // Fetch enrollments separately
  const enrollments = await db.enrollment.findMany({
    where: { courseId }
  })
  const enrolled = userId && enrollments.some(e => e.userId === userId)

  // Fetch chapters will be added after database migration
  const chapters: Array<{ id: string; title: string; description: string | null }> = []

  // Fetch instructor
  const instructor = course.instructorId ? await db.user.findUnique({
    where: { id: course.instructorId }
  }) : null

  async function enroll() {
    'use server'
    if (!userId) redirect('/sign-in')

    try {
      await db.enrollment.create({
        data: { 
          id: `enrollment_${userId}_${courseId}`,
          userId: userId, 
          courseId, 
          status: 'ACTIVE' 
        },
      })
      redirect(`/courses/${courseId}`)
    } catch (error) {
      console.error('Enrollment failed:', error)
      throw new Error('Failed to enroll in course')
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">{course.title}</h1>
      <div className="text-muted-foreground mb-2">By {instructor?.name || 'Unknown Instructor'}</div>
      <div className="mb-4 text-sm">{course.description}</div>
      {!enrolled && !!userId && (
        <form action={enroll}>
          <Button type="submit">Enroll in this course</Button>
        </form>
      )}
      {!userId && (
        <Link href="/sign-in">
          <Button>Sign in to enroll</Button>
        </Link>
      )}
      {enrolled && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-4">Lessons</h2>
          <ul className="space-y-2">
            {chapters.map(ch => (
              <li key={ch.id} className="border rounded px-4 py-2 flex justify-between items-center">
                <div>
                  <div className="font-medium">{ch.title}</div>
                  <div className="text-xs text-muted-foreground">{ch.description}</div>
                </div>
                <Link href={`/courses/${courseId}/lessons/${ch.id}`}>
                  <Button size="sm" variant="outline">View</Button>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
