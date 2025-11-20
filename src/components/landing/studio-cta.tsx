import Link from "next/link";
import { Button } from "@/components/common/ui/button";

export function StudioCTA() {
  return (
    <section id="studio" className="py-32 sm:py-40 md:py-48">
      <div className="mx-auto max-w-5xl px-6 sm:px-8 lg:px-12 text-center">
        <h2 className="text-6xl font-bold text-black sm:text-7xl md:text-8xl leading-[1.1]">
          Ready to get started?
        </h2>
        <p className="mt-6 text-xl text-gray-600 sm:text-2xl">
          Join thousands of educators and students already using Synapse LMS
        </p>
        <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row sm:gap-4">
          <Button asChild size="lg" className="bg-black text-white hover:bg-gray-900 h-14 px-10 text-base font-medium rounded-full">
            <Link href="/sign-up">Get started for free</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-gray-300 text-black hover:bg-gray-50 h-14 px-10 text-base font-medium rounded-full"
          >
            <Link href="#experience">Learn more</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}

