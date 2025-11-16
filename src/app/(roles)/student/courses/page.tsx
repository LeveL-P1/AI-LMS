import React from 'react'
import { db } from '@/lib/prisma/prisma'

type Enrolled = {
	id: string
	title: string
	instructorName?: string | null
	progress: number
}

export default async function StudentCoursesPage() {
	// For demo/workflow: pick the first student in the DB as the "current" student
	const student = await db.user.findFirst({ where: { role: 'STUDENT' } })
	if (!student) {
		return (
			<div className="max-w-4xl mx-auto p-6">
				<h1 className="text-2xl font-semibold">My Courses</h1>
				<p className="text-sm text-muted-foreground">No student user found in the database.</p>
			</div>
		)
	}

	const enrollments = await db.enrollment.findMany({
		where: { userId: student.id },
		include: { Course: { include: { instructor: true } } },
	})

	const actions = await db.userAction.findMany({ where: { userId: student.id } })

const enrolled: Enrolled[] = enrollments.map((e) => {
		const course = e.Course
		// derive a crude progress metric from user actions that reference this course
		const seen = actions.filter((a) => ((a.metadata as Record<string, any>)?.courseId as string) === course.id).length
		const progress = Math.min(100, Math.round((seen / 10) * 100))
		return {
			id: course.id,
			title: course.title,
			instructorName: course.instructor ? `${course.instructor.firstName || ''} ${course.instructor.lastName || ''}`.trim() || null : null,
			progress,
		}
	})

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">My Courses</h1>

			<div className="grid gap-4">
				{enrolled.length === 0 && (
					<div className="text-sm text-muted-foreground">You are not enrolled in any courses.</div>
				)}

				{enrolled.map((course) => (
					<div key={course.id} className="border rounded p-4 flex items-center justify-between">
						<div>
							<div className="font-medium">{course.title}</div>
							<div className="text-sm text-muted-foreground">Instructor: {course.instructorName ?? '—'}</div>
						</div>
						<div className="w-48">
							<div className="text-sm text-muted-foreground mb-1">Progress</div>
							<div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
								<div className="h-3 bg-blue-600" style={{ width: `${course.progress}%` }} />
							</div>
							<div className="text-sm mt-1">{course.progress}%</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

