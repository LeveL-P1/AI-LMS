import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';
import "./globals.css";


const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "SkillSyncAI - AI-Powered Learning Platform",
  description: "Master any skill with personalized AI-powered learning paths, interactive quizzes, and real-time progress tracking.",
  keywords: "online learning, AI education, courses, LMS, learning management",
  authors: [{ name: "Level-P1" }],
  openGraph: {
    title: "SkillSyncAI - AI-Powered Learning Platform",
    description: "Transform your learning experience with AI-powered personalization",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={`${inter.className} antialiased transition-colors duration-300`}>
          <div className="min-h-screen w-full bg-[#c59d6d] relative">
            {/* Light mode background */}
            <div
              className="absolute inset-0 z-0"
              style={{
                backgroundImage: `
                  linear-gradient(120deg, #fbbf24 0%, #f472b6 40%, #60a5fa 70%, #34d399 100%),
                  radial-gradient(circle at 60% 30%, rgba(255, 255, 255, 0.8) 0%, transparent 60%),
                  radial-gradient(circle at 80% 80%, rgba(236, 72, 153, 0.35) 0%, transparent 60%),
                  radial-gradient(circle at 20% 60%, rgba(59, 130, 246, 0.25) 0%, transparent 55%),
                  radial-gradient(ellipse at 50% 0%, rgba(16, 185, 129, 0.18) 0%, transparent 70%),
                  repeating-linear-gradient(135deg, rgba(255, 255, 255, 0.12) 0px, rgba(255, 255, 255, 0.12) 2px, transparent 2px, transparent 8px)
                `,
                backgroundBlendMode: "screen, lighten, lighten, lighten, lighten, normal",
                backgroundSize: "100% 100%, 80% 80%, 90% 90%, 100% 100%, 100% 100%, 40px 40px",
                backgroundPosition: "center, 60% 20%, 80% 80%, 20% 60%, 50% 0%, 0 0",
              }}
            />

            {/* Dark mode background */}
            <div
              className="absolute inset-0 z-0 dark-mode-bg opacity-0 transition-opacity duration-300"
              style={{
                background: "#000000",
                backgroundImage: `
                  radial-gradient(circle at 1px 1px, rgba(139, 92, 246, 0.2) 1px, transparent 0),
                  radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.18) 1px, transparent 0),
                  radial-gradient(circle at 1px 1px, rgba(236, 72, 153, 0.15) 1px, transparent 0)
                `,
                backgroundSize: "20px 20px, 30px 30px, 25px 25px",
                backgroundPosition: "0 0, 10px 10px, 15px 5px",
              }}
            />

            

            {/* Content */}
            <div className="relative z-10 font-sans">
              {children}
            </div>
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}

/*

  <div
    className="absolute inset-0 z-0"
    style={{
      backgroundImage: `
        radial-gradient(125% 125% at 50% 10%, #ffffff 40%, #14b8a6 100%)
      `,
      backgroundSize: "100% 100%",
    }}
  />
</div>

*/

