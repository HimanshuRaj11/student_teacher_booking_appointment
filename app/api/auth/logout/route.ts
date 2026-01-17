import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    const response = NextResponse.json({ message: "Logged out successfully" });
    // Properly delete the cookie by setting it to empty with maxAge 0
    response.cookies.set("token", "", {
        httpOnly: true,
        path: "/",
        maxAge: 0,
        expires: new Date(0)
    });
    return response;
}
