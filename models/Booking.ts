import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { type BookingStatus } from "./shared";

const bookingSchema = new Schema(
  {
    customerName: { type: String, required: true, trim: true },
    customerEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    customerPhone: { type: String, trim: true },
    meetingType: {
      type: Schema.Types.ObjectId,
      ref: "MeetingType",
      required: true,
      index: true,
    },
    startUtc: { type: Date, required: true, index: true },
    endUtc: { type: Date, required: true, index: true },
    timezoneId: { type: String, required: true, trim: true },
    hostTimezoneId: { type: String, trim: true },
    status: {
      type: String,
      enum: [
        "pending",
        "confirmed",
        "cancelled",
        "completed",
        "no_show",
      ] satisfies BookingStatus[],
      default: "pending",
      index: true,
    },
    notes: { type: String },
    internalNotes: { type: String },
    cancellationReason: { type: String, trim: true },
    confirmedAt: { type: Date },
    cancelledAt: { type: Date },
    completedAt: { type: Date },
    reminderSentAt: { type: Date },
    lead: { type: Schema.Types.ObjectId, ref: "Lead" },
    metadata: { type: Schema.Types.Mixed, default: {} },
  },
  { timestamps: true },
);

bookingSchema.index(
  { meetingType: 1, startUtc: 1 },
  {
    unique: true,
    partialFilterExpression: {
      status: { $in: ["pending", "confirmed"] },
    },
  },
);
bookingSchema.index({ startUtc: 1, endUtc: 1 });
bookingSchema.index({ status: 1, startUtc: 1 });
bookingSchema.index({ customerEmail: 1, startUtc: -1 });

export type IBooking = InferSchemaType<typeof bookingSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type BookingDocument = HydratedDocument<IBooking>;

export const Booking =
  models.Booking ?? model<IBooking>("Booking", bookingSchema);

export { bookingSchema };
