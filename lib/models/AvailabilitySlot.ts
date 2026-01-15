import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAvailabilitySlot extends Document {
    teacher: mongoose.Types.ObjectId;
    date: Date; // Specific date or recurring day? Prompt says "Schedule availability slots". 
    // Let's assume specific dates/times for MVP simplicity or Day of Week.
    // "Doctor appointment" style usually specific slots.
    startTime: string; // "10:00"
    endTime: string; // "11:00"
    isBooked: boolean;
}

const AvailabilitySlotSchema: Schema<IAvailabilitySlot> = new Schema(
    {
        teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },
        startTime: { type: String, required: true },
        endTime: { type: String, required: true },
        isBooked: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const AvailabilitySlot: Model<IAvailabilitySlot> =
    mongoose.models.AvailabilitySlot ||
    mongoose.model<IAvailabilitySlot>("AvailabilitySlot", AvailabilitySlotSchema);

export default AvailabilitySlot;
