import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { Input } from '@/components/common/ui/input'
import { db } from '@/lib/prisma/prisma'
import { redirect } from 'next/navigation'

interface EditCoursePageProps {
	params: { courseId: string }
}

export default async function EditCoursePage({ params }: EditCoursePageProps) {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const course = await db.course.findUnique({
		where: { id: params.courseId },
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

	const updateCourse = async (formData: FormData) => {
		'use server'
		const title = formData.get('title')?.toString()
		const description = formData.get('description')?.toString()

		if (!title || !description) {
			throw new Error('Title and description are required')
		}

		await db.course.update({
			where: { id: params.courseId },
			data: {
				title,
				description,
			},
		})

		redirect(`/instructor/courses/${params.courseId}`)
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<div className="mb-6">
				<Link href={`/instructor/courses/${params.courseId}`}>
					<Button variant="ghost">← Back to Course</Button>
				</Link>
				<h1 className="text-3xl font-bold mt-4">Edit Course</h1>
				<p className="text-muted-foreground mt-2">Update your course information</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Course Information</CardTitle>
					<CardDescription>Edit basic information about your course</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={updateCourse} className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="title" className="block text-sm font-medium">
								Course Title
							</label>
							<Input
								id="title"
								name="title"
								defaultValue={course.title}
								required
								className="w-full"
							/>
						</div>

						<div className="space-y-2">
							<label htmlFor="description" className="block text-sm font-medium">
								Course Description
							</label>
							<textarea
								id="description"
								name="description"
								defaultValue={course.description || ''}
								required
								rows={5}
								className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div className="flex gap-3">
							<Button type="submit" className="bg-blue-600 hover:bg-blue-700">
								Save Changes
							</Button>
							<Link href={`/instructor/courses/${params.courseId}`}>
								<Button type="button" variant="outline">
									Cancel
								</Button>
							</Link>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	)
}
