import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ROAMR | Global eSIM for Travelers",
  description: "Stay connected worldwide with instant eSIM activation. No physical SIM cards, no roaming fees. Travel smarter with ROAMR.",
  keywords: ["eSIM", "travel", "roaming", "international data", "mobile data", "global connectivity"],
  authors: [{ name: "ROAMR" }],
  openGraph: {
    title: "ROAMR | Global eSIM for Travelers",
    description: "Stay connected worldwide with instant eSIM activation. No physical SIM cards, no roaming fees.",
    type: "website",
    locale: "en_US",
    siteName: "ROAMR",
  },
  twitter: {
    card: "summary_large_image",
    title: "ROAMR | Global eSIM for Travelers",
    description: "Stay connected worldwide with instant eSIM activation.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link href="https://api.fontshare.com/v2/css?f[]=satoshi@400,500,700,900&display=swap" rel="stylesheet" />
      </head>
      <body
        className={`${inter.variable} font-sans bg-[var(--bg)] text-[var(--text)] antialiased`}
      >
        <SessionProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
