import Link from "next/link";
import { redirect } from "next/navigation";
import { destroySession, getCurrentUser } from "@/lib/auth/session";

async function signOutAction() {
  "use server";
  await destroySession();
  redirect("/");
}

export async function SiteHeader() {
  const user = await getCurrentUser();

  return (
    <header className="bg-white border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link href="/" className="-m-1.5 p-1.5">
            <span className="text-xl font-bold text-gray-900">Synapse</span>
          </Link>
        </div>
        <div className="hidden lg:flex lg:gap-x-12">
          <Link href="#features" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
            Features
          </Link>
          <Link href="#courses" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
            Courses
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end gap-x-6">
          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                Dashboard
              </Link>
              <form action={signOutAction}>
                <button
                  type="submit"
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-50"
                >
                  Sign out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/sign-in" className="text-sm font-semibold leading-6 text-gray-900 hover:text-gray-700">
                Sign in
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                Get started
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}
