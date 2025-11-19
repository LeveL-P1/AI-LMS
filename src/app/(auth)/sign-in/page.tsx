import Link from "next/link";
import { AuthForm } from "@/components/auth/auth-form";

export default function SignInPage() {
  return (
    <div className="bg-canvas">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-16">
        <div className="w-full max-w-xl space-y-6 rounded-[32px] border border-white/8 bg-black/30 p-10 shadow-[0_40px_120px_rgba(0,0,0,0.55)]">
          <p className="text-xs uppercase tracking-[0.4em] text-white/40">Synapse Access</p>
          <h1 className="text-4xl font-semibold text-white">Welcome back to the studio.</h1>
          <p className="text-white/70">
            Reference frames borrowed from hyve.system + trae.ai keep this login cinematic yet
            minimal.
          </p>
          <AuthForm variant="sign-in" />
          <p className="text-sm text-white/60">
            Need an invite?{" "}
            <Link className="text-white" href="/sign-up">
              Request access
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

