import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITeacherProfile extends Document {
    user: mongoose.Types.ObjectId;
    department: string;
    subject: string;
    bio?: string;
    isApproved: boolean; // Teachers might need admin approval? Assuming created by admin so yes.
    createdAt: Date;
    updatedAt: Date;
}

const TeacherProfileSchema: Schema<ITeacherProfile> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
        department: { type: String, required: true },
        subject: { type: String, required: true },
        bio: { type: String },
        isApproved: { type: Boolean, default: true }, // Admin creates them, so auto-approved usually
    },
    { timestamps: true }
);

const TeacherProfile: Model<ITeacherProfile> =
    mongoose.models.TeacherProfile ||
    mongoose.model<ITeacherProfile>("TeacherProfile", TeacherProfileSchema);

export default TeacherProfile;
