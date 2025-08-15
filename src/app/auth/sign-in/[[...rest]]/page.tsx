// import { SignIn } from '@clerk/nextjs';

// export default function SignInPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <SignIn path="/sign-in" routing="path" signInUrl="/sign-up  " />
//     </div>
//   );
// }
import { SignIn } from '@clerk/nextjs';
import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function SignInPage() {
  return (
    <div className="min-h-screen flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:flex-1 bg-gradient-to-br from-primary/10 via-primary/5 to-secondary/10 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="relative z-10 flex flex-col justify-center px-12 py-24">
          <div className="mx-auto max-w-md">
            {/* Logo */}
            <div className="flex items-center space-x-2 mb-8">
              <div className="flex items-center justify-center w-10 h-10 bg-primary rounded-xl">
                <GraduationCap className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="font-bold text-2xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
                LearnDash
              </span>
            </div>

            <h1 className="text-3xl font-bold text-foreground mb-4">
              Welcome back to your learning journey
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Continue where you left off and unlock your potential with AI-powered personalized learning.
            </p>

            {/* Features List */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">AI-powered course recommendations</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Real-time progress tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-sm text-muted-foreground">Interactive quizzes and assignments</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right side - Auth Form */}
      <div className="flex-1 flex flex-col justify-center px-6 py-12 lg:px-8">
        <div className="mx-auto w-full max-w-sm">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center space-x-2 mb-8">
            <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
              <GraduationCap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              LearnDash
            </span>
          </div>

          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-foreground">Sign in to your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Don&lsquo;t have an account?{' '}
              <Link href="/sign-up" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>
            </p>
          </div>

          {/* Clerk Sign In Component */}
          <div className="flex justify-center">
            <SignIn 
              appearance={{
                elements: {
                  rootBox: "w-full",
                  card: "bg-background border shadow-lg",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton: "bg-background border-input hover:bg-accent",
                  socialButtonsBlockButtonText: "text-foreground",
                  formButtonPrimary: "bg-primary hover:bg-primary/90",
                  formFieldInput: "bg-background border-input",
                  footerActionLink: "text-primary hover:text-primary/80",
                }
              }}
            />
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              ← Back to homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}