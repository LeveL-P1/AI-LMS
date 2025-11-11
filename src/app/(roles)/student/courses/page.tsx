import React from 'react'

export default function StudentCoursesPage() {
	const enrolled = [
		{ id: 'c1', title: 'Intro to Web Development', instructor: 'Alice Instructor', progress: 52 },
		{ id: 'c2', title: 'React Basics', instructor: 'Bob Instructor', progress: 78 },
		{ id: 'c3', title: 'Machine Learning Intro', instructor: 'Carla Instructor', progress: 12 },
	]

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">My Courses</h1>

			<div className="grid gap-4">
				{enrolled.map((course) => (
					<div key={course.id} className="border rounded p-4 flex items-center justify-between">
						<div>
							<div className="font-medium">{course.title}</div>
							<div className="text-sm text-muted-foreground">Instructor: {course.instructor}</div>
						</div>
						<div className="w-48">
							<div className="text-sm text-muted-foreground mb-1">Progress</div>
							<div className="w-full bg-gray-200 rounded h-3 overflow-hidden">
								<div
									className="h-3 bg-blue-600"
									style={{ width: `${course.progress}%` }}
								/>
							</div>
							<div className="text-sm mt-1">{course.progress}%</div>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}
