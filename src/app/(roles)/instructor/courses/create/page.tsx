import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/common/ui/button'
import { Card, CardHeader, CardContent, CardTitle, CardDescription } from '@/components/common/ui/card'
import { Input } from '@/components/common/ui/input'
import { db } from '@/lib/prisma/prisma'
import { redirect } from 'next/navigation'

export default async function CreateCoursePage() {
	const { userId } = await auth()

	if (!userId) {
		redirect('/sign-in')
	}

	const createCourse = async (formData: FormData) => {
		'use server'
		const title = formData.get('title')?.toString()
		const description = formData.get('description')?.toString()

		if (!title || !description) {
			throw new Error('Title and description are required')
		}

		const course = await db.course.create({
			data: {
				title,
				description,
				instructorId: userId,
			},
		})

		redirect(`/instructor/courses/${course.id}`)
	}

	return (
		<div className="max-w-2xl mx-auto p-6">
			<div className="mb-6">
				<Link href="/instructor/courses">
					<Button variant="ghost">← Back to Courses</Button>
				</Link>
				<h1 className="text-3xl font-bold mt-4">Create New Course</h1>
				<p className="text-muted-foreground mt-2">Start creating your course. You can add more details later.</p>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Course Information</CardTitle>
					<CardDescription>Provide basic information about your course</CardDescription>
				</CardHeader>
				<CardContent>
					<form action={createCourse} className="space-y-6">
						<div className="space-y-2">
							<label htmlFor="title" className="block text-sm font-medium">
								Course Title
							</label>
							<Input
								id="title"
								name="title"
								placeholder="e.g., Introduction to React"
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
								placeholder="Describe what students will learn in this course..."
								required
								rows={5}
								className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
							/>
						</div>

						<div className="flex gap-3">
							<Button type="submit" className="bg-blue-600 hover:bg-blue-700">
								Create Course
							</Button>
							<Link href="/instructor/courses">
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
