import type { Metadata } from "next";
import { Geist, Story_Script } from "next/font/google";
import "./globals.css";
import TableOfContents from "./components/TableOfContents";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const storyScript = Story_Script({
  weight: "400",
  variable: "--font-story-script",
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
    <html lang="en" className={`${geistSans.variable} ${storyScript.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <TableOfContents />
      </body>
    </html>
  );
}
