import type { Metadata } from "next";
import { Playfair_Display, EB_Garamond, Playball } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { TableOfContents } from "./components/TableOfContents";
import { contactLinks } from "./data/career";

// Each font is exposed as a role-named CSS variable (--font-heading, --font-body, --font-handwriting).
const headingFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

const bodyFont = EB_Garamond({
  variable: "--font-body",
  subsets: ["latin"],
});

const handwritingFont = Playball({
  weight: "400",
  variable: "--font-handwriting",
  subsets: ["latin"],
});

const SITE_URL = "https://alisabondar.com";
const BACKGROUND_SRC = "/collage-paper-bg-v2.webp";

/**
 * Runs before first paint: marks the page as waiting for the paper background, then clears the mark once the
 * image is decoded (or after a timeout so a slow network never blocks content). Without JS nothing is hidden.
 * Elements with the `await-background` class stay transparent while the mark is present.
 */
const backgroundGateScript = `(function(){var d=document.documentElement;d.setAttribute('data-bg-pending','');var done=false;function ready(){if(done)return;done=true;d.removeAttribute('data-bg-pending');}var img=new Image();img.onload=function(){img.decode?img.decode().then(ready,ready):ready();};img.onerror=ready;img.src=${JSON.stringify(BACKGROUND_SRC)};setTimeout(ready,2500);})();`;
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
    // suppressHydrationWarning: the gate script toggles a data attribute on <html> before React hydrates.
    <html
      lang="en"
      className={`${headingFont.variable} ${bodyFont.variable} ${handwritingFont.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel="preload" as="image" href={BACKGROUND_SRC} fetchPriority="high" />
        <script dangerouslySetInnerHTML={{ __html: backgroundGateScript }} />
      </head>
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
