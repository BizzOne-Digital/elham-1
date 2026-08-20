import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";

const blackoutDateSchema = new Schema(
  {
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    allDay: { type: Boolean, default: true },
    startTime: {
      type: String,
      trim: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    endTime: {
      type: String,
      trim: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    timezoneId: { type: String, required: true, trim: true },
    meetingType: { type: Schema.Types.ObjectId, ref: "MeetingType" },
    reason: { type: String, trim: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  { timestamps: true },
);

blackoutDateSchema.index({ startDate: 1, endDate: 1, isActive: 1 });
blackoutDateSchema.index({ meetingType: 1, startDate: 1, endDate: 1 });

export type IBlackoutDate = InferSchemaType<typeof blackoutDateSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type BlackoutDateDocument = HydratedDocument<IBlackoutDate>;

export const BlackoutDate =
  models.BlackoutDate ??
  model<IBlackoutDate>("BlackoutDate", blackoutDateSchema);

export { blackoutDateSchema };
