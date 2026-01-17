import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
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
        const { name, department, subject } = body;

        // Update user name
        await User.findByIdAndUpdate(userId, { name });

        // Update teacher profile
        await TeacherProfile.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(userId as string) },
            { department, subject }
        );

        return NextResponse.json({ message: "Profile updated successfully" });
    } catch (error: unknown) {
        console.error("Profile update error:", error);
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
