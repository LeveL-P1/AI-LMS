/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, UserRole } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data
  await prisma.assignmentSubmission.deleteMany();
  await prisma.assignment.deleteMany();
  await prisma.quizAttempt.deleteMany();
  await prisma.quizQuestion.deleteMany();
  await prisma.quiz.deleteMany();
  await prisma.userProgress.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Create Categories
  const categories = await Promise.all([
    prisma.category.create({
      data: { name: "Web Development" },
    }),
    prisma.category.create({
      data: { name: "Data Science" },
    }),
    prisma.category.create({
      data: { name: "Mobile Development" },
    }),
    prisma.category.create({
      data: { name: "AI & Machine Learning" },
    }),
    prisma.category.create({
      data: { name: "DevOps" },
    }),
    prisma.category.create({
      data: { name: "Design" },
    }),
  ]);

  console.log("📂 Created categories");

  // Create Users
  const admin = await prisma.user.create({
    data: {
      clerkId: "admin_clerk_id",
      email: "admin@learndash.com",
      firstName: "System",
      lastName: "Administrator",
      role: UserRole.ADMIN,
      imageUrl:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
    },
  });

  const instructors = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: "instructor1_clerk_id",
        email: "john.smith@learndash.com",
        firstName: "John",
        lastName: "Smith",
        role: UserRole.INSTRUCTOR,
        imageUrl:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "instructor2_clerk_id",
        email: "sarah.johnson@learndash.com",
        firstName: "Sarah",
        lastName: "Johnson",
        role: UserRole.INSTRUCTOR,
        imageUrl:
          "https://images.unsplash.com/photo-1494790108755-2616b1e46d3e?w=400",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "instructor3_clerk_id",
        email: "mike.chen@learndash.com",
        firstName: "Mike",
        lastName: "Chen",
        role: UserRole.INSTRUCTOR,
        imageUrl:
          "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=400",
      },
    }),
  ]);

  const students = await Promise.all([
    prisma.user.create({
      data: {
        clerkId: "student1_clerk_id",
        email: "alice.wonder@student.com",
        firstName: "Alice",
        lastName: "Wonder",
        role: UserRole.STUDENT,
        imageUrl:
          "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "student2_clerk_id",
        email: "bob.builder@student.com",
        firstName: "Bob",
        lastName: "Builder",
        role: UserRole.STUDENT,
        imageUrl:
          "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "student3_clerk_id",
        email: "charlie.brown@student.com",
        firstName: "Charlie",
        lastName: "Brown",
        role: UserRole.STUDENT,
        imageUrl:
          "https://images.unsplash.com/photo-1507101105822-7472b28e22ac?w=400",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "student4_clerk_id",
        email: "diana.prince@student.com",
        firstName: "Diana",
        lastName: "Prince",
        role: UserRole.STUDENT,
        imageUrl:
          "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=400",
      },
    }),
    prisma.user.create({
      data: {
        clerkId: "student5_clerk_id",
        email: "evan.tech@student.com",
        firstName: "Evan",
        lastName: "Tech",
        role: UserRole.STUDENT,
        imageUrl:
          "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400",
      },
    }),
  ]);

  console.log("👥 Created users");

  // Create Courses
  const courses = [];

  // Web Development Courses
  const reactCourse = await prisma.course.create({
    data: {
      title: "Complete React.js Masterclass",
      description:
        "Learn React from scratch with hooks, context, and modern patterns. Build real-world applications.",
      imageUrl:
        "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800",
      price: 99.99,
      isPublished: true,
      categoryId: categories[0].id,
      instructorId: instructors[0].id,
    },
  });

  const nextjsCourse = await prisma.course.create({
    data: {
      title: "Next.js 14 Full-Stack Development",
      description:
        "Master Next.js 14 with App Router, Server Components, and modern deployment strategies.",
      imageUrl:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800",
      price: 129.99,
      isPublished: true,
      categoryId: categories[0].id,
      instructorId: instructors[0].id,
    },
  });

  const nodeJsCourse = await prisma.course.create({
    data: {
      title: "Node.js Backend Development",
      description:
        "Build scalable backend APIs with Node.js, Express, and MongoDB. Includes authentication and testing.",
      imageUrl:
        "https://images.unsplash.com/photo-1627398242454-45a1465c2479?w=800",
      price: 89.99,
      isPublished: true,
      categoryId: categories[0].id,
      instructorId: instructors[1].id,
    },
  });

  // Data Science Courses
  const pythonCourse = await prisma.course.create({
    data: {
      title: "Python for Data Science",
      description:
        "Learn Python programming for data analysis with pandas, numpy, and matplotlib.",
      imageUrl:
        "https://images.unsplash.com/photo-1526379879527-8559ecfcaec0?w=800",
      price: 79.99,
      isPublished: true,
      categoryId: categories[1].id,
      instructorId: instructors[1].id,
    },
  });

  const mlCourse = await prisma.course.create({
    data: {
      title: "Machine Learning with Python",
      description:
        "Comprehensive machine learning course covering algorithms, implementation, and real projects.",
      imageUrl:
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?w=800",
      price: 149.99,
      isPublished: true,
      categoryId: categories[3].id,
      instructorId: instructors[2].id,
    },
  });

  // Mobile Development
  const reactNativeCourse = await prisma.course.create({
    data: {
      title: "React Native Mobile Development",
      description:
        "Build cross-platform mobile apps with React Native. Includes navigation, state management.",
      imageUrl:
        "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=800",
      price: 109.99,
      isPublished: true,
      categoryId: categories[2].id,
      instructorId: instructors[2].id,
    },
  });

  // Remove this line or ensure 'courses' is properly declared as an array of the correct type.
  // If you want to keep track of all created courses, declare 'courses' before this line:
  // const courses = [reactCourse, nextjsCourse, nodeJsCourse, pythonCourse, mlCourse, reactNativeCourse]
  // Or, if 'courses' is already declared, make sure its type matches the course objects being pushed.

  console.log("📚 Created courses");

  // Create Chapters
  const reactChapters = await Promise.all([
    prisma.chapter.create({
      data: {
        title: "Introduction to React",
        description: "Understanding React fundamentals and JSX",
        position: 1,
        isPublished: true,
        isFree: true,
        courseId: reactCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "Components and Props",
        description: "Creating reusable components and passing data",
        position: 2,
        isPublished: true,
        courseId: reactCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "State and Lifecycle",
        description: "Managing component state and lifecycle methods",
        position: 3,
        isPublished: true,
        courseId: reactCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "React Hooks",
        description: "useState, useEffect, and custom hooks",
        position: 4,
        isPublished: true,
        courseId: reactCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "Context API",
        description: "Managing global state with Context",
        position: 5,
        isPublished: true,
        courseId: reactCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
  ]);

  const nextjsChapters = await Promise.all([
    prisma.chapter.create({
      data: {
        title: "Next.js Fundamentals",
        description: "Introduction to Next.js and file-based routing",
        position: 1,
        isPublished: true,
        isFree: true,
        courseId: nextjsCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "App Router",
        description: "Understanding the new App Router architecture",
        position: 2,
        isPublished: true,
        courseId: nextjsCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "Server Components",
        description: "React Server Components in Next.js",
        position: 3,
        isPublished: true,
        courseId: nextjsCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "API Routes",
        description: "Building backend APIs with Next.js",
        position: 4,
        isPublished: true,
        courseId: nextjsCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
  ]);

  const pythonChapters = await Promise.all([
    prisma.chapter.create({
      data: {
        title: "Python Basics",
        description: "Variables, data types, and control structures",
        position: 1,
        isPublished: true,
        isFree: true,
        courseId: pythonCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "NumPy for Numerical Computing",
        description: "Working with arrays and mathematical operations",
        position: 2,
        isPublished: true,
        courseId: pythonCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
    prisma.chapter.create({
      data: {
        title: "Pandas for Data Analysis",
        description: "DataFrames, data manipulation, and analysis",
        position: 3,
        isPublished: true,
        courseId: pythonCourse.id,
        videoUrl: "https://www.youtube.com/watch?v=dGcsHMXbSOA",
      },
    }),
  ]);

  console.log("📖 Created chapters");

  // Create Enrollments
  const enrollments = [];
  for (const student of students) {
    // Each student enrolls in 2-4 random courses
    const coursesToEnroll = courses.slice(0, Math.floor(Math.random() * 3) + 2);
    for (const course of coursesToEnroll) {
      const enrollment = await prisma.enrollment.create({
        data: {
          userId: (student as any).id,
          courseId: (course as any).id,
        },
      });
      enrollments.push(enrollment as never);
    }
  }

  console.log("✅ Created enrollments");

  // Create User Progress
  for (const enrollment of enrollments.slice(0, 10)) {
    // Progress for first 10 enrollments
    const courseChapters = await prisma.chapter.findMany({
      where: { courseId: (enrollment as any).courseId },
    });

    // Random progress through chapters
    const progressCount = Math.floor(Math.random() * courseChapters.length);
    for (let i = 0; i < progressCount; i++) {
      await prisma.userProgress.create({
        data: {
          userId: (enrollment as any).userId,
          chapterId: courseChapters[i].id,
          isCompleted: true,
        },
      });
    }
  }

  console.log("📈 Created user progress");

  // Create Quizzes
  const reactQuiz = await prisma.quiz.create({
    data: {
      title: "React Fundamentals Quiz",
      description: "Test your understanding of React basics",
      courseId: reactCourse.id,
      timeLimit: 30,
      isPublished: true,
    },
  });

  const nextjsQuiz = await prisma.quiz.create({
    data: {
      title: "Next.js App Router Quiz",
      description: "Assessment on Next.js App Router concepts",
      courseId: nextjsCourse.id,
      timeLimit: 25,
      isPublished: true,
    },
  });

  const pythonQuiz = await prisma.quiz.create({
    data: {
      title: "Python Data Science Quiz",
      description: "Test your Python and data science knowledge",
      courseId: pythonCourse.id,
      timeLimit: 40,
      isPublished: true,
    },
  });

  console.log("❓ Created quizzes");

  // Create Quiz Questions
  await Promise.all([
    // React Quiz Questions
    prisma.quizQuestion.create({
      data: {
        question: "What is JSX in React?",
        options: JSON.stringify([
          "A JavaScript library",
          "A syntax extension for JavaScript",
          "A CSS framework",
          "A database query language",
        ]),
        correctAnswer: "A syntax extension for JavaScript",
        quizId: reactQuiz.id,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        question: "Which hook is used for managing component state?",
        options: JSON.stringify([
          "useEffect",
          "useState",
          "useContext",
          "useReducer",
        ]),
        correctAnswer: "useState",
        quizId: reactQuiz.id,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        question: "What is the purpose of useEffect hook?",
        options: JSON.stringify([
          "Managing state",
          "Handling side effects",
          "Creating components",
          "Styling components",
        ]),
        correctAnswer: "Handling side effects",
        quizId: reactQuiz.id,
      },
    }),

    // Next.js Quiz Questions
    prisma.quizQuestion.create({
      data: {
        question: "What is the default routing system in Next.js?",
        options: JSON.stringify([
          "Client-side routing",
          "Server-side routing",
          "File-based routing",
          "Hash-based routing",
        ]),
        correctAnswer: "File-based routing",
        quizId: nextjsQuiz.id,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        question: "What are Server Components in Next.js?",
        options: JSON.stringify([
          "Components that run on the server",
          "Components that handle API calls",
          "Components for server configuration",
          "Components that manage server state",
        ]),
        correctAnswer: "Components that run on the server",
        quizId: nextjsQuiz.id,
      },
    }),

    // Python Quiz Questions
    prisma.quizQuestion.create({
      data: {
        question:
          "Which library is primarily used for data manipulation in Python?",
        options: JSON.stringify([
          "NumPy",
          "Pandas",
          "Matplotlib",
          "Scikit-learn",
        ]),
        correctAnswer: "Pandas",
        quizId: pythonQuiz.id,
      },
    }),
    prisma.quizQuestion.create({
      data: {
        question: "What data structure does Pandas use for 2D data?",
        options: JSON.stringify(["Series", "DataFrame", "Array", "Dictionary"]),
        correctAnswer: "DataFrame",
        quizId: pythonQuiz.id,
      },
    }),
  ]);

  console.log("❓ Created quiz questions");

  // Create Quiz Attempts
  const quizzes = [reactQuiz, nextjsQuiz, pythonQuiz];
  for (const student of students.slice(0, 3)) {
    for (const quiz of quizzes) {
      const score = Math.random() * 100; // Random score between 0-100
      await prisma.quizAttempt.create({
        data: {
          userId: student.id,
          quizId: quiz.id,
          score: Math.round(score * 100) / 100,
          answers: JSON.stringify({
            question1: "Answer 1",
            question2: "Answer 2",
            question3: "Answer 3",
          }),
        },
      });
    }
  }

  console.log("📊 Created quiz attempts");

  // Create Assignments
  const assignments = await Promise.all([
    prisma.assignment.create({
      data: {
        title: "Build a React Todo App",
        description:
          "Create a fully functional todo application using React hooks and local storage.",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Due in 7 days
        courseId: reactCourse.id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: "Next.js Blog Project",
        description:
          "Build a blog application with Next.js App Router, including dynamic routes and API endpoints.",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Due in 14 days
        courseId: nextjsCourse.id,
      },
    }),
    prisma.assignment.create({
      data: {
        title: "Data Analysis Project",
        description:
          "Perform exploratory data analysis on a provided dataset using Pandas and create visualizations.",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // Due in 10 days
        courseId: pythonCourse.id,
      },
    }),
  ]);

  console.log("📝 Created assignments");

  // Create Assignment Submissions
  for (const assignment of assignments) {
    // Random submissions from enrolled students
    const enrolledStudents = await prisma.enrollment.findMany({
      where: { courseId: assignment.courseId },
      include: { user: true },
    });

    for (const enrollment of enrolledStudents.slice(0, 2)) {
      const grades = [85, 92, 78, 95, 88, 91];
      const randomGrade = grades[Math.floor(Math.random() * grades.length)];

      await prisma.assignmentSubmission.create({
        data: {
          userId: enrollment.userId,
          assignmentId: assignment.id,
          content: `This is my submission for ${assignment.title}. I have completed all the requirements...`,
          grade: randomGrade,
          feedback:
            randomGrade > 90
              ? "Excellent work! You demonstrated a strong understanding of the concepts."
              : randomGrade > 80
              ? "Good job! There are a few areas for improvement but overall well done."
              : "Nice effort! Please review the feedback and consider resubmitting.",
          fileUrl: "https://example.com/submission.pdf",
        },
      });
    }
  }

  console.log("📤 Created assignment submissions");

  console.log("🎉 Database seeding completed successfully!");

  // Print summary
  const userCount = await prisma.user.count();
  const courseCount = await prisma.course.count();
  const enrollmentCount = await prisma.enrollment.count();
  const quizCount = await prisma.quiz.count();
  const assignmentCount = await prisma.assignment.count();

  console.log(`
📊 SEED SUMMARY:
- Users: ${userCount}
- Courses: ${courseCount}  
- Enrollments: ${enrollmentCount}
- Quizzes: ${quizCount}
- Assignments: ${assignmentCount}
- Categories: ${categories.length}
  `);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

