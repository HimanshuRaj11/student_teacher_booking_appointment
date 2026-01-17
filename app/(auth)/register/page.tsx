"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import Link from "next/link";
import axios from "axios";
import { UserPlus, Mail, Lock, User, GraduationCap, BookOpen, Calendar, AlertCircle } from "lucide-react";

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        studentId: "",
        course: "",
        year: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        try {
            await axios.post("/api/auth/register", { ...formData, role: "student" });
            router.push("/login");
        } catch (err: unknown) {
            const errorMessage = (err as { response?: { data?: { error?: string } }, message?: string })?.response?.data?.error ||
                (err as { message?: string })?.message || "Registration failed";
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
                            <UserPlus className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                    </div>
                    <CardTitle className="text-center text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                        Student Registration
                    </CardTitle>
                    <CardDescription className="text-center text-base">
                        Create your student account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleRegister} className="space-y-4">
                        {error && (
                            <div className="flex items-center gap-2 p-3 text-sm text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                                <span>{error}</span>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="name" className="flex items-center gap-2 text-sm font-medium">
                                <User className="h-4 w-4" />
                                Full Name
                            </Label>
                            <Input id="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="email" className="flex items-center gap-2 text-sm font-medium">
                                <Mail className="h-4 w-4" />
                                Email
                            </Label>
                            <Input id="email" type="email" placeholder="john@example.com" value={formData.email} onChange={handleChange} required className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="flex items-center gap-2 text-sm font-medium">
                                <Lock className="h-4 w-4" />
                                Password
                            </Label>
                            <Input id="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} required minLength={6} className="h-11" />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="studentId" className="flex items-center gap-2 text-sm font-medium">
                                <GraduationCap className="h-4 w-4" />
                                Student ID
                            </Label>
                            <Input id="studentId" placeholder="S12345" value={formData.studentId} onChange={handleChange} required className="h-11" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="course" className="flex items-center gap-2 text-sm font-medium">
                                    <BookOpen className="h-4 w-4" />
                                    Course
                                </Label>
                                <Input id="course" placeholder="B.Tech" value={formData.course} onChange={handleChange} required className="h-11" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="year" className="flex items-center gap-2 text-sm font-medium">
                                    <Calendar className="h-4 w-4" />
                                    Year
                                </Label>
                                <Input id="year" placeholder="3rd Year" value={formData.year} onChange={handleChange} required className="h-11" />
                            </div>
                        </div>

                        <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow-lg hover:shadow-xl transition-all" disabled={loading}>
                            {loading ? (
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating account...
                                </div>
                            ) : (
                                "Create Account"
                            )}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col space-y-3 border-t pt-6">
                    <p className="text-sm text-muted-foreground text-center">
                        Are you a teacher?{" "}
                        <Link href="/teacher-register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-medium">
                            Register as Teacher
                        </Link>
                    </p>
                    <p className="text-sm text-muted-foreground text-center">
                        Already have an account?{" "}
                        <Link href="/login" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
                            Login here
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}
