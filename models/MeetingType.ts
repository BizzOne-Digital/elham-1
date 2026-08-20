import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";

const meetingTypeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: { type: String, trim: true },
    durationMinutes: { type: Number, required: true, min: 5 },
    bufferBeforeMinutes: { type: Number, default: 0, min: 0 },
    bufferAfterMinutes: { type: Number, default: 0, min: 0 },
    color: { type: String, trim: true, default: "#2563eb" },
    location: {
      type: String,
      enum: ["online", "in_person", "phone"],
      default: "online",
    },
    locationDetails: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
    maxBookingsPerDay: { type: Number, min: 1 },
  },
  { timestamps: true },
);

meetingTypeSchema.index({ isActive: 1, sortOrder: 1 });

export type IMeetingType = InferSchemaType<typeof meetingTypeSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type MeetingTypeDocument = HydratedDocument<IMeetingType>;

export const MeetingType =
  models.MeetingType ??
  model<IMeetingType>("MeetingType", meetingTypeSchema);

export { meetingTypeSchema };
