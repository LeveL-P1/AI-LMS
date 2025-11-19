import Link from "next/link";

export function StudioCTA() {
  return (
    <section id="studio" className="py-24">
      <div className="mx-auto max-w-5xl overflow-hidden rounded-[32px] border border-white/10 bg-gradient-to-br from-purple-900/50 via-black/30 to-cyan-900/40 px-8 py-16 text-center text-white shadow-[0_30px_120px_rgba(0,0,0,0.6)]">
        <p className="text-xs uppercase tracking-[0.5em] text-white/50">Residency</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-tight">
          Prototype your AI-first academy with Synapse Studios.
        </h2>
        <p className="mt-4 text-white/70">
          Borrow our creative technology directors, sound designers, and learning scientists
          trained on hyve.system, p5.js, trae.ai, and A24 storytelling.
        </p>
        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Link
            href="/sign-up"
            className="w-full rounded-full bg-white px-6 py-3 text-center text-sm font-semibold text-black transition hover:bg-white/90 sm:w-auto"
          >
            Book a studio slot
          </Link>
          <Link
            href="#experience"
            className="w-full rounded-full border border-white/30 px-6 py-3 text-center text-sm font-semibold text-white transition hover:bg-white/10 sm:w-auto"
          >
            Explore the rituals
          </Link>
        </div>
      </div>
    </section>
  );
}

