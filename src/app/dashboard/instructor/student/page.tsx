import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma/prisma'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/common/ui/card'
import { Button } from '@/components/common/ui/button'
import { BookOpen, Trophy, Users, TrendingUp } from 'lucide-react'

export default async function StudentDashboard() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  // Get user data - simplified for now
  const user = await db.user.findUnique({
    where: { id: userId }, // Will need to migrate to clerkId
  })

  if (!user) {
    redirect('/onboarding')
  }

  // Fetch enrolled courses
  const enrollments = await db.enrollment.findMany({
    where: { userId: user.id },
  })

  const enrolledCourses = enrollments.length
  const completedQuizzes = 0 // Will query from DB later
  const averageScore = 0 // Will query from DB later

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name || 'Student'}! 🎓
          </h1>
          <p className="text-lg text-gray-600 mt-2">
            Continue your learning journey with SkillSyncAI
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{enrolledCourses}</div>
              <p className="text-xs text-muted-foreground">Active enrollments</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Quizzes Completed</CardTitle>
              <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{completedQuizzes}</div>
              <p className="text-xs text-muted-foreground">Total attempts</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{averageScore.toFixed(1)}%</div>
              <p className="text-xs text-muted-foreground">Across all quizzes</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Learning Streak</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Days in a row</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Continue Learning */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Continue Learning</CardTitle>
              <CardDescription>Pick up where you left off</CardDescription>
            </CardHeader>
            <CardContent>
              {enrolledCourses > 0 ? (
                <div className="space-y-4">
                  <div className="text-center py-8 text-gray-500">
                    <p>Courses will appear here</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    No courses yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Start your learning journey by enrolling in a course
                  </p>
                  <Button>Browse Courses</Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle>AI Recommendations</CardTitle>
              <CardDescription>Courses picked just for you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <div className="animate-pulse">
                  <div className="w-12 h-12 bg-linear-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-white font-bold">AI</span>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  AI Learning Soon!
                </h3>
                <p className="text-gray-600 text-sm">
                  Our AI will analyze your learning style and recommend personalized courses.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

