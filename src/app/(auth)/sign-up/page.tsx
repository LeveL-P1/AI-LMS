import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignUpPage() {
  return (
    <div className="bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl space-y-6 rounded-[32px] border border-white/8 bg-gradient-to-br from-purple-900/40 via-black/40 to-cyan-900/30 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Residency intake</p>
          <h1 className="text-4xl font-semibold text-white">Join Synapse LMS.</h1>
          <p className="text-white/70">
            Cohort builder referencing hyve.system textures, p5.js gradients, and trae.ai tone.
          </p>
          <AuthForm variant="sign-up" />
          <p className="text-sm text-white/60">
            Already inside?{" "}
            <Link className="text-white" href="/sign-in">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

