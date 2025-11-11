import React from 'react'

export default function StudentAssignmentsPage() {
	const submissions = [
		{ id: 's1', title: 'Build a React Todo App', submittedAt: '2025-11-05T12:34:00Z', status: 'Graded', grade: 92, feedback: 'Great job!' , fileUrl: '#'},
		{ id: 's2', title: 'Next.js Blog Project', submittedAt: '2025-10-28T09:00:00Z', status: 'Pending', grade: null, feedback: null, fileUrl: null },
	]

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">My Assignments</h1>
			{submissions.length === 0 && (
				<div className="text-sm text-muted-foreground">You have no submissions yet.</div>
			)}

			<ul className="space-y-3">
				{submissions.map((s) => (
					<li key={s.id} className="border rounded p-4">
						<div className="font-medium">{s.title}</div>
						<div className="text-sm text-muted-foreground">Submitted: {new Date(s.submittedAt).toLocaleString()}</div>
						<div className="mt-2">Status: {s.status}</div>
						{s.grade != null && <div>Grade: {s.grade}</div>}
						{s.feedback && <div className="text-sm text-muted-foreground">Feedback: {s.feedback}</div>}
						{s.fileUrl && (
							<div className="mt-2">
								<a href={s.fileUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download submission</a>
							</div>
						)}
					</li>
				))}
			</ul>
		</div>
	)
}



