import React from 'react'

export default function StudentProgressPage() {
	const progress = [
		{ course: 'Intro to Web Development', completed: 13, total: 25 },
		{ course: 'React Basics', completed: 14, total: 18 },
		{ course: 'Machine Learning Intro', completed: 2, total: 20 },
	]

	const totalCompleted = progress.reduce((s, p) => s + p.completed, 0)
	const totalItems = progress.reduce((s, p) => s + p.total, 0)
	const overall = Math.round((totalCompleted / totalItems) * 100)

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">Learning Progress</h1>

			<div className="mb-6">
				<div className="text-sm text-muted-foreground">Overall progress</div>
				<div className="w-full bg-gray-200 rounded h-4 mt-2 overflow-hidden">
					<div className="h-4 bg-green-500" style={{ width: `${overall}%` }} />
				</div>
				<div className="text-sm mt-2">{overall}% complete</div>
			</div>

			<ul className="space-y-3">
				{progress.map((p) => (
					<li key={p.course} className="border rounded p-4">
						<div className="font-medium">{p.course}</div>
						<div className="text-sm text-muted-foreground">{p.completed} of {p.total} items completed</div>
						<div className="w-full bg-gray-200 rounded h-3 mt-2 overflow-hidden">
							<div className="h-3 bg-blue-600" style={{ width: `${Math.round((p.completed / p.total) * 100)}%` }} />
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
