import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import StudentProfile from "@/lib/models/StudentProfile";
import { z } from "zod";

// Fetch pending students (or all)
export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const students = await StudentProfile.find().populate("user", "name email");
        return NextResponse.json(students);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch students" }, { status: 500 });
    }
}

// Approve student
export async function PATCH(req: NextRequest) {
    await dbConnect();
    try {
        const body = await req.json();
        const { studentId, isApproved } = body;

        if (!studentId) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        const student = await StudentProfile.findByIdAndUpdate(
            studentId,
            { isApproved },
            { new: true }
        );

        return NextResponse.json({ message: "Student updated", student });
    } catch (error) {
        return NextResponse.json({ error: "Failed to update student" }, { status: 500 });
    }
}
