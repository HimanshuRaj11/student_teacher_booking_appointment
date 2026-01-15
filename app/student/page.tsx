"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function StudentDashboard() {
    const [stats, setStats] = useState({
        pending: 0,
        approved: 0,
        cancelled: 0,
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Welcome, Student</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-blue-50 border-blue-200">
                    <CardHeader>
                        <CardTitle>Find Teachers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Browse filtered list of teachers and professors.</p>
                        <Link href="/student/search">
                            <Button className="w-full">Search Now</Button>
                        </Link>
                    </CardContent>
                </Card>

                <Card className="bg-green-50 border-green-200">
                    <CardHeader>
                        <CardTitle>My Bookings</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">Check status of your applications.</p>
                        <Link href="/student/appointments">
                            <Button variant="outline" className="w-full">View Bookings</Button>
                        </Link>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
