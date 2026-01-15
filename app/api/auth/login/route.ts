import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { comparePassword, generateAccessToken, generateRefreshToken } from "@/lib/auth";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});

export async function POST(req: NextRequest) {
    await dbConnect();

    try {
        const body = await req.json();
        const { email, password } = loginSchema.parse(body);

        const user = await User.findOne({ email }).select("+password"); // explicit select for password
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const isMatch = await comparePassword(password, user.password!);
        if (!isMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const accessToken = generateAccessToken({ userId: user._id, role: user.role });
        const refreshToken = generateRefreshToken({ userId: user._id });

        // In a real app, store refresh token in HttpOnly cookie.
        // Returning both in body for simplicity in this MVP per request "JWT access + refresh tokens"
        // But setting cookie is safer. Let's do both or just body for now as client might store them.
        // The prompt says "JWT access + refresh tokens", standard is usually body for mobile/web easy consumption or cookie.
        // I'll return them in JSON for flexibility.

        const response = NextResponse.json({
            message: "Login successful",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            accessToken,
            refreshToken,
        });

        // Also set as cookie for Middleware usage in Next.js
        response.cookies.set("token", accessToken, { httpOnly: true, path: "/" });

        return response;

    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ error: error.errors }, { status: 400 });
        }
        console.error("Login Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
