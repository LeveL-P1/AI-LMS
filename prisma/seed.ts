import { PrismaClient, UserRole, type Course } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const hashPassword = (value: string) => bcrypt.hash(value, 11);

async function main() {
  console.log("🌱 Resetting schema...");
  await prisma.session.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.chapter.deleteMany();
  await prisma.course.deleteMany();
  await prisma.user.deleteMany();

  const [adminHash, instructorHash, studentHash] = await Promise.all([
    hashPassword("admin.supernova"),
    hashPassword("teach.studio"),
    hashPassword("learn.prototype"),
  ]);

  const admin = await prisma.user.create({
    data: {
      email: "nova@synapse.lms",
      name: "Nova Admin",
      passwordHash: adminHash,
      role: UserRole.ADMIN,
      headline: "Orchestrates learning systems",
    },
  });

  const instructors = await Promise.all([
    prisma.user.create({
      data: {
        email: "atlas@studio.ai",
        name: "Atlas Rivera",
        passwordHash: instructorHash,
        role: UserRole.INSTRUCTOR,
        headline: "Proto-instructor for creative tech",
      },
    }),
    prisma.user.create({
      data: {
        email: "sera@studio.ai",
        name: "Sera Bloom",
        passwordHash: instructorHash,
        role: UserRole.INSTRUCTOR,
        headline: "Systems designer & researcher",
      },
    }),
  ]);

  const students = await Promise.all(
    ["Kai", "Mira", "Harper", "Rowan", "Iris", "Leo"].map((name, index) =>
      prisma.user.create({
        data: {
          email: `${name.toLowerCase()}@learners.space`,
          name: `${name} Learner`,
          passwordHash: studentHash,
          role: UserRole.STUDENT,
          headline: index % 2 === 0 ? "Frontier builder" : "Curious explorer",
        },
      })
    )
  );

  console.log("👥 Seeded persona set");

  const coursePayloads = [
    {
      title: "Neural Product Thinking",
      slug: "neural-product-thinking",
      tagline: "Design adaptive flows with neural patterns",
      description:
        "Layer AI-native heuristics into product decisions. Explore systems inspired by hyve.system and p5 generative artistry.",
      coverImage:
        "https://images.unsplash.com/photo-1520607162513-77705c0f0d4a?auto=format&fit=crop&w=1400&q=80",
      difficulty: "Advanced",
      duration: 240,
      isFeatured: true,
      instructorId: instructors[0].id,
      chapters: {
        create: [
          {
            title: "Sensing Signals",
            summary: "Map qualitative insight into structured data cues.",
            position: 1,
            content: {
              type: "canvas",
              steps: ["field notebook", "system mapping", "canvas critique"],
            },
          },
          {
            title: "Orchestrating Agents",
            summary: "Prototype multi-agent loops that stay in sync.",
            position: 2,
            content: {
              type: "lab",
              kit: ["autonomous briefs", "ethics pass"],
            },
          },
        ],
      },
    },
    {
      title: "Sensory Storytelling",
      slug: "sensory-storytelling",
      tagline: "Blend motion, typography, and micro-soundscapes",
      description:
        "A cinematic workshop for crafting pitch decks and onboarding flows referencing sensory brands like trae.ai.",
      coverImage:
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1400&q=80",
      difficulty: "Intermediate",
      duration: 180,
      instructorId: instructors[1].id,
      chapters: {
        create: [
          {
            title: "Audio-reactive grids",
            summary: "Translate beats into fluid layouts.",
            position: 1,
            content: {
              type: "stories",
              references: ["trae.ai footer", "a24 motion idents"],
            },
          },
          {
            title: "Point-of-view narratives",
            summary: "Write scripts that guide holographic journeys.",
            position: 2,
            content: {
              type: "script",
              beats: ["spark", "tension", "resolution"],
            },
          },
        ],
      },
    },
    {
      title: "Adaptive Learning Ops",
      slug: "adaptive-learning-ops",
      tagline: "Automate cohorts, nudges, and feedback loops",
      description:
        "Operational blueprint for teams deploying AI-first academies—balanced between rigor and creative energy.",
      coverImage:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1400&q=80",
      difficulty: "Beginner",
      duration: 120,
      instructorId: instructors[0].id,
      chapters: {
        create: [
          {
            title: "Blueprint with Figma tokens",
            summary: "Translate rituals into reusable tiles.",
            position: 1,
            content: {
              type: "process",
              stack: ["Linear", "Notion", "Supabase"],
            },
          },
        ],
      },
    },
  ];

  const courses: Course[] = [];
  for (const payload of coursePayloads) {
    const course = await prisma.course.create({ data: payload });
    courses.push(course);
  }

  console.log("📚 Courses & chapters online");

  for (const learner of students) {
    const picks = courses
      .slice()
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);
    for (const course of picks) {
      await prisma.enrollment.create({
        data: {
          userId: learner.id,
          courseId: course.id,
          progress: Math.floor(Math.random() * 70),
          lastAccessed: new Date(Date.now() - Math.random() * 10 * 86400000),
        },
      });
    }
  }

  console.log("🔁 Enrollments mapped");

  const [userCount, courseCount] = await Promise.all([
    prisma.user.count(),
    prisma.course.count(),
  ]);

  console.log(
    `\n✨ Seed complete:\n   users: ${userCount}\n   courses: ${courseCount}\n   admin access: ${admin.email} / admin.supernova\n`
  );
}

main()
  .catch((error) => {
    console.error("❌ Seeding failed", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
