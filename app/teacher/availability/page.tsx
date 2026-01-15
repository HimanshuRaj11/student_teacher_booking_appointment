"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface Slot {
    _id: string;
    date: string;
    startTime: string;
    endTime: string;
    isBooked: boolean;
}

export default function AvailabilityPage() {
    const [slots, setSlots] = useState<Slot[]>([]);
    const [loading, setLoading] = useState(true);
    const [newSlot, setNewSlot] = useState({
        date: "",
        startTime: "",
        endTime: "",
    });

    useEffect(() => {
        fetchSlots();
    }, []);

    const fetchSlots = async () => {
        try {
            const res = await fetch("/api/teachers/availability");
            if (res.ok) {
                setSlots(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/teachers/availability", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newSlot),
            });
            if (res.ok) {
                fetchSlots();
                setNewSlot({ date: "", startTime: "", endTime: "" });
            }
        } catch (error) {
            alert("Failed to add slot");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this slot?")) return;
        try {
            await fetch(`/api/teachers/availability?id=${id}`, { method: "DELETE" });
            fetchSlots();
        } catch (e) { }
    };

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold">Manage Availability</h1>

            <Card>
                <CardHeader>
                    <CardTitle>Add New Slot</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="text-sm font-medium">Date</label>
                            <Input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} required />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium">Start Time</label>
                            <Input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} required />
                        </div>
                        <div className="flex-1">
                            <label className="text-sm font-medium">End Time</label>
                            <Input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} required />
                        </div>
                        <Button type="submit">Add Slot</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {slots.map((slot) => (
                    <Card key={slot._id} className={slot.isBooked ? "bg-gray-100 opacity-50" : ""}>
                        <CardContent className="pt-6">
                            <p className="font-bold">{new Date(slot.date).toLocaleDateString()}</p>
                            <p>{slot.startTime} - {slot.endTime}</p>
                            <p className="text-sm text-gray-500">{slot.isBooked ? "Booked" : "Available"}</p>
                            {!slot.isBooked && (
                                <Button variant="destructive" size="sm" className="mt-2" onClick={() => handleDelete(slot._id)}>Delete</Button>
                            )}
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
