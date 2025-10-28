import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export default async function TakeQuizPage({ params }: { params: { courseId: string, quizId: string } }) {
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const quiz = await db.quiz.findFirst({
    where: { id: params.quizId, courseId: params.courseId, isPublished: true },
    include: { questions: true, course: true }
  })

  if (!quiz) redirect(`/courses/${params.courseId}`)

  async function submitAnswers(formData: FormData) {
    'use server'
    const answers: Record<string, string> = {}
    quiz.questions.forEach((q) => {
      const val = String(formData.get(q.id) || '')
      answers[q.id] = val
    })

    // Calculate score
    const correctCount = quiz.questions.reduce((acc, q) => acc + (answers[q.id] === q.correctAnswer ? 1 : 0), 0)
    const scorePct = quiz.questions.length > 0 ? (correctCount / quiz.questions.length) * 100 : 0

    // Resolve current user
    const student = await db.user.findUnique({ where: { clerkId: userId! } })
    if (!student) redirect('/onboarding')

    await db.quizAttempt.create({
      data: {
        userId: student.id,
        quizId: quiz.id,
        score: scorePct,
        answers: answers as any
      }
    })

    revalidatePath(`/dashboard/student`)
    redirect(`/courses/${quiz.courseId}`)
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-2">{quiz.title}</h1>
      {quiz.description && <p className="text-sm text-muted-foreground mb-4">{quiz.description}</p>}

      <form action={submitAnswers} className="space-y-6">
        {quiz.questions.map((q, idx) => (
          <div key={q.id} className="border rounded-md p-4">
            <div className="font-medium mb-3">{idx + 1}. {q.question}</div>
            <div className="space-y-2">
              {(q.options as any as string[]).map((opt, i) => (
                <label key={i} className="flex items-center gap-2 text-sm">
                  <input type="radio" name={q.id} value={opt} required className="h-4 w-4" />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

        <button type="submit" className="px-4 py-2 rounded bg-black text-white">Submit</button>
      </form>
    </div>
  )
}
