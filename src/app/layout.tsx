import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { OpportunitiesProvider } from "@/context/opportunities-context";
import { Toaster } from "sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FAST University Research Opportunity Portal | Computer Networks",
  description:
    "Explore, apply, and manage academic faculty research assistantships and lab opportunities across FAST-NUCES departments.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-slate-50/50 text-slate-900 font-sans">
        <OpportunitiesProvider>
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            toastOptions={{
              duration: 4000,
              className: "border border-slate-200 text-sm shadow-lg",
            }}
          />
        </OpportunitiesProvider>
      </body>
    </html>
  );
}
