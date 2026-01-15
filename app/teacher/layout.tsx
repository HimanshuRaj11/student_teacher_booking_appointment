"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export default function TeacherLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/teacher" },
        { name: "Profile", href: "/teacher/profile" },
        { name: "Availability", href: "/teacher/availability" },
        { name: "Appointments", href: "/teacher/appointments" },
    ];

    const handleLogout = () => {
        document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;";
        window.location.href = "/login";
    };

    return (
        <div className="flex min-h-screen">
            <aside className="w-64 bg-green-900 text-white p-6 hidden md:block">
                <h2 className="text-2xl font-bold mb-8">Teacher Portal</h2>
                <nav className="space-y-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "block px-4 py-2 rounded transition-colors",
                                pathname === item.href
                                    ? "bg-green-700 text-white"
                                    : "text-green-100 hover:bg-green-800"
                            )}
                        >
                            {item.name}
                        </Link>
                    ))}
                    <Button
                        variant="destructive"
                        className="w-full mt-8"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>
                </nav>
            </aside>

            <main className="flex-1 bg-green-50 p-8 overflow-auto">
                {children}
            </main>
        </div>
    );
}
