import "@/app/globals.css";
import { Geist } from "next/font/google";

const geist = Geist({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} min-h-screen bg-background text-foreground`}>
        <div className="w-full min-h-screen max-w-md mx-auto">{children}</div>
      </body>
    </html>
  );
}
