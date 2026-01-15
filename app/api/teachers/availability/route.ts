import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import AvailabilitySlot from "@/lib/models/AvailabilitySlot";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "default_secret_change_me_in_prod");

export async function GET(req: NextRequest) {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId;

        const slots = await AvailabilitySlot.find({ teacher: userId }).sort({ date: 1 });
        return NextResponse.json(slots);
    } catch (error) {
        return NextResponse.json({ error: "Failed to fetch slots" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId;

        const body = await req.json();
        const { date, startTime, endTime } = body;

        const slot = await AvailabilitySlot.create({
            teacher: userId,
            date,
            startTime,
            endTime,
        });

        return NextResponse.json(slot, { status: 201 });
    } catch (error) {
        return NextResponse.json({ error: "Failed to create slot" }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest) {
    await dbConnect();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

        // Ensure specific teacher owns it? Yes via findOneAndDelete query if strictly enforcing, 
        // but simple DELETE by ID is okay if we trust ID. 
        // Better: findOneAndDelete({ _id: id, teacher: userId })

        const { payload } = await jwtVerify(token, JWT_SECRET);
        const userId = payload.userId;

        await AvailabilitySlot.findOneAndDelete({ _id: id, teacher: userId });

        return NextResponse.json({ message: "Slot deleted" });
    } catch (error) {
        return NextResponse.json({ error: "Failed to delete slot" }, { status: 500 });
    }
}
