"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LogOut, User as UserIcon, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
    const { user, loading, logout } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const getDashboardLink = () => {
        if (!user) return "/";
        switch (user.role) {
            case "admin": return "/admin";
            case "teacher": return "/teacher";
            case "student": return "/student";
            default: return "/";
        }
    };

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-8">
                        <Link href="/" className="flex items-center gap-2">
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                                EduBook
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-3">
                        <ThemeToggle />
                        {loading ? (
                            <div className="h-9 w-24 bg-muted rounded animate-pulse"></div>
                        ) : user ? (
                            <>
                                <div className="flex items-center gap-3 mr-2">
                                    <div className="h-9 w-9 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <UserIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-xs text-muted-foreground capitalize">{user.role}</span>
                                    </div>
                                </div>
                                <Link href={getDashboardLink()}>
                                    <Button variant="ghost" className="gap-2">
                                        <LayoutDashboard className="h-4 w-4" />
                                        Dashboard
                                    </Button>
                                </Link>
                                <Button variant="ghost" onClick={logout} className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </>
                        ) : (
                            <>
                                <Link href="/login">
                                    <Button variant="ghost">Login</Button>
                                </Link>
                                <Link href="/register">
                                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center gap-2">
                        <ThemeToggle />
                        <Button variant="ghost" size="icon" onClick={toggleMenu}>
                            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </Button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation */}
            {isMenuOpen && (
                <div className="md:hidden border-t bg-background p-4 space-y-4">
                    {loading ? (
                        <div className="p-4 text-center text-sm text-muted-foreground">Loading...</div>
                    ) : user ? (
                        <>
                            <div className="flex items-center gap-3 px-2 py-3 bg-muted rounded-lg">
                                <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                    <UserIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                </div>
                                <div>
                                    <p className="font-medium">{user.name}</p>
                                    <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
                                </div>
                            </div>
                            <Link href={getDashboardLink()} onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start gap-2">
                                    <LayoutDashboard className="h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                            <Button variant="ghost" onClick={() => { logout(); setIsMenuOpen(false); }} className="w-full justify-start gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
                                <LogOut className="h-4 w-4" />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <div className="space-y-2">
                            <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">Login</Button>
                            </Link>
                            <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                                <Button className="w-full justify-start bg-blue-600 hover:bg-blue-700 text-white">Get Started</Button>
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
