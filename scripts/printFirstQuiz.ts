import { runWithPrisma } from './utils/runWithPrisma';

async function main() {
  await runWithPrisma(async prisma => {
    const quiz = await prisma.quiz.findFirst({
      include: { questions: true, course: { select: { id: true, title: true } } },
    });

    if (!quiz) {
      console.warn('No quiz found in the database.');
      return;
    }

    console.log(JSON.stringify(quiz, null, 2));
  });
}

main().catch(error => {
  console.error('Failed to print quiz snapshot:', error);
  process.exit(1);
});

