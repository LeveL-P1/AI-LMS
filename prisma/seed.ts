
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Create users
  const instructor = await prisma.user.create({
    data: {
      email: 'instructor@example.com',
      name: 'Instructor One',
      role: 'INSTRUCTOR',
    },
  });

  const student = await prisma.user.create({
    data: {
      email: 'student@example.com',
      name: 'Student One',
      role: 'STUDENT',
    },
  });

  // Create course
  const course = await prisma.course.create({
    data: {
      title: 'Intro to Web Dev',
      description: 'HTML, CSS, JavaScript fundamentals',
      instructorId: instructor.id,
    },
  });

  // Enroll student in course
  await prisma.enrollment.create({
    data: {
      userId: student.id,
      courseId: course.id,
    },
  });

  // Create lessons
  const lesson1 = await prisma.lesson.create({
    data: {
      title: 'HTML Basics',
      content: 'Introduction to HTML elements and structure.',
      videoUrl: 'https://example.com/html',
      courseId: course.id,
    },
  });

  const lesson2 = await prisma.lesson.create({
    data: {
      title: 'CSS Basics',
      content: 'Styling elements with CSS.',
      videoUrl: 'https://example.com/css',
      courseId: course.id,
    },
  });

  // Create assignment
  const assignment = await prisma.assignment.create({
    data: {
      title: 'Build a basic webpage',
      content: 'Create an HTML page using learned concepts.',
      courseId: course.id,
    },
  });

  // Create submission by student
  await prisma.submission.create({
    data: {
      assignmentId: assignment.id,
      studentId: student.id,
      content: '<html><body>Hello World</body></html>',
      grade: 95,
    },
  });

  // Create progress
  await prisma.progress.create({
    data: {
      userId: student.id,
      lessonId: lesson1.id,
      completed: true,
    },
  });

  await prisma.progress.create({
    data: {
      userId: student.id,
      lessonId: lesson2.id,
      completed: false,
    },
  });

  console.log('✅ Seed complete');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
