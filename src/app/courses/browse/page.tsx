import { syncUser } from '@/lib/sync-user'
import { redirect } from 'next/navigation'
import { currentUser } from '@clerk/nextjs/server'
import { DashboardLayout } from '@/components/layout/dashboard-layout'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Users, Clock, Star, Search } from 'lucide-react'
import { UserRole } from '@/types'
import Link from 'next/link'

// Mock courses data - later will fetching from database
const mockCourses = [
    {
        id: "1",
        title: "Introduction to React",
        description: "Learn the fundamentals of React and build modern web applications",
        instructor: "John Doe",
        instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=John",
        students: 1245,
        duration: "8 weeks",
        level: "Beginner",
        rating: 4.8,
        reviews: 342,
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=250&fit=crop",
        price: "Free",
        category: "Web Development",
    },
    {
        id: "2",
        title: "Advanced TypeScript",
        description: "Master TypeScript with advanced patterns and best practices",
        instructor: "Jane Smith",
        instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Jane",
        students: 892,
        duration: "6 weeks",
        level: "Advanced",
        rating: 4.9,
        reviews: 218,
        thumbnail: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=400&h=250&fit=crop",
        price: "Free",
        category: "Programming",
    },
    {
        id: "3",
        title: "Database Design Fundamentals",
        description: "Learn database design principles, SQL, and normalization techniques",
        instructor: "Mike Johnson",
        instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mike",
        students: 756,
        duration: "5 weeks",
        level: "Intermediate",
        rating: 4.7,
        reviews: 189,
        thumbnail: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=400&h=250&fit=crop",
        price: "Free",
        category: "Database",
    },
    {
        id: "4",
        title: "UI/UX Design Principles",
        description: "Create beautiful and user-friendly interfaces with modern design",
        instructor: "Sarah Williams",
        instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
        students: 1089,
        duration: "7 weeks",
        level: "Beginner",
        rating: 4.9,
        reviews: 421,
        thumbnail: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
        price: "Free",
        category: "Design",
    },
    {
        id: "5",
        title: "Python for Data Science",
        description: "Analyze data and build machine learning models with Python",
        instructor: "David Brown",
        instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=David",
        students: 2134,
        duration: "10 weeks",
        level: "Intermediate",
        rating: 4.8,
        reviews: 567,
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=400&h=250&fit=crop",
        price: "Free",
        category: "Data Science",
    },
    {
        id: "6",
        title: "Mobile App Development",
        description: "Build cross-platform mobile apps with React Native",
        instructor: "Emily Davis",
        instructorImage: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
        students: 1567,
        duration: "9 weeks",
        level: "Intermediate",
        rating: 4.7,
        reviews: 398,
        thumbnail: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=250&fit=crop",
        price: "Free",
        category: "Mobile Development",
    },
]

export default async function BrowseCoursesPage() {
    const clerkUser = await currentUser()

    if (!clerkUser) {
        redirect('/sign-in')
    }

    const dbUser = await syncUser()

    if (!dbUser) {
        redirect('/sign-in')
    }

    return (
        <DashboardLayout userRole={UserRole.STUDENT}>
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
                        <Button variant="outline">All Levels</Button>
                        <Button variant="outline">All Categories</Button>
                    </div>
                </div>

                {/* Course Grid */}
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {mockCourses.map((course) => (
                        <Card key={course.id} className="flex flex-col hover:shadow-lg transition-shadow">
                            <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                    className="h-full w-full object-cover"
                                />
                                <Badge className="absolute top-2 right-2 bg-primary">
                                    {course.level}
                                </Badge>
                            </div>

                            <CardHeader>
                                <div className="flex items-center justify-between mb-2">
                                    <Badge variant="secondary">{course.category}</Badge>
                                    <div className="flex items-center gap-1">
                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                        <span className="text-sm font-medium">{course.rating}</span>
                                        <span className="text-sm text-muted-foreground">
                                            ({course.reviews})
                                        </span>
                                    </div>
                                </div>
                                <CardTitle className="line-clamp-2">{course.title}</CardTitle>
                                <CardDescription className="line-clamp-2">
                                    {course.description}
                                </CardDescription>
                            </CardHeader>

                            <CardContent className="flex-1">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                                    <img
                                        src={course.instructorImage}
                                        alt={course.instructor}
                                        className="h-6 w-6 rounded-full"
                                    />
                                    <span>{course.instructor}</span>
                                </div>

                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Users className="h-4 w-4" />
                                        <span>{course.students.toLocaleString()}</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Clock className="h-4 w-4" />
                                        <span>{course.duration}</span>
                                    </div>
                                </div>
                            </CardContent>

                            <CardFooter className="flex justify-between items-center">
                                <span className="text-lg font-bold">{course.price}</span>
                                <Link href={`/courses/${course.id}`}>
                                    <Button>View Course</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </DashboardLayout>
    )
}
