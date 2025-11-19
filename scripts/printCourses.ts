import { runWithPrisma } from './utils/runWithPrisma';

async function main() {
  await runWithPrisma(async prisma => {
    const course = await prisma.course.findFirst({
      include: {
        chapters: true,
        quizzes: {
          include: {
            questions: true,
          },
        },
        assignments: true,
      },
    });

    if (!course) {
      console.warn('No course found in the database.');
      return;
    }

    console.log(JSON.stringify(course, null, 2));
  });
}

main().catch(error => {
  console.error('Failed to print course snapshot:', error);
  process.exit(1);
});

