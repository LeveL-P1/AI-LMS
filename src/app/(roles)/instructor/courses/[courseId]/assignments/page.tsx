import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { db } from '@/lib/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { FileText, Plus, CheckCircle, Clock } from 'lucide-react'

interface AssignmentsPageProps {
	params: { courseId: string }
}

export default async function CourseAssignmentsPage({ params }: AssignmentsPageProps) {
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

	// Mock data for assignments
	const assignments = [
		{
			id: '1',
			title: 'Build a Todo App',
			dueDate: '2025-11-20',
			submissions: 12,
			graded: 8,
			pending: 4,
		},
		{
			id: '2',
			title: 'React Hooks Project',
			dueDate: '2025-11-25',
			submissions: 8,
			graded: 2,
			pending: 6,
		},
	]

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Link href={`/instructor/courses/${params.courseId}`}>
						<Button variant="ghost" className="mb-4">← Back to Course</Button>
					</Link>
					<h1 className="text-3xl font-bold">Assignments</h1>
					<p className="text-muted-foreground">Manage assignments for: <strong>{course.title}</strong></p>
				</div>
				<Button className="bg-blue-600 hover:bg-blue-700">
					<Plus className="h-4 w-4 mr-2" />
					Create Assignment
				</Button>
			</div>

			{assignments.length === 0 ? (
				<Card>
					<CardContent className="pt-12 text-center">
						<FileText className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
						<p className="text-muted-foreground mb-4">No assignments created yet.</p>
						<Button variant="outline">Create Your First Assignment</Button>
					</CardContent>
				</Card>
			) : (
				<div className="grid gap-4">
					{assignments.map((assignment) => (
						<Card key={assignment.id} className="hover:shadow-lg transition-shadow">
							<CardContent className="pt-6">
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<h3 className="text-lg font-semibold">{assignment.title}</h3>
										<p className="text-sm text-muted-foreground mt-1">
											Due: {new Date(assignment.dueDate).toLocaleDateString()}
										</p>
									</div>
									<Button variant="outline" size="sm">View Details</Button>
								</div>

								<div className="mt-4 grid grid-cols-3 gap-4">
									<div className="flex items-center space-x-3">
										<FileText className="h-5 w-5 text-blue-600" />
										<div>
											<p className="text-xs text-muted-foreground">Total Submissions</p>
											<p className="text-lg font-semibold">{assignment.submissions}</p>
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<CheckCircle className="h-5 w-5 text-green-600" />
										<div>
											<p className="text-xs text-muted-foreground">Graded</p>
											<p className="text-lg font-semibold">{assignment.graded}</p>
										</div>
									</div>
									<div className="flex items-center space-x-3">
										<Clock className="h-5 w-5 text-orange-600" />
										<div>
											<p className="text-xs text-muted-foreground">Pending</p>
											<p className="text-lg font-semibold">{assignment.pending}</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			{/* Feature Info */}
			<Card>
				<CardHeader>
					<CardTitle>Assignment Management</CardTitle>
					<CardDescription>Create and grade student assignments</CardDescription>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground mb-3">
						Manage all assignments for this course including:
					</p>
					<ul className="space-y-2 text-sm text-muted-foreground">
						<li>✓ Create assignments with due dates</li>
						<li>✓ View student submissions</li>
						<li>✓ Grade assignments with feedback</li>
						<li>✓ Track submission status</li>
					</ul>
				</CardContent>
			</Card>
		</div>
	)
}
