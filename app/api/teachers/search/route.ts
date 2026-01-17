import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TeacherProfile from "@/lib/models/TeacherProfile";

export async function GET(req: NextRequest) {
    await dbConnect();
    try {
        const { searchParams } = new URL(req.url);
        const query = searchParams.get("query") || "";

        const teachers = await TeacherProfile.find({
            $or: [
                { department: { $regex: query, $options: "i" } },
                { subject: { $regex: query, $options: "i" } },
            ],
        }).populate("user", "name email");

        if (!query) {
            const all = await TeacherProfile.find().populate("user", "name email");
            return NextResponse.json(all);
        }

        const all = await TeacherProfile.find().populate("user", "name email");
        const filtered = all.filter((t: any) =>
            t.user.name.toLowerCase().includes(query.toLowerCase()) ||
            t.department.toLowerCase().includes(query.toLowerCase()) ||
            t.subject.toLowerCase().includes(query.toLowerCase())
        );

        return NextResponse.json(filtered);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch teachers" }, { status: 500 });
    }
}
