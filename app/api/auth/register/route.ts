import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/lib/models/User";
import StudentProfile from "@/lib/models/StudentProfile";
import TeacherProfile from "@/lib/models/TeacherProfile";
import { hashPassword } from "@/lib/auth";
import { z } from "zod";

const registerSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
    role: z.enum(["teacher", "student"]), // Admin is seeded or separate flow
    // Additional fields for Student
    studentId: z.string().optional(),
    course: z.string().optional(),
    year: z.string().optional(),
    // Additional fields for Teacher
    department: z.string().optional(),
    subject: z.string().optional(),
});

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { name, email, password, role, studentId, course, year, department, subject } = registerSchema.parse(body);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return NextResponse.json({ error: "User already exists" }, { status: 400 });
        }

        const hashedPassword = await hashPassword(password);

        // Create User
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role,
        });

        // Create Profile based on role
        if (role === "student") {
            if (!studentId || !course || !year) {
                // Rollback user creation if profile fails? 
                // Real-world: use transaction. For now, simple check.
                await User.findByIdAndDelete(user._id);
                return NextResponse.json({ error: "Missing student details" }, { status: 400 });
            }
            await StudentProfile.create({
                user: user._id,
                studentId,
                course,
                year,
            });
        } else if (role === 'teacher') {
            if (!department || !subject) {
                await User.findByIdAndDelete(user._id);
                return NextResponse.json({ error: "Missing teacher details" }, { status: 400 });
            }
            await TeacherProfile.create({
                user: user._id,
                department,
                subject,
            });
        }

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.message }, { status: 400 });
        }
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
