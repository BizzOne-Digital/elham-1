import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";

const auditLogSchema = new Schema(
  {
    action: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    userId: { type: Schema.Types.ObjectId, ref: "AdminUser", index: true },
    userEmail: { type: String, trim: true, lowercase: true },
    summary: { type: String, trim: true },
    changes: { type: Schema.Types.Mixed },
    metadata: { type: Schema.Types.Mixed, default: {} },
    ipAddress: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);

auditLogSchema.index({ entityType: 1, entityId: 1, createdAt: -1 });
auditLogSchema.index({ userId: 1, createdAt: -1 });
auditLogSchema.index({ createdAt: -1 });

export type IAuditLog = InferSchemaType<typeof auditLogSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type AuditLogDocument = HydratedDocument<IAuditLog>;

export const AuditLog =
  models.AuditLog ?? model<IAuditLog>("AuditLog", auditLogSchema);

export { auditLogSchema };
