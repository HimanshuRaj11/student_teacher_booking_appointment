"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calendar, Mail, MessageSquare, StickyNote, AlertCircle } from "lucide-react";

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
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch("/api/students/appointments", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || `Error: ${res.status}`);
            }

            const data = await res.json();
            setAppointments(data);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Failed to load appointments";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const getStatusStyles = (status: string) => {
        const styles = {
            approved: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/30 dark:text-green-400 dark:border-green-800",
            cancelled: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
            pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-400 dark:border-yellow-800",
            rejected: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700"
        };
        return styles[status as keyof typeof styles] || styles.pending;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            date: date.toLocaleDateString('en-US', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            }),
            time: date.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            })
        };
    };

    if (loading) {
        return (
            <div className="space-y-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Appointments</h1>
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-600 dark:border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600 dark:text-gray-400">Loading your appointments...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Appointments</h1>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                    Total: <span className="font-semibold">{appointments.length}</span>
                </div>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={fetchAppointments}
                            className="text-sm underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </AlertDescription>
                </Alert>
            )}

            {!error && appointments.length === 0 && (
                <Card className="border-dashed dark:border-gray-800 bg-transparent">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <Calendar className="w-12 h-12 text-gray-400 dark:text-gray-600 mb-3" />
                        <p className="text-gray-600 dark:text-gray-400 font-medium">No appointments yet</p>
                        <p className="text-sm text-gray-500 dark:text-gray-500 mt-1">Your scheduled appointments will appear here</p>
                    </CardContent>
                </Card>
            )}

            <div className="space-y-4">
                {appointments.map((apt) => {
                    const { date, time } = formatDate(apt.date);
                    return (
                        <Card key={apt._id} className="hover:shadow-md transition-shadow dark:bg-gray-900/50 dark:border-gray-800">
                            <CardHeader className="pb-3">
                                <CardTitle className="flex justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{apt.teacher?.name || "Unknown Teacher"}</div>
                                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400 font-normal mt-1">
                                            <Mail className="w-3 h-3" />
                                            {apt.teacher?.email || "No email"}
                                        </div>
                                    </div>
                                    <span className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${getStatusStyles(apt.status)}`}>
                                        {apt.status}
                                    </span>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-start gap-2">
                                    <Calendar className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="font-medium text-sm text-gray-900 dark:text-gray-100">{date}</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">{time}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2">
                                    <MessageSquare className="w-4 h-4 text-gray-600 dark:text-gray-400 mt-0.5" />
                                    <div>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Your Message</p>
                                        <p className="text-sm mt-0.5 text-gray-700 dark:text-gray-300">{apt.message}</p>
                                    </div>
                                </div>

                                {apt.teacherNote && (
                                    <div className="flex items-start gap-2 mt-3 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-900/30">
                                        <StickyNote className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5" />
                                        <div className="flex-1">
                                            <p className="text-xs text-blue-700 dark:text-blue-400 font-medium">Teacher{"'"}s Note</p>
                                            <p className="text-sm text-blue-900 dark:text-blue-300 mt-0.5">{apt.teacherNote}</p>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </div>
        </div>
    );
}
