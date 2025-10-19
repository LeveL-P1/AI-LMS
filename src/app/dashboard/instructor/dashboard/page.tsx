// "use client"

// import { DashboardLayout } from "@/components/layout/dashboard-layout"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Button } from "@/components/ui/button"
// import { BookOpen, Users, FileText, TrendingUp, PlusCircle } from "lucide-react"
// import { UserRole } from "@/types"
// import Link from "next/link"

// // Mock data for instructor
// const mockInstructorData = {
//   totalCourses: 6,
//   totalStudents: 142,
//   activeAssignments: 8,
//   averageRating: 4.7,
//   recentCourses: [
//     {
//       id: "1",
//       title: "Introduction to React",
//       students: 45,
//       progress: "Active",
//       lastUpdated: "2024-10-05",
//     },
//     {
//       id: "2",
//       title: "Advanced TypeScript",
//       students: 32,
//       progress: "Active",
//       lastUpdated: "2024-10-03",
//     },
//     {
//       id: "3",
//       title: "Database Design",
//       students: 28,
//       progress: "Active",
//       lastUpdated: "2024-10-01",
//     },
//   ],
//   recentActivity: [
//     {
//       id: "1",
//       type: "submission",
//       student: "Alice Johnson",
//       course: "Introduction to React",
//       action: "submitted an assignment",
//       time: "2 hours ago",
//     },
//     {
//       id: "2",
//       type: "enrollment",
//       student: "Bob Smith",
//       course: "Advanced TypeScript",
//       action: "enrolled in course",
//       time: "4 hours ago",
//     },
//     {
//       id: "3",
//       type: "question",
//       student: "Carol White",
//       course: "Database Design",
//       action: "asked a question",
//       time: "1 day ago",
//     },
//   ],
// }

// export default function InstructorDashboardPage() {
//   const userRole = UserRole.INSTRUCTOR

//   return (
//     <DashboardLayout userRole={userRole}>
//       <div className="space-y-6">
//         {/* Header */}
//         <div className="flex items-center justify-between">
//           <div>
//             <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
//             <p className="text-muted-foreground mt-2">
//               Manage your courses and track student progress
//             </p>
//           </div>
//           <Link href="/instructor/courses/create">
//             <Button>
//               <PlusCircle className="mr-2 h-4 w-4" />
//               Create Course
//             </Button>
//           </Link>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Courses
//               </CardTitle>
//               <BookOpen className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {mockInstructorData.totalCourses}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Active courses
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Students
//               </CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {mockInstructorData.totalStudents}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Across all courses
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Active Assignments
//               </CardTitle>
//               <FileText className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {mockInstructorData.activeAssignments}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 Pending grading
//               </p>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Average Rating
//               </CardTitle>
//               <TrendingUp className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {mockInstructorData.averageRating}
//               </div>
//               <p className="text-xs text-muted-foreground">
//                 From student feedback
//               </p>
//             </CardContent>
//           </Card>
//         </div>

//         {/* Your Courses */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Your Courses</CardTitle>
//             <CardDescription>
//               Manage and monitor your active courses
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {mockInstructorData.recentCourses.map((course) => (
//                 <div
//                   key={course.id}
//                   className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
//                 >
//                   <div>
//                     <h3 className="font-semibold">{course.title}</h3>
//                     <p className="text-sm text-muted-foreground">
//                       {course.students} enrolled students
//                     </p>
//                     <p className="text-sm text-muted-foreground">
//                       Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
//                     </p>
//                   </div>
//                   <div className="flex space-x-2">
//                     <Button variant="outline">View</Button>
//                     <Button>Manage</Button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>

//         {/* Recent Activity */}
//         <Card>
//           <CardHeader>
//             <CardTitle>Recent Activity</CardTitle>
//             <CardDescription>
//               Latest updates from your courses
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-3">
//               {mockInstructorData.recentActivity.map((activity) => (
//                 <div
//                   key={activity.id}
//                   className="flex items-start space-x-4 p-3 border rounded-lg"
//                 >
//                   <div className="flex-1">
//                     <p className="text-sm">
//                       <span className="font-medium">{activity.student}</span>{" "}
//                       {activity.action} in{" "}
//                       <span className="font-medium">{activity.course}</span>
//                     </p>
//                     <p className="text-xs text-muted-foreground mt-1">
//                       {activity.time}
//                     </p>
//                   </div>
//                   <Button variant="ghost" size="sm">
//                     View
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </DashboardLayout>
//   )
// }


import { syncUser } from '@/lib/sync-user'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { BookOpen, Users, FileText, TrendingUp, PlusCircle } from 'lucide-react'
import Link from 'next/link'
import { UserRole } from '@/types'

// Mock data for instructor
const mockInstructorData = {
  totalCourses: 6,
  totalStudents: 142,
  activeAssignments: 8,
  averageRating: 4.7,
  recentCourses: [
    {
      id: "1",
      title: "Introduction to React",
      students: 45,
      progress: "Active",
      lastUpdated: "2024-10-05",
    },
    {
      id: "2",
      title: "Advanced TypeScript",
      students: 32,
      progress: "Active",
      lastUpdated: "2024-10-03",
    },
    {
      id: "3",
      title: "Database Design",
      students: 28,
      progress: "Active",
      lastUpdated: "2024-10-01",
    },
  ],
  recentActivity: [
    {
      id: "1",
      type: "submission",
      student: "Alice Johnson",
      course: "Introduction to React",
      action: "submitted an assignment",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "enrollment",
      student: "Bob Smith",
      course: "Advanced TypeScript",
      action: "enrolled in course",
      time: "4 hours ago",
    },
    {
      id: "3",
      type: "question",
      student: "Carol White",
      course: "Database Design",
      action: "asked a question",
      time: "1 day ago",
    },
  ],
}

export default async function InstructorDashboardPage() {
  const clerkUser = await currentUser()
  
  if (!clerkUser) {
    redirect('/sign-in')
  }

  const dbUser = await syncUser()

  if (!dbUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>Failed to sync user data</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  // Check if user is instructor
  if (dbUser.role !== 'INSTRUCTOR') {
    redirect('/dashboard')
  }
  

  return (
    <DashboardLayout userRole={UserRole.INSTRUCTOR}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Instructor Dashboard</h1>
            <p className="text-muted-foreground mt-2">
              Manage your courses and track student progress
            </p>
          </div>
          <Link href="/instructor/courses/create">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create Course
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Courses
              </CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockInstructorData.totalCourses}
              </div>
              <p className="text-xs text-muted-foreground">
                Active courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Students
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockInstructorData.totalStudents}
              </div>
              <p className="text-xs text-muted-foreground">
                Across all courses
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Assignments
              </CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockInstructorData.activeAssignments}
              </div>
              <p className="text-xs text-muted-foreground">
                Pending grading
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Rating
              </CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockInstructorData.averageRating}
              </div>
              <p className="text-xs text-muted-foreground">
                From student feedback
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Your Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Your Courses</CardTitle>
            <CardDescription>
              Manage and monitor your active courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockInstructorData.recentCourses.map((course) => (
                <div
                  key={course.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent transition-colors"
                >
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {course.students} enrolled students
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Last updated: {new Date(course.lastUpdated).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <Button variant="outline">View</Button>
                    <Button>Manage</Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Latest updates from your courses
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockInstructorData.recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start space-x-4 p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="text-sm">
                      <span className="font-medium">{activity.student}</span>{" "}
                      {activity.action} in{" "}
                      <span className="font-medium">{activity.course}</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {activity.time}
                    </p>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}