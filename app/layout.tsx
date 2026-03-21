import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeScript from "./theme-script";
import TopBar from "@/components/topBar";
import { SessionProvider } from "next-auth/react";
import Footer from "@/components/Footer";

import Providers from "./providers";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "10GPA – GGSIPU B.Tech Study Materials, Syllabus & PYQs",
  description:
    "10GPA provides free B.Tech study materials, previous year questions, and resources to help you ace your exams.",
  keywords: [
    "10GPA",
    "B.Tech notes",
    "ggsipu pyqs",
    "btech pyqs",
    "ipu pyqs",
    "ipu study materials pyqs",
    "ggsipu pyqs",
    "study materials",
    "PYQs",
    "exam preparation",
  ],
  openGraph: {
    title: "10GPA – GGSIPU B.Tech Study Materials, Notes & PYQs",
    description:
      "10GPA provides free B.Tech study materials, notes, previous year questions, and resources to help you ace your exams.",
    url: "https://10gpa.in",
    siteName: "10GPA",

    images: [
      {
        url: "https://10gpa.in/og-image.png", // Replace with your actual image URL
        width: 1200,
        height: 630,
        alt: "10GPA Study Materials",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "10GPA – GGSIPU B.Tech Study Materials, Notes & PYQs",
    description:
      "10GPA provides free B.Tech study materials, notes, previous year questions, and resources to help you ace your exams.",
    images: ["https://10gpa.in/og-image.png"],
  },
  icons: {
    icon: "/og-image-removebg-preview.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="...">
        <ThemeScript />

        <Providers>
          <main className="">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
