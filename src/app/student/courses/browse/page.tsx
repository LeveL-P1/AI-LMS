// ============================================
// FILE: src/app/courses/browse/page.tsx
// ============================================
import { syncUser } from '@/lib/sync-user'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Clock, Search } from 'lucide-react'
import Link from 'next/link'
import { db as prisma } from '@/lib/prisma'

async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      where: {
        isPublished: true,
      },
      include: {
        instructor: {
          select: {
            firstName: true,
            lastName: true,
            imageUrl: true,
          },
        },
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        _count: {
          select: {
            enrollments: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return courses
  } catch (error) {
    console.error('Error fetching courses:', error)
    return []
  }
}

export default async function BrowseCoursesPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/sign-in')
  }

  const dbUser = await syncUser()

  if (!dbUser) {
    redirect('/sign-in')
  }

  const courses = await getCourses()

  return (
    <DashboardLayout userRole={dbUser.role as any}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Browse Courses</h1>
          <p className="text-muted-foreground mt-2">
            Discover new courses and expand your knowledge
          </p>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search courses..."
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            <Button variant="outline">All Categories</Button>
          </div>
        </div>

        {/* Course Grid */}
        {courses.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No courses available</h3>
              <p className="text-muted-foreground text-center">
                Check back later for new courses
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const instructorName = `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() || 'Instructor'
              const chapterCount = course.chapters.length
              const studentCount = course._count.enrollments

              return (
                <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg bg-muted">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                      </div>
                    )}
                    {course.category && (
                      <Badge className="absolute top-2 right-2 bg-primary">
                        {course.category.name}
                      </Badge>
                    )}
                  </div>
                  
                  <CardHeader>
                    <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                    <CardDescription className="line-clamp-2">
                      {course.description || 'No description available'}
                    </CardDescription>
                  </CardHeader>

                  <CardContent className="flex-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      {course.instructor.imageUrl ? (
                        <img
                          src={course.instructor.imageUrl}
                          alt={instructorName}
                          className="h-6 w-6 rounded-full"
                        />
                      ) : (
                        <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-medium">
                            {instructorName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <span>{instructorName}</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <BookOpen className="h-4 w-4" />
                        <span>{chapterCount} {chapterCount === 1 ? 'chapter' : 'chapters'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{studentCount}</span>
                      </div>
                    </div>
                  </CardContent>

                  <CardFooter className="flex justify-between items-center">
                    <span className="text-lg font-bold">
                      {course.price && course.price > 0 
                        ? `$${course.price.toFixed(2)}` 
                        : 'Free'}
                    </span>
                    <Link href={`/courses/${course.id}`}>
                      <Button>View Course</Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}