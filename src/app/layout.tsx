import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const font = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Synapse LMS · Adaptive Learning for Teams",
  description:
    "An experiential AI-native LMS with cinematic UI, crafted with inspiration from hyve.system, p5.js visuals, and trae.ai micro-interactions.",
  keywords: [
    "AI LMS",
    "learning platform",
    "digital academy",
    "hyve system inspired",
    "p5 generative UI",
  ],
  openGraph: {
    title: "Synapse LMS",
    description:
      "Blend of expressive creative-tech aesthetics and a pragmatic learning workflow.",
    type: "website",
  },
  metadataBase: new URL("https://synapse.local"),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${font.className} bg-canvas text-foreground`}>
        <div className="relative min-h-screen overflow-hidden">
          <div className="pointer-events-none fixed inset-0">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,#3B82F680_0%,transparent_45%),radial-gradient(circle_at_80%_0%,#A855F780_0%,transparent_40%),radial-gradient(circle_at_50%_80%,#EC489980_0%,transparent_45%)] blur-[80px]" />
            <div
              className="absolute inset-0 opacity-60 mix-blend-screen"
              style={{
                backgroundImage:
                  "linear-gradient(120deg, rgba(15,23,42,.65), transparent 60%), repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0, rgba(255,255,255,0.03) 1px, transparent 1px, transparent 60px)",
              }}
            />
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 30%, #fff 0.5px, transparent 0)",
                backgroundSize: "120px 120px",
              }}
            />
          </div>
          <div className="relative z-10">{children}</div>
        </div>
      </body>
    </html>
  );
}
