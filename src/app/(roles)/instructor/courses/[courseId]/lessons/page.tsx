import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { db } from '@/lib/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { BookOpen, Plus } from 'lucide-react'

interface LessonsPageProps {
	params: { courseId: string }
}

export default async function CourseLessonsPage({ params }: LessonsPageProps) {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const course = await db.course.findUnique({
		where: { id: params.courseId },
		include: { instructor: true },
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

	return (
		<div className="max-w-4xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Link href={`/instructor/courses/${params.courseId}`}>
						<Button variant="ghost" className="mb-4">← Back to Course</Button>
					</Link>
					<h1 className="text-3xl font-bold">Manage Lessons</h1>
					<p className="text-muted-foreground">Organize lessons for: <strong>{course.title}</strong></p>
				</div>
				<Button className="bg-blue-600 hover:bg-blue-700">
					<Plus className="h-4 w-4 mr-2" />
					Add Lesson
				</Button>
			</div>

			<Card>
				<CardContent className="pt-12 text-center">
					<BookOpen className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
					<p className="text-muted-foreground mb-4">No lessons created yet.</p>
					<Button variant="outline">Create Your First Lesson</Button>
				</CardContent>
			</Card>

			{/* Coming Soon: Lessons List */}
			<Card>
				<CardHeader>
					<CardTitle>Lesson Management</CardTitle>
					<CardDescription>Add and organize lessons for this course</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground">
						Lessons management feature will be available soon. You&apos;ll be able to:
					</p>
					<ul className="mt-4 space-y-2 text-sm text-muted-foreground">
						<li>✓ Create and edit lessons</li>
						<li>✓ Set lesson order and duration</li>
						<li>✓ Add lesson content and resources</li>
						<li>✓ Track student progress per lesson</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
