import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { db } from '@/lib/prisma/prisma'
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Users, Mail, Calendar } from 'lucide-react'

interface StudentsPageProps {
	params: { courseId: string }
}

export default async function CourseStudentsPage({ params }: StudentsPageProps) {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const course = await db.course.findUnique({
		where: { id: params.courseId },
		include: {
			instructor: true,
			enrollments: {
				include: { user: true },
				orderBy: { createdAt: 'desc' },
			},
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

	const enrolledStudents = course.enrollments

	return (
		<div className="max-w-6xl mx-auto p-6 space-y-6">
			<div className="flex items-center justify-between">
				<div>
					<Link href={`/instructor/courses/${params.courseId}`}>
						<Button variant="ghost" className="mb-4">← Back to Course</Button>
					</Link>
					<h1 className="text-3xl font-bold">Enrolled Students</h1>
					<p className="text-muted-foreground">Manage students in: <strong>{course.title}</strong></p>
				</div>
				<div className="text-right">
					<p className="text-sm text-muted-foreground">Total Enrolled</p>
					<p className="text-3xl font-bold">{enrolledStudents.length}</p>
				</div>
			</div>

			{enrolledStudents.length === 0 ? (
				<Card>
					<CardContent className="pt-12 text-center">
						<Users className="mx-auto h-12 w-12 text-muted-foreground mb-3" />
						<p className="text-muted-foreground mb-4">No students enrolled in this course yet.</p>
					</CardContent>
				</Card>
			) : (
				<Card>
					<CardHeader>
						<CardTitle>Student List</CardTitle>
						<CardDescription>All students enrolled in this course</CardDescription>
					</CardHeader>
					<CardContent>
						<div className="overflow-x-auto">
							<table className="w-full">
								<thead>
									<tr className="border-b">
										<th className="text-left py-3 px-4 font-medium">Name</th>
										<th className="text-left py-3 px-4 font-medium">Email</th>
										<th className="text-left py-3 px-4 font-medium">Enrolled Date</th>
										<th className="text-left py-3 px-4 font-medium">Status</th>
										<th className="text-right py-3 px-4 font-medium">Actions</th>
									</tr>
								</thead>
								<tbody>
									{enrolledStudents.map((enrollment) => (
										<tr key={enrollment.id} className="border-b hover:bg-muted/50">
											<td className="py-3 px-4">
												<div>
													<p className="font-medium">{enrollment.user.name}</p>
												</div>
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center space-x-2">
													<Mail className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">{enrollment.user.email}</span>
												</div>
											</td>
											<td className="py-3 px-4">
												<div className="flex items-center space-x-2">
													<Calendar className="h-4 w-4 text-muted-foreground" />
													<span className="text-sm">
														{new Date(enrollment.createdAt).toLocaleDateString()}
													</span>
												</div>
											</td>
											<td className="py-3 px-4">
												<span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
													Active
												</span>
											</td>
											<td className="py-3 px-4 text-right">
												<Button variant="outline" size="sm">
													View Progress
												</Button>
											</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Stats Summary */}
			<Card>
				<CardHeader>
					<CardTitle>Quick Stats</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-3">
						<div>
							<p className="text-sm text-muted-foreground">Total Students</p>
							<p className="text-2xl font-bold">{enrolledStudents.length}</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Avg. Engagement</p>
							<p className="text-2xl font-bold">—</p>
						</div>
						<div>
							<p className="text-sm text-muted-foreground">Completion Rate</p>
							<p className="text-2xl font-bold">—</p>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	)
}
