import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";

const JWT_SECRET = process.env.JWT_SECRET || "default_secret_change_me_in_prod";

export async function GET(req: NextRequest) {
    try {
        await dbConnect();

        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        // Verify token
        interface JWTPayload {
            userId: string;
            role: string;
        }
        let decoded: JWTPayload;
        try {
            decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        } catch (err) {
            // Token invalid or expired - clear it from cookies
            const response = NextResponse.json({ user: null }, { status: 200 });
            response.cookies.set("token", "", {
                httpOnly: true,
                path: "/",
                maxAge: 0,
                expires: new Date(0)
            });
            return response;
        }

        const userId = decoded.userId;

        if (!userId) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        const user = await User.findById(userId).select("-password");

        if (!user) {
            return NextResponse.json({ user: null }, { status: 200 });
        }

        return NextResponse.json({ user });
    } catch (error: unknown) {
        console.error("Error in /api/auth/me:", error);
        const errorMessage = error instanceof Error ? error.message : "Internal Server Error";
        return NextResponse.json({ user: null, error: errorMessage }, { status: 500 });
    }
}
