import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/session";
import { db } from "@/lib/prisma/prisma";

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/sign-in");
  }

  const [enrollments, featured] = await Promise.all([
    db.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          select: {
            title: true,
            tagline: true,
            duration: true,
          },
        },
      },
      orderBy: { lastAccessed: "desc" },
    }),
    db.course.findMany({
      where: { isFeatured: true },
      take: 3,
      select: {
        id: true,
        title: true,
        tagline: true,
        duration: true,
      },
    }),
  ]);

  return (
    <div className="min-h-screen bg-canvas px-4 py-16 text-white">
      <div className="mx-auto max-w-5xl space-y-12">
        <header className="space-y-4">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Synapse console</p>
          <h1 className="text-4xl font-semibold">Welcome back, {user.name.split(" ")[0]}.</h1>
          <p className="text-white/70">
            Keep exploring the cinematic curriculum. Supabase auth can drop in later without
            touching this UX.
          </p>
        </header>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">My rituals</h2>
            <p className="text-sm text-white/60">Progress auto-syncs every session.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {enrollments.length === 0 && (
              <div className="rounded-3xl border border-dashed border-white/10 p-6 text-white/70">
                You are not enrolled yet. Browse the featured modules below.
              </div>
            )}
            {enrollments.map((enrollment) => (
              <div key={enrollment.id} className="glass grid-overlay noise space-y-2 p-6">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">In progress</p>
                <h3 className="text-2xl font-semibold">{enrollment.course.title}</h3>
                <p className="text-sm text-white/70">
                  {enrollment.course.tagline ?? "Stay in flow and finish the arc."}
                </p>
                <div className="flex items-center justify-between text-sm text-white/60">
                  <span>{enrollment.progress}% complete</span>
                  <span>{enrollment.course.duration ?? 120} min</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Featured drops</h2>
            <p className="text-sm text-white/60">Inspired by hyve.system, p5.js, trae.ai.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {featured.map((course) => (
              <div key={course.id} className="rounded-3xl border border-white/10 bg-black/30 p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-white/40">Featured</p>
                <h3 className="mt-2 text-xl font-semibold">{course.title}</h3>
                <p className="text-sm text-white/70">
                  {course.tagline ?? "A tactile workshop for your next cohort."}
                </p>
                <p className="mt-4 text-xs uppercase tracking-[0.3em] text-white/40">
                  {course.duration ?? 120} min session
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

