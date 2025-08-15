// import { SignUp } from '@clerk/nextjs';

// export default function SignUpPage() {
//   return (
//     <div className="min-h-screen flex items-center justify-center">
//       <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
//     </div>
//   );
// }
import { SignUp } from '@clerk/nextjs';
import { GraduationCap, Sparkles, Users, BookOpen } from 'lucide-react';
import Link from 'next/link';

export default function SignUpPage() {
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
              Start your learning journey today
            </h1>
            <p className="text-muted-foreground text-lg mb-8">
              Join thousands of learners who are already transforming their skills with AI-powered education.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-1 gap-6 mb-8">
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Users className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">10,000+</div>
                  <div className="text-sm text-muted-foreground">Active learners</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">500+</div>
                  <div className="text-sm text-muted-foreground">Expert courses</div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
                  <Sparkles className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <div className="font-semibold text-foreground">AI-Powered</div>
                  <div className="text-sm text-muted-foreground">Personalized learning</div>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="bg-background/60 backdrop-blur-sm rounded-lg p-4 border">
              <p className="text-sm text-muted-foreground italic mb-2">
                &ldquo;LearnDash&lsquo;s AI recommendations helped me master React in just 3 weeks. The personalized learning path was exactly what I needed!&ldquo;
              </p>
              <div className="text-xs text-muted-foreground">
                — Sarah Chen, Software Developer
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
            <h2 className="text-2xl font-bold text-foreground">Create your account</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/sig-in" className="text-primary hover:underline font-medium">
                Sign in here
              </Link>
            </p>
          </div>

          {/* Clerk Sign Up Component */}
          <div className="flex justify-center">
            <SignUp 
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

          {/* Trust signals */}
          <div className="mt-6 text-center">
            <p className="text-xs text-muted-foreground">
              By signing up, you agree to our{' '}
              <Link href="/terms" className="underline hover:text-foreground">Terms</Link>
              {' '}and{' '}
              <Link href="/privacy" className="underline hover:text-foreground">Privacy Policy</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}