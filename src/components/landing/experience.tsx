const EXPERIENCES = [
  {
    title: "Smart Learning",
    description: "AI-powered adaptive learning paths that adjust to each student's pace and learning style.",
  },
  {
    title: "Beautiful Design",
    description: "Cinematic interfaces that make learning engaging and enjoyable for everyone.",
  },
  {
    title: "Real-time Insights",
    description: "Track progress, engagement, and performance with comprehensive analytics and reporting.",
  },
];

export function ExperienceGrid() {
  return (
    <section id="experience" className="py-32 sm:py-40 md:py-48">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mb-20 text-center">
          <h2 className="text-6xl font-bold text-black sm:text-7xl md:text-8xl leading-[1.1]">
            Everything you need
            <br />
            to teach and learn
          </h2>
          <p className="mt-6 text-xl text-gray-600 sm:text-2xl">
            Built for modern educators and students
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-3">
          {EXPERIENCES.map((experience) => (
            <div
              key={experience.title}
              className="flex flex-col gap-6 rounded-3xl border border-gray-200 bg-white p-10 transition-all hover:border-gray-300 hover:shadow-xl"
            >
              <h3 className="text-3xl font-bold text-black">{experience.title}</h3>
              <p className="text-lg text-gray-600 leading-relaxed">{experience.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

