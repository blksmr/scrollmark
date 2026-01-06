import { Inter } from "next/font/google";
import { Geist_Mono } from 'next/font/google'
import "@/styles/main.css";
import type { Metadata, Viewport } from "next";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = siteConfig;

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geist = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: "400",
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${geist.variable}`}>
        {children}
      </body>
    </html>
  );
}
