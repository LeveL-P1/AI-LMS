/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient, UserRole, Permission } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Clean existing data in a safe order (dependents first)
  await prisma.chatMessage.deleteMany();
  await prisma.chatRoom.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.course.deleteMany();
  await prisma.userAction.deleteMany();
  await prisma.rolePermission.deleteMany();
  await prisma.user.deleteMany();

  console.log("🧹 Cleaned existing data");

  // Seed role -> permission matrix (small subset for demo)
  const rolePermissions = [
    { role: UserRole.ADMIN, permission: Permission.MANAGE_USERS },
    { role: UserRole.ADMIN, permission: Permission.VIEW_ANALYTICS },
    { role: UserRole.INSTRUCTOR, permission: Permission.CREATE_COURSE },
    { role: UserRole.INSTRUCTOR, permission: Permission.EDIT_COURSE },
    { role: UserRole.STUDENT, permission: Permission.VIEW_COURSE },
  ];

  for (const rp of rolePermissions) {
    await prisma.rolePermission.create({ data: rp });
  }

  console.log("🔐 Seeded role permissions");

  // Create users
  // create an admin, several instructors and many students
  await prisma.user.create({
    data: { email: "admin@learndash.com", name: "System Administrator", role: UserRole.ADMIN },
  });

  const instructors = await Promise.all([
    prisma.user.create({ data: { email: "alice.instructor@learndash.com", name: "Alice Instructor", role: UserRole.INSTRUCTOR } }),
    prisma.user.create({ data: { email: "bob.instructor@learndash.com", name: "Bob Instructor", role: UserRole.INSTRUCTOR } }),
    prisma.user.create({ data: { email: "carla.instructor@learndash.com", name: "Carla Instructor", role: UserRole.INSTRUCTOR } }),
  ]);

  const students = await Promise.all([
    prisma.user.create({ data: { email: "student1@learndash.com", name: "Student One", role: UserRole.STUDENT } }),
    prisma.user.create({ data: { email: "student2@learndash.com", name: "Student Two", role: UserRole.STUDENT } }),
    prisma.user.create({ data: { email: "student3@learndash.com", name: "Student Three", role: UserRole.STUDENT } }),
    prisma.user.create({ data: { email: "student4@learndash.com", name: "Student Four", role: UserRole.STUDENT } }),
    prisma.user.create({ data: { email: "student5@learndash.com", name: "Student Five", role: UserRole.STUDENT } }),
    prisma.user.create({ data: { email: "student6@learndash.com", name: "Student Six", role: UserRole.STUDENT } }),
    prisma.user.create({ data: { email: "student7@learndash.com", name: "Student Seven", role: UserRole.STUDENT } }),
    prisma.user.create({ data: { email: "student8@learndash.com", name: "Student Eight", role: UserRole.STUDENT } }),
  ]);

  console.log("👥 Created users");

  // Create multiple demo courses and assign different instructors
  const course1 = await prisma.course.create({ data: { title: "Intro to Web Development", description: "A gentle introduction to HTML, CSS and JavaScript", instructorId: instructors[0].id } });
  const course2 = await prisma.course.create({ data: { title: "Data Fundamentals", description: "Basic data literacy and manipulation", instructorId: instructors[0].id } });
  const course3 = await prisma.course.create({ data: { title: "React Basics", description: "Learn React and build components", instructorId: instructors[1].id } });
  const course4 = await prisma.course.create({ data: { title: "Node.js APIs", description: "Build production-ready APIs with Node.js", instructorId: instructors[1].id } });
  const course5 = await prisma.course.create({ data: { title: "Machine Learning Intro", description: "Intro to ML concepts and workflows", instructorId: instructors[2].id } });
  const course6 = await prisma.course.create({ data: { title: "Mobile Apps with React Native", description: "Cross-platform mobile development", instructorId: instructors[2].id } });

  console.log("📚 Created courses");


  // Enroll students across courses with some randomness
  const allCourses = [course1, course2, course3, course4, course5, course6];
  const enrollmentPromises: Promise<any>[] = [];
  for (const s of students) {
    // Each student enrolls in 2-4 random courses
    const count = 2 + Math.floor(Math.random() * 3);
    const shuffled = allCourses.sort(() => 0.5 - Math.random());
    for (let i = 0; i < count; i++) {
      enrollmentPromises.push(prisma.enrollment.create({ data: { userId: s.id, courseId: shuffled[i].id } }));
    }
  }
  await Promise.all(enrollmentPromises);

  console.log("✅ Created enrollments");

  // Create chat rooms and messages for a subset of courses
  const sampleCourses = allCourses.slice(0, 4);
  for (const c of sampleCourses) {
    const room = await prisma.chatRoom.create({ data: { courseId: c.id } });
    // pick a random instructor and a random student for messages
    const randInstructor = instructors[Math.floor(Math.random() * instructors.length)];
    const randStudent = students[Math.floor(Math.random() * students.length)];
    await prisma.chatMessage.createMany({
      data: [
        { chatRoomId: room.id, senderId: randInstructor.id, content: "Welcome to the course!" },
        { chatRoomId: room.id, senderId: randStudent.id, content: "Excited to learn." },
      ],
    });
  }

  console.log("💬 Created chat room and messages");

  // Create a few user actions for analytics/demo
  // Create some user actions using random users
  const actionPromises: Promise<any>[] = [];
  for (let i = 0; i < 10; i++) {
    const acting = Math.random() < 0.6 ? students[Math.floor(Math.random() * students.length)] : instructors[Math.floor(Math.random() * instructors.length)];
    const actionType = Math.random() < 0.5 ? "VIEWED_COURSE" : "STARTED_LESSON";
    const meta = { courseId: allCourses[Math.floor(Math.random() * allCourses.length)].id };
    actionPromises.push(prisma.userAction.create({ data: { userId: acting.id, actionType, metadata: meta as any } }));
  }
  await Promise.all(actionPromises);

  console.log("📈 Created user actions");

  // Summary
  const userCount = await prisma.user.count();
  const courseCount = await prisma.course.count();
  const enrollmentCount = await prisma.enrollment.count();
  const chatRoomCount = await prisma.chatRoom.count();
  const messageCount = await prisma.chatMessage.count();

  console.log(`\n📊 SEED SUMMARY:\n- Users: ${userCount}\n- Courses: ${courseCount}\n- Enrollments: ${enrollmentCount}\n- Chat Rooms: ${chatRoomCount}\n- Messages: ${messageCount}\n`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });



