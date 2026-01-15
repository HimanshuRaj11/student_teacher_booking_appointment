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
        const userId = payload.userId;

        const appointments = await Appointment.find({ student: userId })
            .populate("teacher", "name email") // Populate teacher details since ref is User
            // But teacher info like 'Dept' is in TeacherProfile.
            // For list, just name is fine.
            // If we want detailed Profile info (dept), we'd need aggregation or 
            // better schemas (TeacherProfile refs User, Appointment refs User... 
            // linking User to TeacherProfile is 1:1).
            // For now, Name/Email from User is sufficient for list.
            .sort({ date: 1 });

        return NextResponse.json(appointments);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch appointments" }, { status: 500 });
    }
}
