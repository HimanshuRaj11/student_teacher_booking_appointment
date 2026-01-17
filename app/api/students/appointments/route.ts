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

        const appointments = await Appointment.find({ student: userId })
            .populate("teacher", "name email")
            .sort({ date: 1 });

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}
