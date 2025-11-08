import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma/prisma'
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

    if (title.trim().length === 0 || title.length > 100) {
      throw new Error('Title is required and must be under 100 characters')
    }

    if (description.length > 500) {
      throw new Error('Description must be under 500 characters')
    }

    try {
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
    } catch (error) {
      console.error('Create course failed:', error)
      throw new Error('Failed to create course')
    }
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Create course</h1>
      <form action={createCourse} className="space-y-4">
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input name="title" required maxLength={100} className="w-full border rounded px-3 py-2" placeholder="e.g. Learn JavaScript" />
        </div>
        <div>
          <label className="block text-sm mb-1">Description</label>
          <textarea name="description" maxLength={500} className="w-full border rounded px-3 py-2" placeholder="What students will learn" />
        </div>
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Save</button>
      </form>
    </div>
  )
}


