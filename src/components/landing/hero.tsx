import Link from "next/link";
import { Button } from "@/components/common/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24">
      <div className="absolute left-1/2 top-10 h-64 w-64 -translate-x-1/2 rounded-full bg-gradient-to-r from-fuchsia-500 to-cyan-300 opacity-40 blur-3xl" />
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-4 text-center">
        <p className="text-xs uppercase tracking-[0.6em] text-white/60">hyve.system energy</p>
        <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-6xl">
          Where cinematic learning journeys meet operational rigor.
        </h1>
        <p className="text-lg text-white/70 sm:text-xl">
          Inspired by hyve.system, p5.js sketches, and motion cues from trae.ai, Synapse LMS is
          the studio-grade home for AI-native academies.
        </p>
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="bg-white text-black hover:bg-white/90">
            <Link href="/sign-up">Design my cohort</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/30 text-white hover:bg-white/10"
          >
            <Link href="/sign-in">I already have access</Link>
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-6 rounded-3xl border border-white/5 bg-white/5 p-6 text-left text-white/80 md:grid-cols-4">
          {["Adaptive cohorts", "Generative briefs", "Pulse analytics", "Studio rituals"].map(
            (item) => (
              <div key={item}>
                <p className="text-sm uppercase tracking-[0.3em] text-white/40">Module</p>
                <p className="text-lg font-medium text-white">{item}</p>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
