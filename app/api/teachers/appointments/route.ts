import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_change_me_in_prod");

export async function GET(req: NextRequest) {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const appointments = await Appointment.find({ teacher: userId })
            .populate("student", "name email")
            .sort({ date: 1 });

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest) {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId as string;

        const body = await req.json();
        const { appointmentId, status, teacherNote } = body;

        // Verify teacher owns the appointment (security)
        const appointment = await Appointment.findOne({ _id: appointmentId, teacher: userId });
        if (!appointment) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });

        appointment.status = status;
        if (teacherNote) appointment.teacherNote = teacherNote;
        await appointment.save();

        return NextResponse.json(appointment);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update appointment" }, { status: 500 });
    }
}
