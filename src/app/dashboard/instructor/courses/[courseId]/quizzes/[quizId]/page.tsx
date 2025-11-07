import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { db } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export default async function QuizQuestionsPage(props: any) {
  const { params } = props as { params: { courseId: string; quizId: string } }
  const { userId } = await auth()
  if (!userId) redirect('/sign-in')

  const quiz = await db.quiz.findFirst({
    where: { id: params.quizId, course: { id: params.courseId, instructor: { clerkId: userId } } },
    include: { questions: true, course: true }
  })
  if (!quiz) redirect(`/dashboard/instructor/courses/${params.courseId}/quizzes`)

  // Capture identifiers used by server actions to avoid closing over `quiz`
  const quizId = quiz.id
  const quizCourseId = quiz.courseId

  async function addQuestion(formData: FormData) {
    'use server'
    const question = String(formData.get('question') || '')
    const optionsRaw = String(formData.get('options') || '[]')
    const correctAnswer = String(formData.get('correctAnswer') || '')
    const explanation = String(formData.get('explanation') || '')

    let options: string[]
    try { options = JSON.parse(optionsRaw) } catch { options = [] }

    await db.quizQuestion.create({
      data: {
        question,
        options: options as unknown as object,
        correctAnswer,
        explanation,
        quizId: quizId
      }
    })

    revalidatePath(`/dashboard/instructor/courses/${quizCourseId}/quizzes/${quizId}`)
  }

  async function publishQuiz() {
    'use server'
  await db.quiz.update({ where: { id: quizId }, data: { isPublished: true } })
  revalidatePath(`/dashboard/instructor/courses/${quizCourseId}/quizzes`)
  redirect(`/dashboard/instructor/courses/${quizCourseId}/quizzes`)
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Questions • {quiz.title}</h1>
  <p className="text-sm text-muted-foreground">Add multiple choice questions. Options as JSON array, e.g. {"[\"A\",\"B\",\"C\",\"D\"]"}.</p>
      </div>

      <form action={addQuestion} className="space-y-4 border rounded-md p-4">
        <div>
          <label className="block text-sm mb-1">Question</label>
          <input name="question" required className="w-full border rounded px-3 py-2" placeholder="What is 2 + 2?" />
        </div>
        <div>
          <label className="block text-sm mb-1">Options (JSON array)</label>
          <input name="options" required className="w-full border rounded px-3 py-2" placeholder='["2","3","4","5"]' />
        </div>
        <div>
          <label className="block text-sm mb-1">Correct Answer</label>
          <input name="correctAnswer" required className="w-full border rounded px-3 py-2" placeholder="4" />
        </div>
        <div>
          <label className="block text-sm mb-1">Explanation (optional)</label>
          <textarea name="explanation" className="w-full border rounded px-3 py-2" placeholder="Because 2 + 2 equals 4" />
        </div>
        <button className="px-4 py-2 rounded bg-black text-white" type="submit">Add question</button>
      </form>

      <div className="space-y-3">
        {quiz.questions.length === 0 && (
          <p className="text-sm text-muted-foreground">No questions yet.</p>
        )}
        {quiz.questions.map(q => (
          <div key={q.id} className="border rounded-md p-3">
            <div className="font-medium">{q.question}</div>
            <div className="text-sm text-muted-foreground">Correct: {q.correctAnswer}</div>
          </div>
        ))}
      </div>

      <form action={publishQuiz}>
        <button className="px-4 py-2 rounded bg-green-600 text-white" type="submit" disabled={quiz.isPublished}>
          {quiz.isPublished ? 'Published' : 'Publish quiz'}
        </button>
      </form>
    </div>
  )
}
