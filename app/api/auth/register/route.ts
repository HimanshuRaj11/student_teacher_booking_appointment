import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User, { IUser } from "@/lib/models/User";
import StudentProfile from "@/lib/models/StudentProfile";
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
    // Additional fields for Teacher (if needed in signup, usually admin adds them)
    department: z.string().optional(),
    subject: z.string().optional(),
});

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { name, email, password, role, studentId, course, year } = registerSchema.parse(body);

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
            // Ideally teachers are added by admin, but if we allow signup:
            // We would need department/subject. 
            // For this task, let's assume Teachers are ONLY added by Admin as per "Admin Module -> Add teacher".
            // But if they use this endpoint, we might block them or flag them.
            // Let's restrict this endpoint to Students mostly, or allow generic user creation without profile if needed (bad practice).

            // Actually, prompt says: "Admin Module: Add teacher". 
            // "Student Module: Student registration".
            // So ONLY Students register here. Teachers are added by Admin.

            // Wait, if a teacher tries to register, what happens? 
            // Let's force role to be 'student' if using public register, OR check if the user meant to be a teacher.
            // For now, I will allow 'student' registration effectively. 
            if (role === 'teacher') {
                return NextResponse.json({ error: "Teachers must be added by Admin" }, { status: 403 });
            }
        }

        return NextResponse.json({ message: "User registered successfully" }, { status: 201 });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Registration Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
