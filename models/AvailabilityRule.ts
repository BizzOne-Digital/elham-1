import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";

const availabilityRuleSchema = new Schema(
  {
    dayOfWeek: {
      type: Number,
      required: true,
      min: 0,
      max: 6,
      index: true,
    },
    startTime: {
      type: String,
      required: true,
      trim: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    endTime: {
      type: String,
      required: true,
      trim: true,
      match: /^([01]\d|2[0-3]):[0-5]\d$/,
    },
    timezoneId: { type: String, required: true, trim: true },
    meetingType: { type: Schema.Types.ObjectId, ref: "MeetingType" },
    isActive: { type: Boolean, default: true, index: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

availabilityRuleSchema.index({ dayOfWeek: 1, isActive: 1, sortOrder: 1 });
availabilityRuleSchema.index({ meetingType: 1, dayOfWeek: 1, isActive: 1 });

export type IAvailabilityRule = InferSchemaType<
  typeof availabilityRuleSchema
> & {
  _id: mongoose.Types.ObjectId;
};
export type AvailabilityRuleDocument = HydratedDocument<IAvailabilityRule>;

export const AvailabilityRule =
  models.AvailabilityRule ??
  model<IAvailabilityRule>("AvailabilityRule", availabilityRuleSchema);

export { availabilityRuleSchema };
