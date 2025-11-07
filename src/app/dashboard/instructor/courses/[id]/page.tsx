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
    include: { chapters: { orderBy: { position: 'asc' } } },
  })

  if (!course) redirect('/dashboard/instructor/courses')

  async function addLesson(formData: FormData) {
    'use server'
    const title = String(formData.get('title') || '')
    const description = String(formData.get('description') || '')
    const videoUrl = String(formData.get('videoUrl') || '')

    if (title.trim().length === 0 || title.length > 100) {
      throw new Error('Lesson title required and must be under 100 chars')
    }

    if (description.length > 1000) {
      throw new Error('Lesson description must be under 1000 chars')
    }

    if (videoUrl && !videoUrl.startsWith('http')) {
      throw new Error('Video URL must be valid')
    }

    const position = course.chapters.length > 0 ? course.chapters[course.chapters.length - 1].position + 1 : 1

    await db.chapter.create({
      data: {
        title,
        description,
        videoUrl,
        position,
        courseId: course.id,
        isPublished: false,
      },
    })

    redirect(`/dashboard/instructor/courses/${course.id}`)
  }

  async function togglePublish() {
    'use server'
    await db.course.update({
      where: { id: course.id },
      data: { isPublished: !course.isPublished },
    })

    redirect(`/dashboard/instructor/courses/${course.id}`)
  }

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
          <form action={togglePublish}>
            <Button className="mt-2" type="submit">
              {course.isPublished ? 'Unpublish Course' : 'Publish Course'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lessons</CardTitle>
          <CardDescription>Add and manage lessons</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="mb-4 space-y-2">
            {course.chapters.map(chapter => (
              <li key={chapter.id} className="border rounded-md p-3">
                <div className="font-medium">{chapter.title}</div>
                <div className="text-sm text-muted-foreground">{chapter.description}</div>
                {chapter.videoUrl && (
                  <a href={chapter.videoUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
                    Watch video
                  </a>
                )}
              </li>
            ))}
          </ul>

          <form action={addLesson} className="space-y-4 border rounded-md p-4">
            <div>
              <label className="block text-sm mb-1">Title</label>
              <input name="title" required maxLength={100} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Description</label>
              <textarea name="description" maxLength={1000} className="w-full border rounded px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm mb-1">Video URL (optional)</label>
              <input name="videoUrl" className="w-full border rounded px-3 py-2" placeholder="https://youtube.com/..." />
            </div>
            <button className="px-4 py-2 rounded bg-black text-white" type="submit">Add Lesson</button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
