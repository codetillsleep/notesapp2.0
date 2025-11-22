import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeScript from "./theme-script";
import TopBar from "@/components/topBar";
import Footer from "@/components/Footer";

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
    <html lang="en">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  const savedTheme = localStorage.getItem('theme');
                  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                  if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
                    document.documentElement.classList.add('dark');
                  } else {
                    document.documentElement.classList.remove('dark');
                  }
                  document.documentElement.dataset.themeLoaded = "true";
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>

      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-text`}
      >
        <TopBar />
        <main className="pt-20">{children}</main> <Footer />
      </body>
    </html>
  );
}
