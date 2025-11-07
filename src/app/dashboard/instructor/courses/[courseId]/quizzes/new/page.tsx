import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export default async function NewQuizPage(props: any) {
  const { params } = props as { params: { courseId: string } }
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const course = await db.course.findFirst({
    where: { id: params.courseId, instructor: { clerkId: userId } },
  })
  if (!course) redirect('/dashboard/instructor')

  const courseId = course.id

  async function createQuiz(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')

    await db.quiz.create({
      data: {
        title,
        description,
        courseId: courseId,
        isPublished: false,
      }
    })

    revalidatePath(`/dashboard/instructor/courses/${courseId}/quizzes`)
    redirect(`/dashboard/instructor/courses/${courseId}/quizzes`)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create quiz</h1>
      <form action={createQuiz} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input name="title" required className="w-full border rounded px-3 py-2" placeholder="e.g. JavaScript Basics" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" className="w-full border rounded px-3 py-2" placeholder="Short description" />
        </div>
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Save</button>
      </form>
    </div>
  )
}
