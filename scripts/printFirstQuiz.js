import { PrismaClient } from '@prisma/client'
;(async () => {
  const prisma = new PrismaClient()
  try {
    const quiz = await prisma.quiz.findFirst({})
    console.log(JSON.stringify(quiz, null, 2))
  } catch (e) {
    console.error(e)
  } finally {
    await prisma.$disconnect()
  }
})()
