import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TeacherProfile from "@/lib/models/TeacherProfile";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { userId: string };
        const userId = decoded.userId;

        const body = await req.json();
        const { emailNotifications, appointmentReminders, newBookings } = body;

        // Update notification preferences in teacher profile
        await TeacherProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId as string) },
            {
                notifications: {
                    email: emailNotifications,
                    appointmentReminders,
                    newBookings,
                }
            }
        );

        return NextResponse.json({ message: "Notification preferences updated" });
    } catch (error: unknown) {
        console.error("Notification update error:", error);
        return NextResponse.json({ error: "Failed to update notifications" }, { status: 500 });
    }
}
