import type { Metadata } from "next";
import { Saira_Extra_Condensed } from "next/font/google";
import "./globals.css";
import TableOfContents from "./components/TableOfContents";

const sairaExtraCondensed = Saira_Extra_Condensed({
  variable: "--font-saira-extra-condensed",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
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
    <html lang="en">
      <body className={`${sairaExtraCondensed.variable} antialiased`}>
        {children}
        <TableOfContents />
      </body>
    </html>
  );
}
