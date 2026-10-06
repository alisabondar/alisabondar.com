import type { Metadata } from "next";
import { Geist, Story_Script, Permanent_Marker } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { TableOfContents } from "./components/TableOfContents";
import { contactLinks } from "./data/career";

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

const SITE_URL = "https://alisabondar.com";
const TITLE = "Alisa Bondar | Software Engineer";
const DESCRIPTION =
  "Full-stack engineer who went from the operating room to shipping LLM-powered products. My journey, projects, and impact.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: "Alisa Bondar",
    title: TITLE,
    description: DESCRIPTION,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
};

/** Structured data so search engines can connect this site to the same person on LinkedIn/GitHub. */
const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Alisa Bondar",
  url: SITE_URL,
  jobTitle: "Software Engineer",
  sameAs: contactLinks.filter((link) => link.url.startsWith("https://")).map((link) => link.url),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${storyScript.variable} ${permanentMarker.variable}`}>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          // Static data; escaping "<" still guards against a "</script>" ever ending up in it.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
        {children}
        <TableOfContents />
        <Analytics />
      </body>
    </html>
  );
}
