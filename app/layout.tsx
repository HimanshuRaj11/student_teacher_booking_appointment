import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import { Providers } from "@/components/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "EduBook - Student Teacher Booking",
  description: "Book appointments with your professors easily.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex flex-col min-h-screen">
          <Providers>
            <Navbar />
            <main className="flex-1">
              {children}
            </main>
          </Providers>

          <footer className="border-t py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EduBook System
          </footer>
        </div>
      </body>
    </html>
  );
}
