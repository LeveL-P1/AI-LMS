'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { BookOpen, Plus, Users, BarChart3, TrendingUp, Clock } from 'lucide-react'

export default function InstructorPage() {
	// Mock data - in production this would come from the server
	const stats = {
		totalCourses: 3,
		totalStudents: 45,
		averageRating: 4.5,
		activeCourses: 2,
	}

	const recentCourses = [
		{
			id: '1',
			title: 'React Fundamentals',
			students: 23,
			status: 'Active',
		},
		{
			id: '2',
			title: 'Advanced JavaScript',
			students: 18,
			status: 'Active',
		},
		{
			id: '3',
			title: 'Web Design Basics',
			students: 4,
			status: 'Draft',
		},
	]

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-4xl font-bold">Instructor Dashboard</h1>
					<p className="text-muted-foreground mt-2">Welcome back! Here&apos;s an overview of your teaching activities.</p>
				</div>
				<Link href="/instructor/courses/create">
					<Button className="bg-blue-600 hover:bg-blue-700">
						<Plus className="h-4 w-4 mr-2" />
						New Course
					</Button>
				</Link>
			</div>

			{/* Key Stats */}
			<div className="grid gap-4 md:grid-cols-4">
				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Courses</p>
								<p className="text-3xl font-bold mt-2">{stats.totalCourses}</p>
							</div>
							<BookOpen className="h-10 w-10 text-blue-100" />
						</div>
						<Link href="/instructor/courses" className="text-sm text-blue-600 hover:underline mt-4 block">
							View all courses →
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Total Students</p>
								<p className="text-3xl font-bold mt-2">{stats.totalStudents}</p>
							</div>
							<Users className="h-10 w-10 text-green-100" />
						</div>
						<Link href="/instructor/students" className="text-sm text-green-600 hover:underline mt-4 block">
							Manage students →
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Avg. Rating</p>
								<p className="text-3xl font-bold mt-2">{stats.averageRating}</p>
							</div>
							<TrendingUp className="h-10 w-10 text-yellow-100" />
						</div>
						<Link href="/instructor/analytics" className="text-sm text-yellow-600 hover:underline mt-4 block">
							See analytics →
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardContent className="pt-6">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-sm text-muted-foreground">Active Courses</p>
								<p className="text-3xl font-bold mt-2">{stats.activeCourses}</p>
							</div>
							<Clock className="h-10 w-10 text-purple-100" />
						</div>
						<p className="text-xs text-muted-foreground mt-4">Actively teaching</p>
					</CardContent>
				</Card>
			</div>

			{/* Recent Courses */}
			<Card>
				<CardHeader className="flex items-center justify-between">
					<div>
						<CardTitle>Your Courses</CardTitle>
						<CardDescription>Latest courses you&apos;re teaching</CardDescription>
					</div>
					<Link href="/instructor/courses">
						<Button variant="outline" size="sm">View All</Button>
					</Link>
				</CardHeader>
				<CardContent>
					<div className="space-y-4">
						{recentCourses.map((course) => (
							<Link key={course.id} href={`/instructor/courses/${course.id}`} className="block">
								<div className="border rounded-lg p-4 hover:bg-muted transition-colors">
									<div className="flex items-center justify-between">
										<div>
											<h3 className="font-semibold">{course.title}</h3>
											<p className="text-sm text-muted-foreground mt-1">
												{course.students} students enrolled
											</p>
										</div>
										<div className="flex items-center gap-3">
											<span className={`px-3 py-1 rounded-full text-xs font-medium ${
												course.status === 'Active'
													? 'bg-green-100 text-green-800'
													: 'bg-gray-100 text-gray-800'
											}`}>
												{course.status}
											</span>
											<Button variant="ghost" size="sm">
												Manage →
											</Button>
										</div>
									</div>
								</div>
							</Link>
						))}
					</div>
				</CardContent>
			</Card>

			{/* Quick Actions */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Quick Actions</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Link href="/instructor/courses/create">
							<Button variant="outline" className="w-full justify-start">
								<Plus className="h-4 w-4 mr-2" />
								Create New Course
							</Button>
						</Link>
						<Link href="/instructor/courses">
							<Button variant="outline" className="w-full justify-start">
								<BookOpen className="h-4 w-4 mr-2" />
								Manage Courses
							</Button>
						</Link>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Student Management</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Link href="/instructor/students">
							<Button variant="outline" className="w-full justify-start">
								<Users className="h-4 w-4 mr-2" />
								View All Students
							</Button>
						</Link>
						<Button variant="outline" className="w-full justify-start" disabled>
							<Users className="h-4 w-4 mr-2" />
							Send Announcement
						</Button>
					</CardContent>
				</Card>

				<Card>
					<CardHeader>
						<CardTitle className="text-lg">Analytics & Reports</CardTitle>
					</CardHeader>
					<CardContent className="space-y-2">
						<Link href="/instructor/analytics">
							<Button variant="outline" className="w-full justify-start">
								<BarChart3 className="h-4 w-4 mr-2" />
								View Analytics
							</Button>
						</Link>
						<Button variant="outline" className="w-full justify-start" disabled>
							<BarChart3 className="h-4 w-4 mr-2" />
							Export Report
						</Button>
					</CardContent>
				</Card>
			</div>

			{/* Upcoming Deadlines */}
			<Card>
				<CardHeader>
					<CardTitle>Upcoming Deadlines</CardTitle>
					<CardDescription>Important dates to remember</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="space-y-3">
						<div className="flex items-center gap-4 p-3 border rounded-lg">
							<Clock className="h-5 w-5 text-orange-600 shrink-0" />
							<div className="flex-1">
								<p className="font-medium">Assignment: Build a Todo App</p>
								<p className="text-sm text-muted-foreground">Due on Nov 20, 2025</p>
							</div>
						</div>
						<div className="flex items-center gap-4 p-3 border rounded-lg">
							<Clock className="h-5 w-5 text-orange-600 shrink-0" />
							<div className="flex-1">
								<p className="font-medium">Course Review Deadline</p>
								<p className="text-sm text-muted-foreground">Due on Nov 25, 2025</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
