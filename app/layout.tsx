import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from 'next/link';

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
          {/* Simple Global Header */}
          <header className="border-b bg-white dark:bg-gray-950 px-6 py-4 flex justify-between items-center">
            <Link href="/" className="font-bold text-xl">EduBook</Link>
            <div className="space-x-4 text-sm">
              <Link href="/login" className="hover:underline">Login</Link>
              <Link href="/register" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Get Started</Link>
            </div>
          </header>

          <main className="flex-1">
            {children}
          </main>

          <footer className="border-t py-6 text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} EduBook System
          </footer>
        </div>
      </body>
    </html>
  );
}
