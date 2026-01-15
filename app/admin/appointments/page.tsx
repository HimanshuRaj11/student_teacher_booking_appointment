"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { format } from "date-fns"; // Need to install date-fns or use native

interface Appointment {
    _id: string;
    student: { name: string; email: string };
    teacher: { name: string; email: string };
    date: string;
    status: string;
    message: string;
}

export default function AppointmentsPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch("/api/admin/appointments");
            if (res.ok) {
                setAppointments(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">All Appointments</h1>

            {loading ? <p>Loading...</p> : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <Card key={apt._id}>
                            <CardHeader>
                                <CardTitle className="text-lg">
                                    {apt.student?.name} with {apt.teacher?.name}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex justify-between">
                                    <div>
                                        <p className="text-sm text-gray-500">Date: {new Date(apt.date).toLocaleString()}</p>
                                        <p className="text-sm">Message: {apt.message}</p>
                                    </div>
                                    <div className="capitalize font-bold">
                                        Status: {apt.status}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                    {appointments.length === 0 && <p>No appointments found.</p>}
                </div>
            )}
        </div>
    );
}
