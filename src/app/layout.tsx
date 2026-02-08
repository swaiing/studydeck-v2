import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { AuthSessionProvider } from "@/components/layout/session-provider";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: {
    default: "Studydeck - Smart Flashcard Study Platform",
    template: "%s | Studydeck",
  },
  description: "Create, study, and share flashcard decks. Join study groups, track your progress, and master any subject with Studydeck's intelligent study tools.",
  keywords: ["flashcards", "study", "learning", "education", "memorization", "spaced repetition", "study groups", "collaboration"],
  authors: [{ name: "Studydeck" }],
  creator: "Studydeck",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://studydeck.app",
    title: "Studydeck - Smart Flashcard Study Platform",
    description: "Create, study, and share flashcard decks. Join study groups and master any subject.",
    siteName: "Studydeck",
  },
  twitter: {
    card: "summary_large_image",
    title: "Studydeck - Smart Flashcard Study Platform",
    description: "Create, study, and share flashcard decks. Join study groups and master any subject.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthSessionProvider>{children}</AuthSessionProvider>
      </body>
    </html>
  );
}
