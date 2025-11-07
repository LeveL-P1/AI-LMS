import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function LessonViewPage({ params }: { params: { id: string, lessonId: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Get lesson and course
  const lesson = await db.chapter.findUnique({
    where: { id: params.lessonId },
    include: { course: true },
  })
  if (!lesson) return <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId, courseId: lesson.courseId } },
  })
  if (!enrollment) redirect(`/courses/${lesson.courseId}`)

  // Find progress
  const userProgress = await db.userProgress.findUnique({
    where: { userId_chapterId: { userId, chapterId: lesson.id } },
  })
  async function markComplete() {
    'use server'
    await db.userProgress.upsert({
      where: { userId_chapterId: { userId, chapterId: lesson.id } },
      update: { isCompleted: true },
      create: { userId, chapterId: lesson.id, isCompleted: true, timeSpent: 0 },
    })
    redirect(`/courses/${lesson.courseId}/lessons/${lesson.id}`)
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-xl font-bold mb-4">Lesson: {lesson.title}</h1>
      <div className="mb-4 text-muted-foreground">{lesson.description}</div>
      {lesson.content && (
        <div className="mb-4">
          <div className="font-semibold">Content</div>
          <div className="bg-gray-50 p-4 rounded">{lesson.content}</div>
        </div>
      )}
      {lesson.videoUrl && (
        <div className="mb-4">
          <div className="font-semibold mb-2">Video</div>
          <video src={lesson.videoUrl} controls width="100%" className="rounded shadow" />
        </div>
      )}
      {!userProgress?.isCompleted && (
        <form action={markComplete}>
          <Button type="submit">Mark as complete</Button>
        </form>
      )}
      {userProgress?.isCompleted && (
        <div className="text-green-600 font-bold">Completed ✅</div>
      )}
      <div className="mt-6">
        <Link href={`/courses/${lesson.courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
      </div>
    </div>
  )
}
