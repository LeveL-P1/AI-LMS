import { auth } from '@clerk/nextjs/server'
import { db } from '@/lib/prisma/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'

export default async function LessonViewPage(props: any) {
  const { params } = props as { params: { courseId: string; lessonId: string } }
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  // Get lesson and course
  const lesson = await db.chapter.findUnique({
    where: { id: params.lessonId },
    include: { course: true },
  })
  if (!lesson) return <div className="p-8 text-center text-muted-foreground">Lesson not found.</div>

  // Capture primitive IDs for server actions (avoid closing over full `lesson` object)
  const lessonId = lesson.id
  const courseId = lesson.courseId

  // Narrow userId for later server actions
  const uid = userId as string

  // Check enrollment
  const enrollment = await db.enrollment.findUnique({
    where: { userId_courseId: { userId: uid, courseId } },
  })
  if (!enrollment) redirect(`/courses/${courseId}`)

  // Find progress
  const userProgress = await db.userProgress.findUnique({
    where: { userId_chapterId: { userId: uid, chapterId: lessonId } },
  })

  async function markComplete() {
    'use server'
    try {
      await db.userProgress.upsert({
        where: { userId_chapterId: { userId: uid, chapterId: lessonId } },
        update: { isCompleted: true },
        create: { userId: uid, chapterId: lessonId, isCompleted: true, timeSpent: 0 },
      })
      redirect(`/courses/${courseId}/lessons/${lessonId}`)
    } catch (error) {
      console.error('Mark complete failed:', error)
      throw new Error('Failed to mark lesson complete')
    }
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
        <Link href={`/courses/${courseId}`}>
          <Button variant="outline">Back to course</Button>
        </Link>
      </div>
    </div>
  )
}
