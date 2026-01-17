"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, User, BookOpen, AlertCircle, CheckCircle, GraduationCap } from "lucide-react";

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
}

interface TeacherData {
    teacher: {
        user: {
            _id: string;
            name: string;
        };
        department: string;
        subject: string;
        bio?: string;
    };
    slots: Slot[];
}

export default function BookAppointmentPage({ params }: { params: Promise<{ teacherId: string }> }) {
    const router = useRouter();
    const [data, setData] = useState<TeacherData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [message, setMessage] = useState("");
    const [teacherIdUnwrapped, setTeacherIdUnwrapped] = useState<string>("");
    const [booking, setBooking] = useState(false);
    const [bookingSuccess, setBookingSuccess] = useState(false);

    useEffect(() => {
        params.then(unwrapped => {
            setTeacherIdUnwrapped(unwrapped.teacherId);
            fetchData(unwrapped.teacherId);
        });
    }, [params]);

    const fetchData = async (id: string) => {
        try {
            setLoading(true);
            setError(null);

            const res = await fetch(`/api/teachers/${id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || `Error: ${res.status}`);
            }

            const responseData = await res.json();
            setData(responseData);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Failed to load teacher information";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleBook = async () => {
        if (!selectedSlot) {
            setError("Please select a time slot");
            return;
        }

        if (!message.trim()) {
            setError("Please provide a reason for the appointment");
            return;
        }

        const slotObj = data?.slots.find((s) => s._id === selectedSlot);
        if (!slotObj || !data) return;

        try {
            setBooking(true);
            setError(null);

            const res = await fetch("/api/appointments/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    teacherId: data.teacher.user._id,
                    slotId: selectedSlot,
                    date: slotObj.date,
                    message: message.trim()
                }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.error || "Failed to book appointment");
            }

            setBookingSuccess(true);

            setTimeout(() => {
                router.push("/student/appointments");
            }, 1500);
        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : "Error booking appointment";
            setError(errorMessage);
        } finally {
            setBooking(false);
        }
    };

    const formatSlotDate = (dateString: string) => {
        const date = new Date(dateString);
        return {
            full: date.toLocaleDateString('en-US', {
                weekday: 'short',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            }),
            short: date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
            })
        };
    };

    const isSlotToday = (dateString: string) => {
        const slotDate = new Date(dateString);
        const today = new Date();
        return slotDate.toDateString() === today.toDateString();
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <div className="flex items-center justify-center py-12">
                    <div className="flex flex-col items-center gap-3">
                        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="text-gray-600">Loading teacher information...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error && !data) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="flex items-center justify-between">
                        <span>{error}</span>
                        <button
                            onClick={() => fetchData(teacherIdUnwrapped)}
                            className="text-sm underline hover:no-underline"
                        >
                            Try again
                        </button>
                    </AlertDescription>
                </Alert>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="max-w-2xl mx-auto space-y-6">
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <User className="w-12 h-12 text-gray-400 mb-3" />
                        <p className="text-gray-600 font-medium">Teacher not found</p>
                        <Button
                            variant="outline"
                            className="mt-4"
                            onClick={() => router.back()}
                        >
                            Go Back
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {bookingSuccess && (
                <Alert className="border-green-200 bg-green-50">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                        Appointment booked successfully! Redirecting...
                    </AlertDescription>
                </Alert>
            )}

            {error && !bookingSuccess && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <Card>
                <CardHeader className="space-y-3">
                    <div className="flex items-start gap-3">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                            <CardTitle className="text-2xl">Book Appointment</CardTitle>
                            <p className="text-lg font-semibold text-gray-900 mt-1">
                                {data.teacher.user.name}
                            </p>
                            <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                                <BookOpen className="w-4 h-4" />
                                <span>{data.teacher.department} • {data.teacher.subject}</span>
                            </div>
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {data.teacher.bio && (
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <p className="text-sm text-gray-700 italic">{data.teacher.bio}</p>
                        </div>
                    )}

                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5 text-gray-600" />
                            <h3 className="font-semibold text-lg">Available Time Slots</h3>
                        </div>

                        {data.slots.length === 0 ? (
                            <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed">
                                <Clock className="w-10 h-10 text-gray-400 mx-auto mb-2" />
                                <p className="text-gray-600 font-medium">No available slots</p>
                                <p className="text-sm text-gray-500 mt-1">Please check back later</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                                {data.slots.map((slot) => {
                                    const { full, short } = formatSlotDate(slot.date);
                                    const isToday = isSlotToday(slot.date);

                                    return (
                                        <Button
                                            key={slot._id}
                                            variant={selectedSlot === slot._id ? "default" : "outline"}
                                            onClick={() => {
                                                setSelectedSlot(slot._id);
                                                setError(null);
                                            }}
                                            className="h-auto py-3 flex flex-col items-center gap-1 relative"
                                        >
                                            {isToday && (
                                                <span className="absolute top-1 right-1 text-[10px] bg-orange-500 text-white px-1.5 py-0.5 rounded">
                                                    Today
                                                </span>
                                            )}
                                            <span className="font-medium text-sm">{short}</span>
                                            <span className="text-xs opacity-80">
                                                {slot.startTime} - {slot.endTime}
                                            </span>
                                        </Button>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="message" className="text-base font-semibold">
                            Reason for Appointment <span className="text-red-500">*</span>
                        </Label>
                        <Textarea
                            id="message"
                            value={message}
                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
                                setMessage(e.target.value);
                                setError(null);
                            }}
                            placeholder="Please describe the reason for your appointment (e.g., dissertation discussion, course guidance, project review...)"
                            className="min-h-[100px] resize-none"
                            maxLength={500}
                        />
                        <p className="text-xs text-gray-500 text-right">
                            {message.length}/500 characters
                        </p>
                    </div>

                    <Button
                        className="w-full"
                        onClick={handleBook}
                        disabled={!selectedSlot || !message.trim() || booking || bookingSuccess}
                        size="lg"
                    >
                        {booking ? (
                            <>
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                Booking...
                            </>
                        ) : bookingSuccess ? (
                            <>
                                <CheckCircle className="w-4 h-4 mr-2" />
                                Booked Successfully
                            </>
                        ) : (
                            <>
                                <Calendar className="w-4 h-4 mr-2" />
                                Confirm Booking
                            </>
                        )}
                    </Button>

                    {selectedSlot && (
                        <p className="text-xs text-center text-gray-500">
                            Selected: {formatSlotDate(data.slots.find(s => s._id === selectedSlot)?.date || '').full}
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}