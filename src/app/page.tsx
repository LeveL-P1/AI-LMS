
import { Suspense } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { Hero } from "@/components/landing/hero";
import { ExperienceGrid } from "@/components/landing/experience";
import { CurriculumShowcase } from "@/components/landing/curriculum";
import { StudioCTA } from "@/components/landing/studio-cta";

export default function HomePage() {
  return (
    <div className="bg-canvas text-white">
      <SiteHeader />

      <main>
        <Hero />
        <ExperienceGrid />
        <Suspense fallback={<div className="py-24 text-center text-white/50">Loading courses…</div>}>
          <CurriculumShowcase />
        </Suspense>
        <StudioCTA />
      </main>

      <SiteFooter />
    </div>
  );
}
