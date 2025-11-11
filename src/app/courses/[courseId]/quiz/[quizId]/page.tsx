import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'

export default async function TakeQuizPage(props: {
  params: Promise<{ courseId: string; quizId: string }>
}) {
  const { courseId, quizId } = await props.params
  const { userId } = await auth()

  if (!userId) redirect('/sign-in')

  // Quiz feature will be available after database migration
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">Quiz Feature - Coming Soon</h1>
      <p className="text-muted-foreground mb-4">
        Quiz functionality will be available after database setup.
      </p>
      <p className="text-sm">
        Course: {courseId} | Quiz: {quizId}
      </p>
      <p className="text-sm mt-4">
        To enable quizzes, run: <code className="bg-gray-100 px-2 py-1 rounded">npm run db:push</code>
      </p>
    </div>
  )
}
