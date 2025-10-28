import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, BarChart3, Plus } from 'lucide-react'

export default async function InstructorDashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get instructor data and created courses
  const user = await db.user.findUnique({
    where: { clerkId: userId },
    include: {
      createdCourses: {
        include: {
          enrollments: true,
          chapters: true,
          quizzes: true
        }
      }
    }
  })

  if (!user) {
    redirect('/onboarding')
  }

  const totalCourses = user.createdCourses.length
  const publishedCourses = user.createdCourses.filter(course => course.isPublished).length
  const totalStudents = user.createdCourses.reduce((sum, course) => sum + course.enrollments.length, 0)
  const totalChapters = user.createdCourses.reduce((sum, course) => sum + course.chapters.length, 0)

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Instructor Dashboard 🎯
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Welcome back, {user.firstName}! Manage your courses and track student progress.
            </p>
          </div>
          <Button className="bg-green-600 hover:bg-green-700">
            <Plus className="h-4 w-4 mr-2" />
            Create New Course
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCourses}</div>
              <p className="text-xs text-muted-foreground">
                {publishedCourses} published
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalStudents}</div>
              <p className="text-xs text-muted-foreground">Across all courses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Chapters</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalChapters}</div>
              <p className="text-xs text-muted-foreground">Content created</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">New enrollments</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Your Courses */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Your Courses</CardTitle>
              <CardDescription>Manage and track your course performance</CardDescription>
            </CardHeader>
            <CardContent>
              {user.createdCourses.length > 0 ? (
                <div className="space-y-4">
                  {user.createdCourses.slice(0, 5).map((course) => (
                    <div key={course.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold">{course.title}</h3>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            course.isPublished 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {course.isPublished ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {course.enrollments.length} students • {course.chapters.length} chapters
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">Edit</Button>
                        <Button variant="outline" size="sm">Analytics</Button>
                      </div>
                    </div>
                  ))}
                  {user.createdCourses.length > 5 && (
                    <Button variant="outline" className="w-full">
                      View All Courses ({user.createdCourses.length})
                    </Button>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Create Your First Course
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Share your knowledge and help students learn new skills
                  </p>
                  <Button className="bg-green-600 hover:bg-green-700">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Course
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common instructor tasks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Courses
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                View Students
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}