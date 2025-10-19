import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Clock, CheckCircle, TrendingUp } from "lucide-react"
import { UserRole } from "@/types"
import { syncUser } from '@/lib/sync-user'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'

// Mock data - we'll replace this with real API calls later
const mockStudentData = {
  enrolledCourses: 4,
  completedCourses: 2,
  inProgressAssignments: 3,
  upcomingDeadlines: 2,
  recentCourses: [
    {
      id: "1",
      title: "Introduction to React",
      progress: 65,
      instructor: "John Doe",
      nextLesson: "React Hooks",
    },
    {
      id: "2",
      title: "Advanced TypeScript",
      progress: 40,
      instructor: "Jane Smith",
      nextLesson: "Generic Types",
    },
    {
      id: "3",
      title: "Database Design",
      progress: 80,
      instructor: "Mike Johnson",
      nextLesson: "Normalization",
    },
  ],
  upcomingAssignments: [
    {
      id: "1",
      title: "React Component Assignment",
      course: "Introduction to React",
      dueDate: "2024-10-15",
      status: "pending",
    },
    {
      id: "2",
      title: "TypeScript Quiz",
      course: "Advanced TypeScript",
      dueDate: "2024-10-18",
      status: "pending",
    },
  ],
}

export default async function DashboardPage() {

  const clerkUser = await currentUser()
  const userRole = UserRole.STUDENT
  if (!clerkUser) {
    redirect('/sign-in')
    const user = await syncUser()
    if (!user) {
      return (
        <div className="flex min-h-screen items-center justify-center">
          <Card className="w-96">
            <CardHeader>
              <CardTitle>Error</CardTitle>
              <CardDescription>Failed to sync user data</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Please try refreshing the page or contact support.
              </p>
            </CardContent>
          </Card>
        </div>
      )
    }
  }
  return (
    <DashboardLayout userRole={userRole}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Welcome back, Student!</h1>
          <p className="text-muted-foreground mt-2">
            Here&apos;s what&apos;s happening with your learning today
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Enrolled Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStudentData.enrolledCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Active learning paths
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Completed Courses
              </CardTitle>
              <CheckCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStudentData.completedCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Certificates earned
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Assignments Due
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockStudentData.upcomingDeadlines}
              </div>
              <p className="text-xs text-muted-foreground">
                This week
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Progress
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">62%</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockStudentData.recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      Instructor: {course.instructor}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Next: {course.nextLesson}
                    </p>
                    <div className="mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-secondary rounded-full h-2">
                          <div
                            className="bg-primary h-2 rounded-full"
                            style={{ width: `${course.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {course.progress}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button className="ml-4">Continue</Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Assignments</CardTitle>
            <CardDescription>
              Don&apos;t miss these deadlines
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockStudentData.upcomingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{assignment.title}</h4>
                    <p className="text-sm text-muted-foreground">
                      {assignment.course}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      Due: {new Date(assignment.dueDate).toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm" className="mt-2">
                      Start Assignment
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
