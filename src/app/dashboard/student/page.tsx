/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { motion } from "framer-motion"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  BookOpen, 
  Brain, 
  ChartBar, 
  Clock, 
  Code, 
  GraduationCap, 
  Laptop, 
  PlayCircle, 
  Users, 
  Zap,
  ArrowRight,
  CheckCircle,
  Star,
  Award,
  Target,
  Lightbulb,
  Rocket,
  Shield,
  Globe,
  Calendar,
  TrendingUp,
  FileText,
  Video,
  Download,
  Settings,
  LogOut,
  Home,
  BookMarked,
  User,
  Bell
} from "lucide-react"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/student", active: true },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/student/courses" },
  { icon: BookMarked, label: "Assignments", href: "/dashboard/student/assignments" },
  { icon: ChartBar, label: "Progress", href: "/dashboard/student/progress" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/student/schedule" },
  { icon: Users, label: "Community", href: "/dashboard/student/community" },
  { icon: Settings, label: "Settings", href: "/dashboard/student/settings" },
]

const recentCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    progress: 78,
    nextLesson: "Custom Hooks Deep Dive",
    instructor: "Sarah Johnson",
    thumbnail: "react",
    duration: "4h 30m",
    difficulty: "Advanced"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    progress: 45,
    nextLesson: "Neural Networks Basics",
    instructor: "Dr. Michael Chen",
    thumbnail: "ml",
    duration: "6h 15m",
    difficulty: "Intermediate"
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    progress: 92,
    nextLesson: "Final Project Review",
    instructor: "Emma Williams",
    thumbnail: "design",
    duration: "3h 45m",
    difficulty: "Beginner"
  }
]

const upcomingAssignments = [
  {
    id: 1,
    title: "React Hooks Implementation",
    course: "Advanced React Patterns",
    dueDate: "Dec 25, 2024",
    priority: "high",
    type: "Coding"
  },
  {
    id: 2,
    title: "ML Model Evaluation",
    course: "Machine Learning Fundamentals",
    dueDate: "Dec 28, 2024",
    priority: "medium",
    type: "Research"
  },
  {
    id: 3,
    title: "Design Portfolio Update",
    course: "UI/UX Design Principles",
    dueDate: "Dec 30, 2024",
    priority: "low",
    type: "Project"
  }
]

const achievements = [
  { icon: Award, title: "Fast Learner", description: "Complete 5 courses in one month", unlocked: true },
  { icon: Star, title: "Code Master", description: "Submit 10 coding assignments", unlocked: true },
  { icon: Users, title: "Team Player", description: "Help 5 fellow students", unlocked: false },
  { icon: Target, title: "Goal Crusher", description: "Achieve all monthly goals", unlocked: false }
]

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Left Sidebar */}
      <motion.aside 
        initial={{ x: -300, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 bg-white border-r border-gray-200 shadow-sm"
      >
        <div className="p-6">
          <div className="flex items-center space-x-3 mb-8">
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">SkillSyncAI</h1>
              <p className="text-sm text-gray-600">Student Portal</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Link
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                    item.active 
                      ? 'bg-blue-50 text-blue-600 border-l-4 border-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Zap className="h-4 w-4 text-blue-600" />
              <span className="text-sm font-semibold text-blue-900">Pro Tip</span>
            </div>
            <p className="text-xs text-gray-700">
              Set daily learning goals to maintain consistency and track your progress effectively!
            </p>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Alex Johnson</p>
              <p className="text-xs text-gray-600">alex@skillsyncai.com</p>
            </div>
            <Button variant="ghost" size="sm">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Right Content Area */}
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <motion.div 
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, Alex!</h1>
                <p className="text-gray-600 mt-1">Continue your learning journey today</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <Bell className="h-4 w-4 mr-2" />
                  Notifications
                </Button>
                <Button size="sm">
                  <PlayCircle className="h-4 w-4 mr-2" />
                  Browse Courses
                </Button>
              </div>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            {[
              { label: "Courses Enrolled", value: "12", icon: BookOpen, color: "from-blue-500 to-blue-600", change: "+2 this month" },
              { label: "Completed", value: "8", icon: CheckCircle, color: "from-green-500 to-green-600", change: "+1 this week" },
              { label: "Learning Streak", value: "15 days", icon: TrendingUp, color: "from-purple-500 to-purple-600", change: "Personal best!" },
              { label: "Total Hours", value: "124", icon: Clock, color: "from-orange-500 to-orange-600", change: "+8.5 this week" }
            ].map((stat, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05, y: -5 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-10 w-10 rounded-lg bg-gradient-to-r ${stat.color} flex items-center justify-center`}>
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {stat.change}
                  </Badge>
                </div>
                <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Courses */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Recent Courses
                    <Button variant="outline" size="sm">
                      View All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                  <CardDescription>Continue learning from your enrolled courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentCourses.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-blue-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{course.title}</h3>
                        <p className="text-sm text-gray-600">{course.instructor}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline" className="text-xs">{course.difficulty}</Badge>
                          <span className="text-xs text-gray-500">{course.duration}</span>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900 mb-1">
                          {course.progress}% Complete
                        </div>
                        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${course.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                            className="h-full bg-gradient-to-r from-blue-500 to-purple-600"
                          />
                        </div>
                        <p className="text-xs text-gray-600 mt-1">Next: {course.nextLesson}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Upcoming Assignments */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Upcoming Assignments</CardTitle>
                  <CardDescription>Don&apos;t miss these deadlines</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {upcomingAssignments.map((assignment, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-lg border border-gray-200 hover:border-red-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-900 text-sm">{assignment.title}</h4>
                        <Badge 
                          variant={assignment.priority === 'high' ? 'destructive' : assignment.priority === 'medium' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {assignment.priority}
                        </Badge>
                      </div>
                      <p className="text-xs text-gray-600 mb-2">{assignment.course}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center text-xs text-gray-500">
                          <Calendar className="h-3 w-3 mr-1" />
                          {assignment.dueDate}
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {assignment.type}
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Achievements Section */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
                <CardDescription>Your learning milestones and badges</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {achievements.map((achievement, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, rotate: achievement.unlocked ? 0 : 5 }}
                      className={`p-4 rounded-lg border text-center transition-all ${
                        achievement.unlocked 
                          ? 'border-yellow-200 bg-yellow-50' 
                          : 'border-gray-200 bg-gray-50 opacity-60'
                      }`}
                    >
                      <div className={`h-12 w-12 rounded-full mx-auto mb-2 flex items-center justify-center ${
                        achievement.unlocked 
                          ? 'bg-gradient-to-r from-yellow-400 to-yellow-600' 
                          : 'bg-gray-300'
                      }`}>
                        <achievement.icon className={`h-6 w-6 ${achievement.unlocked ? 'text-white' : 'text-gray-500'}`} />
                      </div>
                      <h3 className={`font-semibold text-sm mb-1 ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                        {achievement.title}
                      </h3>
                      <p className="text-xs text-gray-600">{achievement.description}</p>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
