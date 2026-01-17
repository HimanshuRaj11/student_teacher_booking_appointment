"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function StudentLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { name: "Dashboard", href: "/student" },
        { name: "Find Teacher", href: "/student/search" },
        { name: "My Appointments", href: "/student/appointments" },
    ];

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-blue-900 text-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8">Student Portal</h2>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "block px-4 py-2 rounded transition-colors",
                                pathname === item.href
                                    ? "bg-blue-700 text-white"
                                    : "text-blue-100 hover:bg-blue-800"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Button
                        variant="destructive"
                        className="w-full mt-8"
                        onClick={logout}
                    >
                        Logout
                    </Button>
                </nav>
            </aside>

            <main className="flex-1 bg-blue-50 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
