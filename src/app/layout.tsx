
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ClerkProvider } from '@clerk/nextjs';
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Learning Dashboard - AI-Powered Education Platform",
  description: "Master any skill with personalized AI-powered learning paths, interactive quizzes, and real-time progress tracking.",
  keywords: "online learning, AI education, courses, LMS, learning management",
  authors: [{ name: "Your Name" }],
  openGraph: {
    title: "Learning Dashboard - AI-Powered Education",
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
        <body className={`${inter.className} antialiased`}>
          <div className="min-h-screen bg-background font-sans">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}