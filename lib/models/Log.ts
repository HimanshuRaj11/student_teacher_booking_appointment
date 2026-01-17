import mongoose, { Schema, Document, Model } from "mongoose";

export interface ILog extends Document {
    user?: mongoose.Types.ObjectId; // User who performed the action (optional for system actions)
    action: string;
    details?: Record<string, unknown>;
    ipAddress?: string;
    createdAt: Date;
}

const LogSchema: Schema<ILog> = new Schema(
    {
        user: { type: Schema.Types.ObjectId, ref: "User" },
        action: { type: String, required: true },
        details: { type: Schema.Types.Mixed }, // Store flexible JSON data
        ipAddress: { type: String },
    },
    { timestamps: true } // Only createdAt is really needed, but keeping both for consistency
);

const Log: Model<ILog> = mongoose.models.Log || mongoose.model<ILog>("Log", LogSchema);

export default Log;
