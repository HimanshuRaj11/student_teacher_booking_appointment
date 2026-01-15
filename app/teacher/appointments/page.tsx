"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";

interface Appointment {
    _id: string;
    student: { name: string; email: string };
    date: string;
    status: string;
    message: string;
    teacherNote?: string;
}

export default function AppointmentManagementPage() {
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const res = await fetch("/api/teachers/appointments");
            if (res.ok) setAppointments(await res.json());
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const updateStatus = async (id: string, status: string) => {
        try {
            await fetch("/api/teachers/appointments", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId: id, status }),
            });
            fetchAppointments();
        } catch (e) { }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Appointment Requests</h1>

            {loading ? <p>Loading...</p> : (
                <div className="space-y-4">
                    {appointments.map((apt) => (
                        <Card key={apt._id} className={apt.status === "pending" ? "border-blue-300 bg-blue-50" : ""}>
                            <CardHeader>
                                <CardTitle className="flex justify-between">
                                    <span>{apt.student?.name}</span>
                                    <span className={`text-sm px-2 py-1 rounded ${apt.status === 'approved' ? 'bg-green-200' : apt.status === 'cancelled' ? 'bg-red-200' : 'bg-yellow-200'}`}>
                                        {apt.status}
                                    </span>
                                </CardTitle>
                                <p className="text-sm text-gray-500">{new Date(apt.date).toLocaleString()}</p>
                            </CardHeader>
                            <CardContent>
                                <p><strong>Message:</strong> {apt.message}</p>
                            </CardContent>
                            <CardFooter className="gap-2 justify-end">
                                {apt.status === "pending" && (
                                    <>
                                        <Button variant="outline" className="text-green-600 border-green-200 hover:bg-green-100" onClick={() => updateStatus(apt._id, 'approved')}>Approve</Button>
                                        <Button variant="destructive" onClick={() => updateStatus(apt._id, 'cancelled')}>Reject</Button>
                                    </>
                                )}
                                {apt.status === "approved" && (
                                    <Button variant="outline" onClick={() => updateStatus(apt._id, 'cancelled')}>Cancel</Button>
                                )}
                            </CardFooter>
                        </Card>
                    ))}
                    {appointments.length === 0 && <p>No appointments.</p>}
                </div>
            )}
        </div>
    );
}
