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
    <section id="curriculum" className="py-32 sm:py-40 md:py-48 bg-white">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-20 text-center">
          <h2 className="text-6xl font-bold text-black sm:text-7xl md:text-8xl leading-[1.1]">
            Featured courses
          </h2>
          <p className="mt-6 text-xl text-gray-600 sm:text-2xl">
            Start learning from our curated collection
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {courses.map((course) => (
            <article key={course.id} className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-10 transition-all hover:border-gray-300 hover:shadow-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500 uppercase tracking-wide">
                  {course.difficulty ?? "All levels"}
                </span>
                <span className="text-sm text-gray-400">{course.chapters.length} chapters</span>
              </div>
              <h3 className="text-2xl font-bold text-black">{course.title}</h3>
              <p className="text-base text-gray-600 leading-relaxed">{course.tagline ?? course.description}</p>
              <div className="mt-auto pt-6 border-t border-gray-100">
                <p className="text-sm font-medium text-gray-500">
                  by {course.instructor?.name ?? "Synapse Team"}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

