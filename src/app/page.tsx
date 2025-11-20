import Link from "next/link";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SiteHeader />
      
      <main>
        {/* Hero Section */}
        <section className="px-4 py-20 sm:py-32">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl md:text-7xl">
              Learn smarter, not harder
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 sm:text-xl">
              The modern learning management system that adapts to your pace and helps you achieve your goals faster.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/sign-up"
                className="rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
              >
                Get started
              </Link>
              <Link
                href="/sign-in"
                className="text-base font-semibold leading-7 text-gray-900 hover:text-gray-700"
              >
                Sign in <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="bg-gray-50 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
                Everything you need to succeed
              </h2>
              <p className="mt-2 text-lg leading-8 text-gray-600">
                Powerful features designed to make learning more effective and enjoyable.
              </p>
            </div>
            <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
              <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
                <div className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    AI-Powered Learning
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Personalized learning paths that adapt to your progress and learning style.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    Real-Time Analytics
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Track your progress with detailed insights and performance metrics.
                    </p>
                  </dd>
                </div>
                <div className="flex flex-col">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    Interactive Content
                  </dt>
                  <dd className="mt-1 flex flex-auto flex-col text-base leading-7 text-gray-600">
                    <p className="flex-auto">
                      Engaging lessons with quizzes, videos, and interactive exercises.
                    </p>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="px-4 py-24 sm:py-32">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
              Ready to start learning?
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-gray-600">
              Join thousands of students already using our platform to achieve their learning goals.
            </p>
            <div className="mt-10 flex items-center justify-center gap-x-6">
              <Link
                href="/sign-up"
                className="rounded-lg bg-gray-900 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-gray-800"
              >
                Get started for free
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
