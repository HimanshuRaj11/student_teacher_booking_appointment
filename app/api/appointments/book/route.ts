import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_change_me_in_prod");

export async function POST(req: NextRequest) {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const studentId = payload.userId as string;

        const body = await req.json();
        const { teacherId, slotId, date, message } = body; // date might be redundant if we use slotId

        // Check availability
        const slot = await AvailabilitySlot.findById(slotId);
        if (!slot) return NextResponse.json({ error: "Slot not found" }, { status: 404 });
        if (slot.isBooked) return NextResponse.json({ error: "Slot already booked" }, { status: 400 });

        // Create Appointment
        const appointment = await Appointment.create({
            student: studentId,
            teacher: teacherId as string,
            date: slot.date, // Use slot date ensures consistency
            message: message as string,
            status: 'pending' // Teacher must approve
        });

        // Mark slot as booked
        slot.isBooked = true;
        await slot.save();

        return NextResponse.json({ message: "Appointment booked successfully", appointment });

    } catch (error) {
        return NextResponse.json({ error: "Failed to book appointment" }, { status: 500 });
    }
}
