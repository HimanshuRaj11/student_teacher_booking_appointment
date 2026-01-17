import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/lib/models/User";
import { comparePassword, hashPassword } from "@/lib/auth";

export async function PUT(req: NextRequest) {
    await dbConnect();

    try {
        const token = req.cookies.get("token")?.value;
        if (!token) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        // Get user ID from token
        const jwt = require("jsonwebtoken");
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as { userId: string };
        const userId = decoded.userId;

        const body = await req.json();
        const { currentPassword, newPassword } = body;

        // Find user with password
        const user = await User.findById(userId).select("+password");
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Verify current password
        const isMatch = await comparePassword(currentPassword, user.password!);
        if (!isMatch) {
            return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
        }

        // Hash and update new password
        const hashedPassword = await hashPassword(newPassword);
        user.password = hashedPassword;
        await user.save();

        return NextResponse.json({ message: "Password changed successfully" });
    } catch (error: any) {
        console.error("Password change error:", error);
        return NextResponse.json({ error: "Failed to change password" }, { status: 500 });
    }
}
