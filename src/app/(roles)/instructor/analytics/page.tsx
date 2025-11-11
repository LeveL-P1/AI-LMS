import React from 'react'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { db } from '@/lib/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BarChart3, TrendingUp, Users, BookOpen, FileText } from 'lucide-react'

export default async function InstructorAnalyticsPage() {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	// Get instructor's courses
	const instructor = await db.user.findUnique({
		where: { id: userId },
		include: {
			courses: {
				include: {
					enrollments: true,
					_count: { select: { enrollments: true } },
				},
			},
		},
	})

	if (!instructor) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-2xl font-semibold">Analytics</h1>
				<p className="text-sm text-muted-foreground">User not found.</p>
			</div>
		)
	}

	const courses = instructor.courses || []
	const totalStudents = courses.reduce((sum, course) => sum + course._count.enrollments, 0)
	const totalCourses = courses.length

	// Mock analytics data
	const activeStudents = Math.round(totalStudents * 0.85)
	const completionRate = 62
	const avgRating = 4.5

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<div>
				<h1 className="text-3xl font-bold">Analytics Dashboard</h1>
				<p className="text-muted-foreground">Track your teaching performance and student engagement</p>
			</div>

			{/* KPI Cards */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Courses</p>
								<p className="text-3xl font-bold mt-2">{totalCourses}</p>
							</div>
							<BookOpen className="h-8 w-8 text-blue-600 opacity-50" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Students</p>
								<p className="text-3xl font-bold mt-2">{totalStudents}</p>
							</div>
							<Users className="h-8 w-8 text-green-600 opacity-50" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Active Students</p>
								<p className="text-3xl font-bold mt-2">{activeStudents}</p>
							</div>
							<TrendingUp className="h-8 w-8 text-orange-600 opacity-50" />
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Avg. Rating</p>
								<p className="text-3xl font-bold mt-2">{avgRating}</p>
							</div>
							<BarChart3 className="h-8 w-8 text-purple-600 opacity-50" />
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Detailed Analytics */}
			<div className="grid gap-4 md:grid-cols-2">
				<Card>
					<CardHeader>
						<CardTitle>Course Performance</CardTitle>
						<CardDescription>Enrollment and engagement by course</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							{courses.length === 0 ? (
								<p className="text-sm text-muted-foreground">No courses yet</p>
							) : (
								courses.slice(0, 5).map((course) => (
									<div key={course.id} className="space-y-2">
										<div className="flex items-center justify-between">
											<p className="text-sm font-medium line-clamp-1">{course.title}</p>
											<p className="text-sm font-semibold">{course._count.enrollments}</p>
										</div>
										<div className="w-full bg-gray-200 rounded h-2">
											<div
												className="h-2 bg-blue-600 rounded"
												style={{ width: `${Math.min(100, (course._count.enrollments / 50) * 100)}%` }}
											/>
										</div>
									</div>
								))
							)}
						</div>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle>Engagement Metrics</CardTitle>
						<CardDescription>Overall student engagement</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="space-y-4">
							<div>
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm font-medium">Course Completion Rate</p>
									<p className="text-sm font-semibold">{completionRate}%</p>
								</div>
								<div className="w-full bg-gray-200 rounded h-2">
									<div
										className="h-2 bg-green-600 rounded"
										style={{ width: `${completionRate}%` }}
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm font-medium">Student Activity</p>
									<p className="text-sm font-semibold">78%</p>
								</div>
								<div className="w-full bg-gray-200 rounded h-2">
									<div
										className="h-2 bg-orange-600 rounded"
										style={{ width: '78%' }}
									/>
								</div>
							</div>

							<div>
								<div className="flex items-center justify-between mb-2">
									<p className="text-sm font-medium">Assignment Submission Rate</p>
									<p className="text-sm font-semibold">85%</p>
								</div>
								<div className="w-full bg-gray-200 rounded h-2">
									<div
										className="h-2 bg-purple-600 rounded"
										style={{ width: '85%' }}
									/>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>

			{/* Recent Activity */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Insights</CardTitle>
					<CardDescription>Key metrics at a glance</CardDescription>
				</CardHeader>
				<CardContent>
					<ul className="space-y-3">
						<li className="flex items-center space-x-3">
							<FileText className="h-4 w-4 text-blue-600" />
							<span className="text-sm">{totalCourses} active courses with {totalStudents} enrolled students</span>
						</li>
						<li className="flex items-center space-x-3">
							<Users className="h-4 w-4 text-green-600" />
							<span className="text-sm">{activeStudents} students are actively engaging with course content</span>
						</li>
						<li className="flex items-center space-x-3">
							<TrendingUp className="h-4 w-4 text-orange-600" />
							<span className="text-sm">Average student engagement is at a healthy level</span>
						</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}


