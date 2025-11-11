import React from 'react'

export default function StudentQuizzesPage() {
	const quizzes = [
		{ id: 'q1', title: 'React Fundamentals Quiz', score: 84, max: 100, date: '2025-11-01' },
		{ id: 'q2', title: 'Next.js App Router Quiz', score: 72, max: 100, date: '2025-10-21' },
		{ id: 'q3', title: 'Python Data Science Quiz', score: null, max: 100, date: null },
	]

	return (
		<div className="max-w-4xl mx-auto p-6">
			<h1 className="text-2xl font-semibold mb-4">My Quizzes</h1>

			<ul className="space-y-3">
				{quizzes.map((q) => (
					<li key={q.id} className="border rounded p-4 flex items-center justify-between">
						<div>
							<div className="font-medium">{q.title}</div>
							<div className="text-sm text-muted-foreground">Taken: {q.date ?? 'Not taken'}</div>
						</div>
						<div className="text-right">
							{q.score != null ? (
								<div>
									<div className="text-lg font-semibold">{q.score}/{q.max}</div>
									<div className="text-sm text-muted-foreground">{Math.round((q.score / q.max) * 100)}%</div>
								</div>
							) : (
								<div className="text-sm text-blue-600">Not attempted — <a href="#" className="underline">Start quiz</a></div>
							)}
						</div>
					</li>
				))}
			</ul>
		</div>
	)
}
