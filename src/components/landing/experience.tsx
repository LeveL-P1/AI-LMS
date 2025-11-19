const EXPERIENCES = [
  {
    title: "Sensors",
    description: "Signal-driven learning states, inspired by hyve.system's adaptive loops.",
    detail: "Auto-calibrates cohorts with bio, goals, and team rituals.",
  },
  {
    title: "Studios",
    description: "Motion canvases referencing p5.js generative sketches.",
    detail: "Layered gradients, orbs, and vector fields narrate each lesson.",
  },
  {
    title: "Echoes",
    description: "Trae.ai style micro-interactions inside chat, comments, and feedback.",
    detail: "Soft audio-reactive badges keep humans in the loop.",
  },
];

export function ExperienceGrid() {
  return (
    <section id="experience" className="py-24">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-12 flex flex-col gap-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Experience system</p>
          <h2 className="text-3xl font-semibold text-white">Cinematic, tactile, measurable.</h2>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {EXPERIENCES.map((experience) => (
            <div
              key={experience.title}
              className="glass grid-overlay noise flex flex-col gap-4 p-6 text-white"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-white/40">Layer</p>
              <h3 className="text-2xl font-semibold">{experience.title}</h3>
              <p className="text-white/80">{experience.description}</p>
              <p className="text-sm text-white/60">{experience.detail}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

