import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Geist, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { createMetadata } from "@/lib/seo";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = createMetadata({ path: "/" });

export const viewport: Viewport = {
  themeColor: [{ media: "(prefers-color-scheme: light)", color: "#ffffff" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geist.className} min-h-screen bg-background text-foreground antialiased`}>
        <div className="w-full min-h-screen h-[100dvh] max-w-md mx-auto border border-l border-r">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
