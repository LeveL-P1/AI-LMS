import { db } from '@/lib/prisma'
import Link from 'next/link'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default async function CourseCatalogPage() {
  const courses = await db.course.findMany({
    where: { isPublished: true },
    include: { instructor: true },
    orderBy: { createdAt: 'desc' }
  })

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Browse Courses</h1>
      <div className="grid gap-4 md:grid-cols-2">
        {courses.length === 0 && (
          <p className="text-muted-foreground">No courses published yet.</p>
        )}
        {courses.map(c => (
          <Link key={c.id} href={`/courses/${c.id}`} className="hover:bg-accent border rounded-md p-4 block">
            <div className="font-medium text-lg">{c.title}</div>
            <div className="text-sm text-muted-foreground mb-2">By {c.instructor?.firstName} {c.instructor?.lastName}</div>
            <div className="text-xs text-muted-foreground">{c.description}</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
