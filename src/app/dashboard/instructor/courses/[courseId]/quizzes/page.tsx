import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function QuizListPage(props: any) {
  const { params } = props as { params: { courseId: string } }
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const course = await db.course.findFirst({
    where: { id: params.courseId, instructor: { clerkId: userId } },
    include: { quizzes: true }
  })

  if (!course) redirect('/dashboard/instructor')

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Quizzes • {course.title}</h1>
        <Link href={`/dashboard/instructor/courses/${course.id}/quizzes/new`}>
          <Button>Create quiz</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Existing quizzes</CardTitle>
          <CardDescription>Manage and add questions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {course.quizzes.length === 0 && (
              <p className="text-sm text-muted-foreground">No quizzes yet.</p>
            )}
            {course.quizzes.map(q => (
              <div key={q.id} className="flex items-center justify-between border rounded-md p-3">
                <div>
                  <div className="font-medium">{q.title}</div>
                  {q.description && <div className="text-sm text-muted-foreground">{q.description}</div>}
                </div>
                <div className="flex items-center gap-2">
                  <Link href={`/dashboard/instructor/courses/${course.id}/quizzes/${q.id}`}>
                    <Button variant="outline" size="sm">Questions</Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}