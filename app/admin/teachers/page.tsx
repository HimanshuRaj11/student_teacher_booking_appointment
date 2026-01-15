"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Teacher {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    department: string;
    subject: string;
}

export default function TeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeachers();
    }, []);

    const fetchTeachers = async () => {
        try {
            const res = await fetch("/api/admin/teachers");
            if (res.ok) {
                const data = await res.json();
                setTeachers(data);
            }
        } catch (error) {
            console.error("Failed to fetch teachers", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Teachers</h1>
                <Link href="/admin/teachers/add">
                    <Button>Add Teacher</Button>
                </Link>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teachers.map((teacher) => (
                        <Card key={teacher._id}>
                            <CardHeader>
                                <CardTitle>{teacher.user.name}</CardTitle>
                                <p className="text-sm text-gray-500">{teacher.user.email}</p>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Dept:</strong> {teacher.department}</p>
                                <p><strong>Subject:</strong> {teacher.subject}</p>
                            </CardContent>
                        </Card>
                    ))}
                    {teachers.length === 0 && <p>No teachers found.</p>}
                </div>
            )}
        </div>
    );
}
