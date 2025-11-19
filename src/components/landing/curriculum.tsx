import { db } from "@/lib/prisma/prisma";

export async function CurriculumShowcase() {
  const courses = await db.course.findMany({
    take: 3,
    orderBy: { createdAt: "desc" },
    include: {
      instructor: {
        select: { name: true },
      },
      chapters: {
        select: { id: true },
      },
    },
  });

  return (
    <section id="curriculum" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Curriculum</p>
          <h2 className="text-3xl font-semibold text-white">Live modules from the studio.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="glass noise grid-overlay flex flex-col gap-4 p-6">
              <p className="text-xs uppercase tracking-[0.3em] text-white/40">
                {course.difficulty ?? "Adaptive"}
              </p>
              <h3 className="text-2xl font-semibold text-white">{course.title}</h3>
              <p className="text-sm text-white/70">{course.tagline ?? course.description}</p>
              <div className="mt-auto flex items-center justify-between text-xs uppercase tracking-[0.3em] text-white/50">
                <span>{course.instructor?.name ?? "Synapse Collective"}</span>
                <span>{course.chapters.length} chapters</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

