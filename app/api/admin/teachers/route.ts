import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import TeacherProfile from "@/lib/models/TeacherProfile";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

// Ensure only admin calls this (can be done via middleware + double check here)
const teacherSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    department: z.string().min(2),
    subject: z.string().min(2),
});

export async function GET(req: NextRequest) {
    await dbConnect();
    // Authorization check (optional if middleware covers it, but good practice)

    try {
        const teachers = await TeacherProfile.find().populate("user", "name email");
        return NextResponse.json(teachers);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { name, email, password, department, subject } = teacherSchema.parse(body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: "teacher",
        });

        const teacherProfile = await TeacherProfile.create({
            user: user._id,
            department,
            subject,
        });

        return NextResponse.json({ message: "Teacher created successfully" }, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
