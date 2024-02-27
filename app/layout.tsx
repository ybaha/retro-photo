import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Inter as FontSans } from "next/font/google";
import { cn } from "@/lib/utils";
import Header from "@/components/header";
import { Toaster } from "@/components/ui/toaster";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body
        className={cn(
          "min-h-screen bg-background text-foreground font-sans antialiased",
          fontSans.variable
        )}
      >
        <main className="min-h-screen flex flex-col items-center">
          <Header />
          <Toaster />
          {children}
        </main>
      </body>
    </html>
  );
}
