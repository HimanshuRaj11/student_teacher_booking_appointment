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

        // Also filter by Teacher Name (requires populating first or aggregate)
        // For simplicity, just filtering by Dept/Subject as requested "Search teachers by Name, Department, Subject".
        // To filter by name on 'user' ref, we need aggregation.
        // Let's keep it simple: fetch all and filter in JS if small, OR regex on department/subject is usually enough for this MVP.
        // Actually, let's fix to include name search.

        // Better Aggregation
        /*
        const teachers = await TeacherProfile.aggregate([
           { $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' } },
           { $unwind: '$user' },
           { $match: { 
               $or: [
                   { 'user.name': { $regex: query, $options: 'i' } },
                   { department: { $regex: query, $options: 'i' } },
                   { subject: { $regex: query, $options: 'i' } }
               ]
           }}
        ]);
        */

        // Retaining simple Mongoose find if query is empty
        if (!query) {
            const all = await TeacherProfile.find().populate("user", "name email");
            return NextResponse.json(all);
        }

        // If query exists, fetching all and filtering in memory for MVP simplicity as Lookup is expensive if not indexed properly, 
        // but better for small datasets.
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
