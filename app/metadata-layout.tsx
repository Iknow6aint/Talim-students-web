import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Talim Students",
  description:
    "Talim Student Portal - Access your academic dashboard, subjects, resources, timetable, attendance, results, and messages.",
  keywords: [
    "education",
    "student portal",
    "academic",
    "school management",
    "talim",
    "learning",
  ],
  authors: [{ name: "Talim Education" }],
  creator: "Talim Education",
  publisher: "Talim Education",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://students.talim.edu"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: "Talim Students",
    title: "Talim Students",
    description:
      "Access your academic dashboard, subjects, resources, timetable, attendance, results, and messages.",
    images: [
      {
        url: "/icons/talim.png",
        width: 1200,
        height: 630,
        alt: "Talim Education Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Talim Students",
    description:
      "Access your academic dashboard, subjects, resources, timetable, attendance, results, and messages.",
    images: ["/icons/talim.png"],
  },
  robots: {
    index: false, // Private student portal
    follow: false,
    noarchive: true,
    nosnippet: true,
    noimageindex: true,
  },
  icons: {
    icon: [
      { url: "/icons/talim.svg", type: "image/svg+xml" },
      { url: "/icons/talim.png", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: "/icons/talim.png",
  },
  manifest: "/manifest.json",
  verification: {
    // Add verification codes if needed
  },
};

export default function RootMetadataLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
