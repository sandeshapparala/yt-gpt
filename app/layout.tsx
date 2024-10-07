import dotenv from 'dotenv';
dotenv.config();

import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "SummAIze - AI-Powered YouTube Video Summarizer & Transcript",
  description: "SummAIze provides instant AI-powered YouTube video summaries, transcripts, mind maps, and interactive chat. Get quick insights from your favorite videos with ease!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased dark bg-slate-900` }
      >
        <Navbar/>
        <div className={""}>
        {children}
        </div>
      </body>
    </html>
  );
}
