import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/ui/card'
import { Button } from '@/components/common/ui/button'
import { Users, BookOpen, GraduationCap, Settings, BarChart3, Shield } from 'lucide-react'

export default async function AdminDashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get admin data and platform statistics
  const user = await db.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user || user.role !== 'ADMIN') {
    redirect('/unauthorized')
  }

  // Get platform statistics
  const [totalUsers, totalCourses, totalEnrollments, totalQuizzes] = await Promise.all([
    db.user.count(),
    db.course.count(),
    db.enrollment.count(),
    db.quiz.count()
  ])

  const students = await db.user.count({ where: { role: 'STUDENT' } })
  const instructors = await db.user.count({ where: { role: 'INSTRUCTOR' } })
  const publishedCourses = await db.course.count({ where: { isPublished: true } })
  
  // Get recent users
  const recentUsers = await db.user.findMany({
    take: 5,
    orderBy: { createdAt: 'desc' },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  })

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard 🛑
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Welcome, {user.firstName}! Manage the SkillSyncAI platform.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalUsers}</div>
              <p className="text-xs text-muted-foreground">
                {students} students, {instructors} instructors
              </p>
            </CardContent>
          </Card>

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
              <CardTitle className="text-sm font-medium">Total Enrollments</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalEnrollments}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Quizzes</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalQuizzes}</div>
              <p className="text-xs text-muted-foreground">Assessment activities</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Platform Overview */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Platform Overview</CardTitle>
              <CardDescription>Key metrics and recent activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* User Growth */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">User Distribution</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-blue-600">Students</span>
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                      </div>
                      <div className="text-2xl font-bold text-blue-900">{students}</div>
                      <div className="text-xs text-blue-600">
                        {totalUsers > 0 ? Math.round((students / totalUsers) * 100) : 0}% of total
                      </div>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-green-600">Instructors</span>
                        <Users className="h-4 w-4 text-green-600" />
                      </div>
                      <div className="text-2xl font-bold text-green-900">{instructors}</div>
                      <div className="text-xs text-green-600">
                        {totalUsers > 0 ? Math.round((instructors / totalUsers) * 100) : 0}% of total
                      </div>
                    </div>
                  </div>
                </div>

                {/* Course Statistics */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-3">Course Statistics</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-gray-900">{totalCourses}</div>
                        <div className="text-xs text-gray-600">Total Courses</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-green-600">{publishedCourses}</div>
                        <div className="text-xs text-gray-600">Published</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-orange-600">{totalCourses - publishedCourses}</div>
                        <div className="text-xs text-gray-600">Draft</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Admin Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Admin Actions</CardTitle>
              <CardDescription>Platform management tools</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button className="w-full justify-start" variant="outline">
                <Users className="h-4 w-4 mr-2" />
                Manage Users
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BookOpen className="h-4 w-4 mr-2" />
                Manage Courses
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <BarChart3 className="h-4 w-4 mr-2" />
                Platform Analytics
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Settings className="h-4 w-4 mr-2" />
                System Settings
              </Button>
              <Button className="w-full justify-start" variant="outline">
                <Shield className="h-4 w-4 mr-2" />
                Security & Permissions
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

