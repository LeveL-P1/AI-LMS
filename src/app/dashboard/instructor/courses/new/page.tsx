import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export default async function NewCoursePage() {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const instructor = await db.user.findUnique({ where: { clerkId: userId } })
  if (!instructor || instructor.role !== 'INSTRUCTOR') redirect('/dashboard')

  async function createCourse(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')

    const course = await db.course.create({
      data: {
        title,
        description,
        instructorId: instructor!.id,
        isPublished: false,
      }
    })

    revalidatePath('/dashboard/instructor/courses')
    redirect(`/dashboard/instructor/courses/${course.id}`)
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create course</h1>
      <form action={createCourse} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input name="title" required className="w-full border rounded px-3 py-2" placeholder="e.g. Learn JavaScript" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" className="w-full border rounded px-3 py-2" placeholder="What students will learn" />
        </div>
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Save</button>
      </form>
    </div>
  )
}
