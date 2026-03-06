import type { Metadata } from "next";
import { Geist, Story_Script, Permanent_Marker } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { TableOfContents } from "./components/TableOfContents";
import { ThemeProvider } from "./context/ThemeContext";
import { ThemeToggle } from "./components/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const storyScript = Story_Script({
  weight: "400",
  variable: "--font-story-script",
  subsets: ["latin"],
});

const permanentMarker = Permanent_Marker({
  weight: "400",
  variable: "--font-permanent-marker",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Alisa Bondar",
  description: "Alisa Bondar's portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${storyScript.variable} ${permanentMarker.variable} light`} suppressHydrationWarning>
      <head />
      <body className="font-sans antialiased">
        <ThemeProvider>
          {children}
          <ThemeToggle />
          <TableOfContents />
          <Analytics />
        </ThemeProvider>
      </body>
    </html>
  );
}
