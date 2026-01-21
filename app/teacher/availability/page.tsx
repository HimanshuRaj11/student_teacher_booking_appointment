"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, Clock, Trash2, Plus, Loader2, CalendarDays } from "lucide-react";

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
    const [submitting, setSubmitting] = useState(false);
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
                const data = await res.json();
                setSlots(data.sort((a: Slot, b: Slot) => new Date(a.date).getTime() - new Date(b.date).getTime()));
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
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
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this availability slot?")) return;
        try {
            await fetch(`/api/teachers/availability?id=${id}`, { method: "DELETE" });
            setSlots(slots.filter(s => s._id !== id));
        } catch (e) { }
    };

    return (
        <div className="max-w-6xl mx-auto py-10 px-4 space-y-10">
            <div className="flex flex-col gap-2">
                <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">Manage Availability</h1>
                <p className="text-muted-foreground text-lg">Set your teaching hours and manage your upcoming available slots.</p>
            </div>

            <Card className="border-primary/10 shadow-lg">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Plus className="w-5 h-5 text-primary" />
                        Add New Slot
                    </CardTitle>
                    <CardDescription>Define a new time window when you are available for bookings.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-4 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Date</label>
                            <Input type="date" value={newSlot.date} onChange={(e) => setNewSlot({ ...newSlot, date: e.target.value })} required className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">Start Time</label>
                            <Input type="time" value={newSlot.startTime} onChange={(e) => setNewSlot({ ...newSlot, startTime: e.target.value })} required className="w-full" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold">End Time</label>
                            <Input type="time" value={newSlot.endTime} onChange={(e) => setNewSlot({ ...newSlot, endTime: e.target.value })} required className="w-full" />
                        </div>
                        <Button type="submit" disabled={submitting} className="w-full h-10">
                            {submitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
                            Add Slot
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold flex items-center gap-2">
                        <CalendarDays className="w-6 h-6" />
                        Your Availability
                    </h2>
                    <Badge variant="outline" className="px-3 py-1">{slots.length} Total Slots</Badge>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20 space-y-4">
                        <Loader2 className="w-10 h-10 animate-spin text-primary" />
                        <p className="text-muted-foreground animate-pulse">Loading your schedule...</p>
                    </div>
                ) : slots.length === 0 ? (
                    <Card className="bg-muted/30 border-dashed border-2">
                        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                            <CalendarIcon className="w-16 h-16 text-muted-foreground/20 mb-4" />
                            <p className="text-xl font-medium text-muted-foreground">No availability slots found</p>
                            <p className="text-sm text-muted-foreground mt-1">Start by adding a new slot using the form above.</p>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {slots.map((slot) => (
                            <Card key={slot._id} className={`group transition-all duration-200 hover:shadow-md ${slot.isBooked ? "bg-muted/50 opacity-80" : "bg-card hover:border-primary/30"}`}>
                                <CardContent className="p-6">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2 text-primary font-bold">
                                                <CalendarIcon className="w-4 h-4" />
                                                {new Date(slot.date).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                                            </div>
                                            <div className="flex items-center gap-2 text-muted-foreground text-sm">
                                                <Clock className="w-4 h-4" />
                                                {slot.startTime} - {slot.endTime}
                                            </div>
                                        </div>
                                        <Badge variant={slot.isBooked ? "secondary" : "outline"} className={slot.isBooked ? "" : "border-emerald-500/50 text-emerald-700 bg-emerald-50"}>
                                            {slot.isBooked ? "Booked" : "Available"}
                                        </Badge>
                                    </div>
                                    {!slot.isBooked && (
                                        <div className="flex justify-end mt-2">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                                onClick={() => handleDelete(slot._id)}
                                            >
                                                <Trash2 className="w-4 h-4 mr-2" />
                                                Delete
                                            </Button>
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
