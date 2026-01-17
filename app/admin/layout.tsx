"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { logout } = useAuth();

    const navItems = [
        { name: "Dashboard", href: "/admin" },
        { name: "Teachers", href: "/admin/teachers" },
        { name: "Students", href: "/admin/students" },
        { name: "Appointments", href: "/admin/appointments" },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8">Admin Panel</h2>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "block px-4 py-2 rounded transition-colors",
                                pathname === item.href
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-300 hover:bg-gray-800"
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

            {/* Main Content */}
            <main className="flex-1 bg-gray-50 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
