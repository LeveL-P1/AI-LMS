import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import Link from 'next/link'

export default async function StudentAssignmentsPage() {
	const { userId } = await auth()
	if (!userId) redirect('/sign-in')

	const student = await db.user.findUnique({ where: { clerkId: userId } })
	if (!student) redirect('/onboarding')

	const submissions = await db.assignmentSubmission.findMany({
		where: { userId: student.id },
		include: { assignment: true },
		orderBy: { submittedAt: 'desc' }
	})

	return (
		<div className="max-w-3xl mx-auto p-6 space-y-6">
			<h1 className="text-2xl font-semibold">My Assignments</h1>
			{submissions.length === 0 && (
				<div className="text-sm text-muted-foreground">You have no submissions yet.</div>
			)}

			<ul className="space-y-3">
				{submissions.map(s => (
					<li key={s.id} className="border rounded p-4">
						<div className="font-medium">{s.assignment?.title || 'Assignment'}</div>
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

