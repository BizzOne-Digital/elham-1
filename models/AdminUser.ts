import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { type AdminRole } from "./shared";

const adminUserSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    role: {
      type: String,
      enum: ["super_admin", "editor"] satisfies AdminRole[],
      required: true,
      default: "editor",
    },
    lastLoginAt: { type: Date },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true },
);

adminUserSchema.index({ role: 1, isActive: 1 });

export type IAdminUser = InferSchemaType<typeof adminUserSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type AdminUserDocument = HydratedDocument<IAdminUser>;

export const AdminUser =
  models.AdminUser ?? model<IAdminUser>("AdminUser", adminUserSchema);

export { adminUserSchema };
