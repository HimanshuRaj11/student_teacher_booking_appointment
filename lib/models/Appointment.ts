import mongoose, { Schema, Document, Model } from "mongoose";

export interface IAppointment extends Document {
    student: mongoose.Types.ObjectId;
    teacher: mongoose.Types.ObjectId;
    date: Date;
    status: "pending" | "approved" | "cancelled" | "completed";
    message?: string; // Purpose of appointment
    teacherNote?: string; // Note from teacher when approving/rejecting
    createdAt: Date;
    updatedAt: Date;
}

const AppointmentSchema: Schema<IAppointment> = new Schema(
    {
        student: { type: Schema.Types.ObjectId, ref: "User", required: true },
        teacher: { type: Schema.Types.ObjectId, ref: "User", required: true },
        date: { type: Date, required: true },
        status: {
            type: String,
            enum: ["pending", "approved", "cancelled", "completed"],
            default: "pending",
        },
        message: { type: String },
        teacherNote: { type: String },
    },
    { timestamps: true }
);

const Appointment: Model<IAppointment> =
    mongoose.models.Appointment ||
    mongoose.model<IAppointment>("Appointment", AppointmentSchema);

export default Appointment;
