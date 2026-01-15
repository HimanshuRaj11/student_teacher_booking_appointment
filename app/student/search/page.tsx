"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Teacher {
    _id: string;
    user: { name: string; email: string };
    department: string;
    subject: string;
}

export default function SearchTeachersPage() {
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [query, setQuery] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTeachers();
    }, [query]);

    const fetchTeachers = async () => {
        try {
            const res = await fetch(`/api/teachers/search?query=${query}`);
            if (res.ok) {
                setTeachers(await res.json());
            }
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Find a Teacher</h1>

            <div className="flex gap-4">
                <Input
                    placeholder="Search by Name, Department, or Subject..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className="max-w-md"
                />
                <Button onClick={fetchTeachers}>Search</Button>
            </div>

            {loading ? <p>Loading...</p> : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teachers.map((t) => (
                        <Card key={t._id}>
                            <CardHeader>
                                <CardTitle>{t.user.name}</CardTitle>
                                <p className="text-sm text-gray-500">{t.department}</p>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Subject:</strong> {t.subject}</p>
                            </CardContent>
                            <CardFooter>
                                <Link href={`/student/book/${t._id}`} className="w-full">
                                    <Button className="w-full">Book Appointment</Button>
                                </Link>
                            </CardFooter>
                        </Card>
                    ))}
                    {teachers.length === 0 && <p>No teachers found.</p>}
                </div>
            )}
        </div>
    );
}
