import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Appointment from "@/lib/models/Appointment";

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const appointments = await Appointment.find()
            .populate("student", "name email")
            .populate("teacher", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}
