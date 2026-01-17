import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/lib/db";
import TeacherProfile from "@/lib/models/TeacherProfile";

import { jwtVerify } from "jose"; // Middleware used jose, let's consistency check.

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_change_me_in_prod");

export async function GET(req: NextRequest) {
    await dbConnect();

    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = new mongoose.Types.ObjectId(payload.userId as string);

        const profile = await TeacherProfile.findOne({ user: userId }).populate("user", "name email");
        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = new mongoose.Types.ObjectId(payload.userId as string);

        const body = await req.json();
        const { department, subject, bio } = body;

        const profile = await TeacherProfile.findOneAndUpdate(
            { user: userId },
            { department, subject, bio },
            { new: true }
        );

        return NextResponse.json(profile);
    } catch (error) {
        return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
    }
}
