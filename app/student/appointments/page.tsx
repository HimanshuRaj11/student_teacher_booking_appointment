"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Appointment {
    _id: string;
    teacher: { name: string; email: string };
    date: string;
    status: string;
    message: string;
    teacherNote?: string;
}

export default function StudentAppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch("/api/students/appointments");
            if (res.ok) setAppointments(await res.json());
        } catch (e) { }
        finally { setLoading(false); }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">My Appointments</h1>

            {loading ? <p>Loading...</p> : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <Card key={apt._id}>
                            <CardHeader>
                                <CardTitle className="flex justify-between items-center">
                                    <span>{apt.teacher?.name}</span>
                                    <span className={`text-sm px-2 py-1 rounded capitalize ${apt.status === 'approved' ? 'bg-green-100 text-green-800' : apt.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                                        {apt.status}
                                    </span>
                                </CardTitle>
                                <p className="text-xs text-gray-500">{apt.teacher?.email}</p>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Date:</strong> {new Date(apt.date).toLocaleString()}</p>
                                <p><strong>Message:</strong> {apt.message}</p>
                                {apt.teacherNote && <p className="mt-2 text-sm bg-gray-100 p-2 rounded"><strong>Note:</strong> {apt.teacherNote}</p>}
                            </CardContent>
                        </Card>
                    ))}
                    {appointments.length === 0 && <p>No appointments found.</p>}
                </div>
            )}
        </div>
    );
}
