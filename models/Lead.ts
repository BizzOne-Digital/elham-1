import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import {
  type LeadPriority,
  type LeadStatus,
} from "./shared";

const leadNoteSchema = new Schema(
  {
    body: { type: String, required: true },
    author: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true },
);

const leadSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    phone: { type: String, trim: true },
    company: { type: String, trim: true },
    subject: { type: String, trim: true },
    message: { type: String, required: true },
    source: {
      type: String,
      trim: true,
      default: "website",
      index: true,
    },
    status: {
      type: String,
      enum: [
        "new",
        "contacted",
        "qualified",
        "proposal",
        "won",
        "lost",
        "archived",
      ] satisfies LeadStatus[],
      default: "new",
      index: true,
    },
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"] satisfies LeadPriority[],
      default: "medium",
    },
    assignedTo: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    pricingPackage: { type: Schema.Types.ObjectId, ref: "PricingPackage" },
    estimatedValue: { type: Number, min: 0 },
    currency: { type: String, default: "CAD", trim: true, uppercase: true },
    tags: [{ type: String, trim: true }],
    notes: { type: [leadNoteSchema], default: [] },
    followUpAt: { type: Date, index: true },
    lastContactedAt: { type: Date },
    convertedAt: { type: Date },
    lostReason: { type: String, trim: true },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
    referrer: { type: String, trim: true },
    booking: { type: Schema.Types.ObjectId, ref: "Booking" },
  },
  { timestamps: true },
);

leadSchema.index({ status: 1, createdAt: -1 });
leadSchema.index({ email: 1, status: 1 });
leadSchema.index({ assignedTo: 1, status: 1 });
leadSchema.index({ followUpAt: 1, status: 1 });

export type ILead = InferSchemaType<typeof leadSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type LeadDocument = HydratedDocument<ILead>;

export const Lead = models.Lead ?? model<ILead>("Lead", leadSchema);

export { leadSchema, leadNoteSchema };
