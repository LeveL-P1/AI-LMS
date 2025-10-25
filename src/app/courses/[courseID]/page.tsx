import { syncUser } from '@/lib/sync-user'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { BookOpen, Users, Clock, Star, PlayCircle, FileText, Award, CheckCircle } from 'lucide-react'
import { UserRole } from "@/types"
// Mock course detail - later from database
const mockCourseDetail = {
    id: "1",
    title: "Introduction to React",
    description: "Learn the fundamentals of React and build modern web applications. This comprehensive course covers everything from basic concepts to advanced patterns.",
    longDescription: "This course is designed for developers who want to master React. You'll learn about components, props, state, hooks, routing, and much more. By the end of this course, you'll be able to build production-ready React applications.",
    instructor: {
        name: "John Doe",
        bio: "Senior Software Engineer with 10+ years of experience in web development",
        image: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        students: 15000,
        courses: 12,
        rating: 4.8,
    },
    students: 1245,
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    reviews: 342,
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    price: "Free",
    category: "Web Development",
    enrolled: false, // We'll check this from database later

    whatYouWillLearn: [
        "Build modern React applications from scratch",
        "Understand React components and props",
        "Master React Hooks and state management",
        "Work with React Router for navigation",
        "Implement forms and handle user input",
        "Deploy React applications to production",
    ],

    requirements: [
        "Basic knowledge of HTML, CSS, and JavaScript",
        "A computer with internet connection",
        "Code editor (VS Code recommended)",
    ],

    curriculum: [
        {
            title: "Getting Started with React",
            lessons: 5,
            duration: "1 hour 30 mins",
            lectures: [
                "Introduction to React",
                "Setting up development environment",
                "Your first React component",
                "Understanding JSX",
                "Props and component composition",
            ],
        },
        {
            title: "React Fundamentals",
            lessons: 8,
            duration: "3 hours",
            lectures: [
                "State and useState Hook",
                "Event handling in React",
                "Conditional rendering",
                "Lists and keys",
                "Forms in React",
                "useEffect Hook",
                "Custom Hooks",
                "Context API",
            ],
        },
        {
            title: "Advanced React Concepts",
            lessons: 6,
            duration: "2 hours 30 mins",
            lectures: [
                "React Router basics",
                "API integration",
                "Performance optimization",
                "Error boundaries",
                "Code splitting",
                "Testing React applications",
            ],
        },
        {
            title: "Building a Real Project",
            lessons: 4,
            duration: "2 hours",
            lectures: [
                "Project planning and setup",
                "Building the UI",
                "Adding functionality",
                "Deployment",
            ],
        },
    ],
}

export default async function CourseDetailPage({
    params,
}: {
    params: { courseId: string }
}) {
    const clerkUser = await currentUser()

    if (!clerkUser) {
        redirect('/sign-in')
    }

    const dbUser = await syncUser()

    if (!dbUser) {
        redirect('/sign-in')
    }

    const course = mockCourseDetail // Later: fetch from database using params.courseId

    return (
        <DashboardLayout userRole={UserRole.STUDENT}>
            <div className="space-y-6">
                {/* Course Header */}
                <div className="relative h-64 w-full overflow-hidden rounded-lg">
                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="h-full w-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                        <Badge className="mb-2">{course.category}</Badge>
                        <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                        <p className="text-lg mb-3">{course.description}</p>
                        <div className="flex items-center gap-4 text-sm">
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="font-medium">{course.rating}</span>
                                <span>({course.reviews} reviews)</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Users className="h-4 w-4" />
                                <span>{course.students.toLocaleString()} students</span>
                            </div>
                            <Badge variant="secondary">{course.level}</Badge>
                        </div>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* What You'll Learn */}
                        <Card>
                            <CardHeader>
                                <CardTitle>What you&apos;ll learn</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid gap-3 md:grid-cols-2">
                                    {course.whatYouWillLearn.map((item, index) => (
                                        <div key={index} className="flex items-start gap-2">
                                            <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                                            <span className="text-sm">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Course Content */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Course Content</CardTitle>
                                <CardDescription>
                                    {course.curriculum.length} sections • {" "}
                                    {course.curriculum.reduce((acc, section) => acc + section.lessons, 0)} lectures
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {course.curriculum.map((section, index) => (
                                    <div key={index} className="border rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="font-semibold">{section.title}</h3>
                                            <span className="text-sm text-muted-foreground">
                                                {section.lessons} lectures • {section.duration}
                                            </span>
                                        </div>
                                        <div className="space-y-2">
                                            {section.lectures.map((lecture, lectureIndex) => (
                                                <div
                                                    key={lectureIndex}
                                                    className="flex items-center gap-2 text-sm text-muted-foreground pl-2"
                                                >
                                                    <PlayCircle className="h-4 w-4" />
                                                    <span>{lecture}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </CardContent>
                        </Card>

                        {/* Requirements */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Requirements</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {course.requirements.map((req, index) => (
                                        <li key={index} className="flex items-start gap-2">
                                            <span className="text-primary mt-1">•</span>
                                            <span className="text-sm">{req}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>

                        {/* Description */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <p className="text-muted-foreground">{course.longDescription}</p>
                            </CardContent>
                        </Card>

                        {/* Instructor */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Instructor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-4">
                                    <img
                                        src={course.instructor.image}
                                        alt={course.instructor.name}
                                        className="h-20 w-20 rounded-full"
                                    />
                                    <div className="flex-1">
                                        <h3 className="text-xl font-semibold mb-1">
                                            {course.instructor.name}
                                        </h3>
                                        <p className="text-sm text-muted-foreground mb-3">
                                            {course.instructor.bio}
                                        </p>
                                        <div className="flex items-center gap-4 text-sm">
                                            <div className="flex items-center gap-1">
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span>{course.instructor.rating} rating</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                <span>{course.instructor.students.toLocaleString()} students</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <BookOpen className="h-4 w-4" />
                                                <span>{course.instructor.courses} courses</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <Card className="sticky top-6">
                            <CardContent className="p-6 space-y-4">
                                <div className="text-center">
                                    <div className="text-3xl font-bold mb-2">{course.price}</div>
                                </div>

                                <Button className="w-full" size="lg">
                                    {course.enrolled ? 'Go to Course' : 'Enroll Now'}
                                </Button>

                                <Separator />

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Level</span>
                                        <span className="font-medium">{course.level}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Duration</span>
                                        <span className="font-medium">{course.duration}</span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Lectures</span>
                                        <span className="font-medium">
                                            {course.curriculum.reduce((acc, section) => acc + section.lessons, 0)}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Students</span>
                                        <span className="font-medium">
                                            {course.students.toLocaleString()}
                                        </span>
                                    </div>
                                </div>

                                <Separator />

                                <div className="space-y-2">
                                    <h4 className="font-semibold text-sm">This course includes:</h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <PlayCircle className="h-4 w-4 text-primary" />
                                            <span>Video lectures</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span>Downloadable resources</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-primary" />
                                            <span>Certificate of completion</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-primary" />
                                            <span>Lifetime access</span>
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </DashboardLayout>
    )
}