"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { LogIn, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
    const router = useRouter();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            const res = await axios.post("/api/auth/login", { email, password });
            const data = res.data;

            // Trigger auth context refresh
            login();

            // Redirect based on role
            if (data.user.role === "admin") router.push("/admin");
            else if (data.user.role === "teacher") router.push("/teacher");
            else router.push("/student");

        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error ||
                (err as { message?: string })?.message || "Login failed";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 px-4 py-8">
            <Card className="w-full max-w-md shadow-2xl border-0 dark:bg-gray-900/50 backdrop-blur">
                <CardHeader className="space-y-1">
                    <div className="flex items-center justify-center mb-2">
                        <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                            <LogIn className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Welcome Back
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        Sign in to access your dashboard
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-5">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium flex items-center gap-2">
                                <Lock className="h-4 w-4" />
                                Password
                            </Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="h-11"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Signing in...
                                </div>
                            ) : (
                                "Sign In"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 border-t pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                        Don{"'"}t have an account?{" "}
                        <Link href="/register" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Register as Student
                        </Link>
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                        Are you a teacher?{" "}
                        <Link href="/teacher-register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                            Register here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
