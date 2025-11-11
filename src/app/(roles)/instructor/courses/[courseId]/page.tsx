import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { db } from '@/lib/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BookOpen, Users, FileText, BarChart3, Edit2 } from 'lucide-react'

interface CourseDetailPageProps {
	params: { courseId: string }
}

export default async function CourseDetailPage({ params }: CourseDetailPageProps) {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const course = await db.course.findUnique({
		where: { id: params.courseId },
		include: {
			instructor: true,
			enrollments: { include: { user: true } },
			_count: { select: { enrollments: true } },
		},
	})

	if (!course) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-2xl font-semibold">Course Not Found</h1>
			</div>
		)
	}

	// Verify instructor owns this course
	if (course.instructorId !== userId) {
		redirect('/unauthorized')
	}

	const recentEnrollments = course.enrollments.slice(-5).reverse()

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<div className="flex items-start justify-between">
				<div>
					<Link href="/instructor/courses">
						<Button variant="ghost" className="mb-4">← Back to Courses</Button>
					</Link>
					<h1 className="text-3xl font-bold">{course.title}</h1>
					<p className="text-muted-foreground mt-2">{course.description}</p>
				</div>
				<Link href={`/instructor/courses/${course.id}/edit`}>
					<Button className="bg-blue-600 hover:bg-blue-700">
						<Edit2 className="h-4 w-4 mr-2" />
						Edit Course
					</Button>
				</Link>
			</div>

			{/* Stats Grid */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center space-x-4">
							<Users className="h-8 w-8 text-blue-600" />
							<div>
								<p className="text-sm text-muted-foreground">Total Enrollments</p>
								<p className="text-2xl font-bold">{course._count.enrollments}</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center space-x-4">
							<BookOpen className="h-8 w-8 text-green-600" />
							<div>
								<p className="text-sm text-muted-foreground">Status</p>
								<p className="text-2xl font-bold">Active</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center space-x-4">
							<FileText className="h-8 w-8 text-purple-600" />
							<div>
								<p className="text-sm text-muted-foreground">Assignments</p>
								<p className="text-2xl font-bold">0</p>
							</div>
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center space-x-4">
							<BarChart3 className="h-8 w-8 text-orange-600" />
							<div>
								<p className="text-sm text-muted-foreground">Avg. Progress</p>
								<p className="text-2xl font-bold">—</p>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Quick Actions */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-3 md:grid-cols-4">
						<Link href={`/instructor/courses/${course.id}/lessons`}>
							<Button variant="outline" className="w-full justify-start">
								<BookOpen className="h-4 w-4 mr-2" />
								Manage Lessons
							</Button>
						</Link>
						<Link href={`/instructor/courses/${course.id}/assignments`}>
							<Button variant="outline" className="w-full justify-start">
								<FileText className="h-4 w-4 mr-2" />
								Assignments
							</Button>
						</Link>
						<Link href={`/instructor/courses/${course.id}/students`}>
							<Button variant="outline" className="w-full justify-start">
								<Users className="h-4 w-4 mr-2" />
								Students
							</Button>
						</Link>
						<Link href="/instructor/analytics">
							<Button variant="outline" className="w-full justify-start">
								<BarChart3 className="h-4 w-4 mr-2" />
								Analytics
							</Button>
						</Link>
					</div>
				</CardContent>
			</Card>

			{/* Recent Enrollments */}
			<Card>
				<CardHeader>
					<CardTitle>Recent Enrollments</CardTitle>
					<CardDescription>Latest students who enrolled in this course</CardDescription>
				</CardHeader>
				<CardContent>
					{recentEnrollments.length === 0 ? (
						<p className="text-sm text-muted-foreground">No enrollments yet</p>
					) : (
						<div className="space-y-3">
							{recentEnrollments.map((enrollment) => (
								<div key={enrollment.id} className="flex items-center justify-between border-b pb-3 last:border-0">
									<div>
										<p className="font-medium">{enrollment.user.name}</p>
										<p className="text-sm text-muted-foreground">{enrollment.user.email}</p>
									</div>
									<p className="text-xs text-muted-foreground">
										{new Date(enrollment.createdAt).toLocaleDateString()}
									</p>
								</div>
							))}
						</div>
					)}
				</CardContent>
			</Card>
		</div>
	)
}
