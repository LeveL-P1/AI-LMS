import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { db } from '@/lib/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Users, BookOpen, Settings } from 'lucide-react'

export default async function InstructorCoursesPage() {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	// Get the instructor user
	const instructor = await db.user.findUnique({
		where: { id: userId },
		include: { courses: { include: { _count: { select: { enrollments: true } } } } },
	})

	if (!instructor) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-2xl font-semibold">My Courses</h1>
				<p className="text-sm text-muted-foreground">User not found.</p>
			</div>
		)
	}

	const courses = instructor.courses || []

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">My Courses</h1>
					<p className="text-muted-foreground">Manage your courses and track student progress</p>
				</div>
				<Link href="/instructor/courses/create">
					<Button className="bg-blue-600 hover:bg-blue-700">
						+ Create New Course
					</Button>
				</Link>
			</div>

			{courses.length === 0 ? (
				<Card>
					<CardContent className="pt-12 text-center">
						<BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
						<p className="text-muted-foreground mb-4">You haven&apos;t created any courses yet.</p>
						<Link href="/instructor/courses/create">
							<Button variant="outline">Create Your First Course</Button>
						</Link>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
					{courses.map((course) => (
						<Card key={course.id} className="hover:shadow-lg transition-shadow">
							<CardHeader>
								<CardTitle className="line-clamp-2">{course.title}</CardTitle>
								<CardDescription className="line-clamp-2">{course.description}</CardDescription>
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="flex items-center gap-2 text-sm">
									<Users className="h-4 w-4 text-muted-foreground" />
									<span>{course._count?.enrollments ?? 0} students enrolled</span>
								</div>
								<div className="flex gap-2">
									<Link href={`/instructor/courses/${course.id}`} className="flex-1">
										<Button variant="outline" className="w-full">View</Button>
									</Link>
									<Link href={`/instructor/courses/${course.id}/edit`} className="flex-1">
										<Button variant="outline" className="w-full">
											<Settings className="h-4 w-4 mr-2" />
											Edit
										</Button>
									</Link>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}
		</div>
	)
}



