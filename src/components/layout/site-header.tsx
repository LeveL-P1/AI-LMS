import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/common/ui/button";
import { destroySession, getCurrentUser } from "@/lib/auth/session";

async function signOutAction() {
  "use server";
  await destroySession();
  redirect("/");
}

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-50 border-b border-white/5 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link href="/" className="flex items-center space-x-2">
          <span className="h-10 w-10 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-cyan-400 blur-[0.5px]" />
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-white/50">
              Synapse
            </p>
            <p className="text-lg font-semibold tracking-tight text-white">LMS</p>
          </div>
        </Link>

        <nav className="hidden gap-8 text-sm text-white/70 md:flex">
          <Link href="#experience" className="transition hover:text-white">
            Experience
          </Link>
          <Link href="#curriculum" className="transition hover:text-white">
            Curriculum
          </Link>
          <Link href="#studio" className="transition hover:text-white">
            Studio
          </Link>
          <Link href="#footer" className="transition hover:text-white">
            Partners
          </Link>
        </nav>

        <div className="flex items-center gap-3">
          {user ? (
            <>
              <Button asChild variant="ghost" className="text-white/80">
                <Link href="/dashboard">Dashboard</Link>
              </Button>
              <form action={signOutAction}>
                <Button type="submit" variant="outline" className="border-white/20 text-white">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="text-white/80">
                <Link href="/sign-in">Sign in</Link>
              </Button>
              <Button asChild className="bg-white text-black hover:bg-white/90">
                <Link href="/sign-up">Join waitlist</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

