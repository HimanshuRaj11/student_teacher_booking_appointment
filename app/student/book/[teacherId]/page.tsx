"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function BookAppointmentPage({ params }: { params: Promise<{ teacherId: string }> }) {
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedSlot, setSelectedSlot] = useState("");
    const [message, setMessage] = useState("");
    const [teacherIdUnwrapped, setTeacherIdUnwrapped] = useState<string>("");

    useEffect(() => {
        params.then(unwrapped => {
            setTeacherIdUnwrapped(unwrapped.teacherId);
            fetchData(unwrapped.teacherId);
        });
    }, [params]);

    const fetchData = async (id: string) => {
        try {
            const res = await fetch(`/api/teachers/${id}`);
            if (res.ok) setData(await res.json());
        } catch (e) { }
        finally { setLoading(false); }
    };

    const handleBook = async () => {
        if (!selectedSlot) return alert("Select a time slot");

        // Find the slot object to get date
        const slotObj = data.slots.find((s: any) => s._id === selectedSlot);

        try {
            const res = await fetch("/api/appointments/book", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                // Send teacher User ID (data.teacher.user._id) not profile ID, as Appointment refs User
                body: JSON.stringify({
                    teacherId: data.teacher.user._id,
                    slotId: selectedSlot,
                    date: slotObj.date,
                    message
                }),
            });

            if (res.ok) {
                alert("Appointment booked!");
                router.push("/student/appointments");
            } else {
                const err = await res.json();
                alert(err.error || "Failed");
            }
        } catch (e) { alert("Error booking"); }
    };

    if (loading) return <p>Loading...</p>;
    if (!data) return <p>Teacher not found</p>;

    return (
        <div className="max-w-2xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle>Book Appointment with {data.teacher.user.name}</CardTitle>
                    <p className="text-sm text-gray-500">{data.teacher.department} - {data.teacher.subject}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {data.teacher.bio && <p className="italic">"{data.teacher.bio}"</p>}

                    <h3 className="font-bold">Available Slots:</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {data.slots.map((slot: any) => (
                            <Button
                                key={slot._id}
                                variant={selectedSlot === slot._id ? "default" : "outline"}
                                onClick={() => setSelectedSlot(slot._id)}
                                className="h-auto py-2 flex flex-col items-center"
                            >
                                <span>{new Date(slot.date).toLocaleDateString()}</span>
                                <span className="text-xs">{slot.startTime} - {slot.endTime}</span>
                            </Button>
                        ))}
                        {data.slots.length === 0 && <p className="col-span-3 text-gray-500">No available slots.</p>}
                    </div>

                    <div className="space-y-2 mt-4">
                        <Label>Reason for Appointment</Label>
                        <Input value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Dissertation discussion..." />
                    </div>

                    <Button className="w-full" onClick={handleBook} disabled={!selectedSlot}>
                        Confirm Booking
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
}
