import "@/app/globals.css";
import { Geist, Inter } from "next/font/google";

const inter = Inter({subsets:['latin'],variable:'--font-sans'});

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body
        className={`${geist.className} min-h-screen bg-background text-foreground`}>
        <div className="w-full min-h-screen max-w-md mx-auto border border-l border-r">
          {children}
        </div>
      </body>
    </html>
  );
}
