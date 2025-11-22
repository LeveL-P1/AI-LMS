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
  Bell,
  DollarSign,
  MessageSquare,
  BarChart3,
  Plus
} from "lucide-react"

const sidebarItems = [
  { icon: Home, label: "Dashboard", href: "/dashboard/instructor", active: true },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/instructor/courses" },
  { icon: Users, label: "Students", href: "/dashboard/instructor/students" },
  { icon: BarChart3, label: "Analytics", href: "/dashboard/instructor/analytics" },
  { icon: Calendar, label: "Schedule", href: "/dashboard/instructor/schedule" },
  { icon: MessageSquare, label: "Messages", href: "/dashboard/instructor/messages" },
  { icon: DollarSign, label: "Earnings", href: "/dashboard/instructor/earnings" },
  { icon: Settings, label: "Settings", href: "/dashboard/instructor/settings" },
]

const myCourses = [
  {
    id: 1,
    title: "Advanced React Patterns",
    students: 245,
    rating: 4.8,
    revenue: "$12,450",
    status: "published",
    nextClass: "Today, 3:00 PM",
    thumbnail: "react"
  },
  {
    id: 2,
    title: "Machine Learning Fundamentals",
    students: 189,
    rating: 4.9,
    revenue: "$9,890",
    status: "published",
    nextClass: "Tomorrow, 2:00 PM",
    thumbnail: "ml"
  },
  {
    id: 3,
    title: "UI/UX Design Principles",
    students: 156,
    rating: 4.7,
    revenue: "$7,230",
    status: "draft",
    nextClass: "Dec 26, 4:00 PM",
    thumbnail: "design"
  }
]

const recentActivity = [
  {
    id: 1,
    type: "enrollment",
    message: "15 new students enrolled in Advanced React Patterns",
    time: "2 hours ago",
    icon: Users
  },
  {
    id: 2,
    type: "review",
    message: "Sarah left a 5-star review for ML Fundamentals",
    time: "4 hours ago",
    icon: Star
  },
  {
    id: 3,
    type: "assignment",
    message: "32 assignments submitted for React course",
    time: "6 hours ago",
    icon: FileText
  },
  {
    id: 4,
    type: "question",
    message: "8 new questions in course discussion forums",
    time: "1 day ago",
    icon: MessageSquare
  }
]

const upcomingClasses = [
  {
    id: 1,
    title: "React Hooks Deep Dive",
    course: "Advanced React Patterns",
    time: "Today, 3:00 PM",
    students: 45,
    duration: "1 hour"
  },
  {
    id: 2,
    title: "Neural Networks Workshop",
    course: "Machine Learning Fundamentals",
    time: "Tomorrow, 2:00 PM",
    students: 38,
    duration: "1.5 hours"
  },
  {
    id: 3,
    title: "Design Systems Masterclass",
    course: "UI/UX Design Principles",
    time: "Dec 26, 4:00 PM",
    students: 28,
    duration: "2 hours"
  }
]

export default function InstructorDashboard() {
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
            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold">SkillSyncAI</h1>
              <p className="text-sm text-gray-600">Instructor Portal</p>
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
                      ? 'bg-purple-50 text-purple-600 border-l-4 border-purple-600' 
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              </motion.div>
            ))}
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Rocket className="h-4 w-4 text-purple-600" />
              <span className="text-sm font-semibold text-purple-900">Create Course</span>
            </div>
            <p className="text-xs text-gray-700 mb-3">
              Share your expertise and earn money by creating new courses.
            </p>
            <Button size="sm" className="w-full bg-gradient-to-r from-purple-600 to-pink-600">
              <Plus className="h-3 w-3 mr-1" />
              New Course
            </Button>
          </div>
        </div>

        <div className="p-6 border-t border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
              <User className="h-4 w-4 text-gray-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Sarah Johnson</p>
              <p className="text-xs text-gray-600">sarah@skillsyncai.com</p>
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
                <h1 className="text-3xl font-bold text-gray-900">Welcome back, Sarah!</h1>
                <p className="text-gray-600 mt-1">Manage your courses and engage with students</p>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="outline" size="sm">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Messages
                  <Badge className="ml-2 bg-red-500">3</Badge>
                </Button>
                <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Course
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
              { label: "Total Students", value: "590", icon: Users, color: "from-purple-500 to-purple-600", change: "+45 this month" },
              { label: "Active Courses", value: "12", icon: BookOpen, color: "from-blue-500 to-blue-600", change: "+2 new" },
              { label: "Total Revenue", value: "$29,570", icon: DollarSign, color: "from-green-500 to-green-600", change: "+$4,230 this month" },
              { label: "Avg Rating", value: "4.8", icon: Star, color: "from-yellow-500 to-yellow-600", change: "Excellent!" }
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
            {/* My Courses */}
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    My Courses
                    <Button variant="outline" size="sm">
                      Manage All
                      <ArrowRight className="h-4 w-4 ml-1" />
                    </Button>
                  </CardTitle>
                  <CardDescription>Overview of your teaching courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {myCourses.map((course, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-center space-x-4 p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center">
                        <BookOpen className="h-8 w-8 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-semibold text-gray-900">{course.title}</h3>
                          <Badge variant={course.status === 'published' ? 'default' : 'secondary'}>
                            {course.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span className="flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {course.students} students
                          </span>
                          <span className="flex items-center">
                            <Star className="h-3 w-3 mr-1 text-yellow-500" />
                            {course.rating}
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="h-3 w-3 mr-1" />
                            {course.revenue}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Next class: {course.nextClass}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="h-full">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>Latest updates from your courses</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {recentActivity.map((activity, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="flex items-start space-x-3 p-3 rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                        <activity.icon className="h-4 w-4 text-purple-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Upcoming Classes */}
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Classes</CardTitle>
                <CardDescription>Your scheduled live sessions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingClasses.map((classItem, index) => (
                    <motion.div
                      key={index}
                      whileHover={{ scale: 1.05, y: -5 }}
                      className="p-4 rounded-lg border border-gray-200 hover:border-purple-200 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="outline" className="text-xs">
                          <Calendar className="h-3 w-3 mr-1" />
                          {classItem.time}
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {classItem.duration}
                        </Badge>
                      </div>
                      <h3 className="font-semibold text-gray-900 mb-1">{classItem.title}</h3>
                      <p className="text-sm text-gray-600 mb-2">{classItem.course}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 flex items-center">
                          <Users className="h-3 w-3 mr-1" />
                          {classItem.students} students
                        </span>
                        <Button size="sm" variant="outline">
                          Join
                        </Button>
                      </div>
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
