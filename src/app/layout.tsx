import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MindFlow - Emotional Wellness Tracking",
  description: "Track your mood, sleep, and energy patterns to understand and improve your emotional wellbeing. Daily check-ins in under 5 seconds.",
  keywords: ["MindFlow", "emotional wellness", "mood tracking", "mental health", "wellbeing", "self-care", "stress management"],
  authors: [{ name: "MindFlow Team" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "MindFlow - Track Your Emotional Journey",
    description: "Gentle mood and wellness tracking for students and young professionals",
    url: "https://mindflow.app",
    siteName: "MindFlow",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MindFlow - Emotional Wellness Tracking",
    description: "Track your mood, sleep, and energy patterns to understand and improve your emotional wellbeing",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
