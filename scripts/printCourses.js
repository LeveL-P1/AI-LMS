import { PrismaClient } from '@prisma/client';
(async () => {
  const prisma = new PrismaClient();
  try {
    const course = await prisma.course.findFirst({ include: { chapters: true } });
    console.log(JSON.stringify(course, null, 2));
  } catch (e) {
    console.error(e);
  } finally {
    await prisma.$disconnect();
  }
})();
