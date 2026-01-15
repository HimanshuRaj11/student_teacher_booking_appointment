import mongoose, { Schema, Document, Model } from "mongoose";

export interface IStudentProfile extends Document {
    user: mongoose.Types.ObjectId;
    studentId: string;
    course: string;
    year: string;
    isApproved: boolean; // Students need admin approval as per requirements
    createdAt: Date;
    updatedAt: Date;
}

const StudentProfileSchema: Schema<IStudentProfile> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        studentId: { type: String, required: true, unique: true },
        course: { type: String, required: true },
        year: { type: String, required: true },
        isApproved: { type: Boolean, default: false }, // Needs approval
    },
    { timestamps: true }
);

const StudentProfile: Model<IStudentProfile> =
    mongoose.models.StudentProfile ||
    mongoose.model<IStudentProfile>("StudentProfile", StudentProfileSchema);

export default StudentProfile;
