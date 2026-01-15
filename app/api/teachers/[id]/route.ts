import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import TeacherProfile from "@/lib/models/TeacherProfile";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    await dbConnect();
    try {
        const { id } = await params;

        // Fetch Profile
        const teacher = await TeacherProfile.findById(id).populate("user", "name email");
        if (!teacher) return NextResponse.json({ error: "Teacher not found" }, { status: 404 });

        // Fetch Slots
        // TeacherProfile stores 'user' as Ref to User. 
        // TeacherProfile._id is the profile ID.
        // AvailabilitySlot references 'teacher' which is a User ID, NOT Profile ID.
        // So we need teacher.user._id to find slots.

        const slots = await AvailabilitySlot.find({
            teacher: teacher.user._id,
            isBooked: false,
            date: { $gte: new Date() } // Future slots only
        }).sort({ date: 1 });

        return NextResponse.json({ teacher, slots });
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
    }
}
