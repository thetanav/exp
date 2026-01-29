import type { Metadata, Viewport } from "next";
import "@/app/globals.css";
import { Geist, Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";

import { createMetadata } from "@/lib/seo";
import { ThemeProvider } from "@/components/theme-provider";

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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
        >
          <div className="w-full min-h-screen h-screen max-w-md mx-auto border-l border-r">
            {children}
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
