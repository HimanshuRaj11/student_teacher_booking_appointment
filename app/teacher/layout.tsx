'use client'
import { useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
    LayoutDashboard,
    User,
    Calendar,
    Clock,
    LogOut,
    Menu,
    X,
    Bell,
    Settings,
    ChevronRight
} from "lucide-react";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const { logout } = useAuth();

    const navItems = [
        { name: "Dashboard", href: "/teacher", icon: LayoutDashboard },
        { name: "Profile", href: "/teacher/profile", icon: User },
        { name: "Availability", href: "/teacher/availability", icon: Clock },
        { name: "Appointments", href: "/teacher/appointments", icon: Calendar },
    ];

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
            {/* Mobile Sidebar Overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 w-72 bg-gradient-to-b from-emerald-900 via-emerald-800 to-emerald-900 text-white transform transition-transform duration-300 ease-in-out mt-16 ${sidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
                    }`}
            >
                <div className="flex flex-col h-full">

                    {/* Profile Section */}
                    <div className="p-6 border-b border-emerald-700/50">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                DS
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-white truncate">Dr. Smith</h3>
                                <p className="text-sm text-emerald-300 truncate">Computer Science</p>
                            </div>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 overflow-y-auto">
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = pathname === item.href;

                                return (
                                    <Link
                                        key={item.href}
                                        href={item.href}
                                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${isActive
                                            ? "bg-white text-emerald-900 shadow-lg"
                                            : "text-emerald-100 hover:bg-white/10 hover:text-white"
                                            }`}
                                    >
                                        <Icon className={`w-5 h-5 ${isActive ? "text-emerald-600" : ""}`} />
                                        <span className="font-medium flex-1">{item.name}</span>
                                        {isActive && (
                                            <ChevronRight className="w-4 h-4 text-emerald-600" />
                                        )}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Settings Link */}
                        <div className="mt-6 pt-6 border-t border-emerald-700/50">
                            <Link
                                href="/teacher/settings"
                                className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${pathname === "/teacher/settings"
                                    ? "bg-white text-emerald-900 shadow-lg"
                                    : "text-emerald-100 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                <Settings className={`w-5 h-5 ${pathname === "/teacher/settings" ? "text-emerald-600" : ""}`} />
                                <span className="font-medium">Settings</span>
                            </Link>
                        </div>
                    </nav>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-h-screen md:ml-72">
                <main className="flex-1 overflow-auto">
                    <div className="p-4 sm:p-6 lg:p-8">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}