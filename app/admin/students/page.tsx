"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Student {
    _id: string;
    user: {
        name: string;
        email: string;
    };
    studentId: string;
    course: string;
    year: string;
    isApproved: boolean;
}

export default function StudentsPage() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await fetch("/api/admin/students");
            if (res.ok) {
                const data = await res.json();
                setStudents(data);
            }
        } catch (error) {
            console.error("Failed to fetch students", error);
        } finally {
            setLoading(false);
        }
    };

    const toggleApproval = async (id: string, currentStatus: boolean) => {
        try {
            const res = await fetch("/api/admin/students", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ studentId: id, isApproved: !currentStatus }),
            });

            if (res.ok) {
                setStudents(students.map(s => s._id === id ? { ...s, isApproved: !currentStatus } : s));
            }
        } catch (error) {
            console.error("Failed to update status", error);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Students</h1>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {students.map((student) => (
                        <Card key={student._id} className={student.isApproved ? "border-green-200" : "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/10"}>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium">
                                    {student.user?.name || "Unknown"}
                                </CardTitle>
                                <div className={`px-2 py-1 rounded text-xs ${student.isApproved ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                    {student.isApproved ? "Approved" : "Pending"}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-sm text-gray-500 mb-2">{student.user?.email}</p>
                                <p className="text-xs">ID: {student.studentId}</p>
                                <p className="text-xs">Course: {student.course} ({student.year})</p>

                                <Button
                                    variant={student.isApproved ? "destructive" : "default"}
                                    size="sm"
                                    className="mt-4 w-full"
                                    onClick={() => toggleApproval(student._id, student.isApproved)}
                                >
                                    {student.isApproved ? "Revoke Access" : "Approve Registration"}
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                    {students.length === 0 && <p>No students found.</p>}
                </div>
            )}
        </div>
    );
}
