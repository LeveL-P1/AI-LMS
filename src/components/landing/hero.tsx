import Link from "next/link";
import { Button } from "@/components/common/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 md:py-40">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="text-7xl font-bold tracking-tight text-black sm:text-8xl md:text-9xl lg:text-[10rem] leading-[0.9]">
            Build better
            <br />
            learning experiences
          </h1>
          <p className="mx-auto mt-8 max-w-2xl text-xl text-gray-600 sm:text-2xl md:text-3xl leading-relaxed">
            The modern learning management system designed for AI-native academies and cinematic learning journeys.
          </p>
          <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
            <Button asChild size="lg" className="bg-black text-white hover:bg-gray-900 h-14 px-10 text-base font-medium rounded-full">
              <Link href="/sign-up">Get started</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gray-300 text-gray-900 hover:bg-gray-50 h-14 px-10 text-base font-medium rounded-full"
            >
              <Link href="/sign-in">Sign in</Link>
            </Button>
          </div>
        </div>
        <div className="mx-auto mt-24 grid w-full max-w-6xl grid-cols-2 gap-12 border-t border-gray-200 pt-16 text-left sm:grid-cols-4">
          {["Adaptive cohorts", "AI-powered", "Real-time analytics", "Studio tools"].map(
            (item) => (
              <div key={item} className="space-y-2">
                <p className="text-lg font-semibold text-black">{item}</p>
                <Link href="#experience" className="text-sm text-gray-500 hover:text-black transition-colors inline-flex items-center gap-1">
                  Learn more <span>→</span>
                </Link>
              </div>
            )
          )}
        </div>
      </div>
    </section>
  );
}
