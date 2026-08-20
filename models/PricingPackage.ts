import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { buttonSchema, publishStatusEnum } from "./shared";

const pricingPackageSchema = new Schema(
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
    price: { type: Number, required: true, min: 0 },
    currency: { type: String, default: "CAD", trim: true, uppercase: true },
    billingPeriod: {
      type: String,
      enum: ["one_time", "monthly", "yearly", "custom"],
      default: "one_time",
    },
    features: [{ type: String, trim: true }],
    excludedFeatures: [{ type: String, trim: true }],
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    cta: { type: buttonSchema },
    isPopular: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: publishStatusEnum,
      default: "draft",
      index: true,
    },
  },
  { timestamps: true },
);

pricingPackageSchema.index({ status: 1, sortOrder: 1 });
pricingPackageSchema.index({ service: 1, status: 1 });

export type IPricingPackage = InferSchemaType<typeof pricingPackageSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type PricingPackageDocument = HydratedDocument<IPricingPackage>;

export const PricingPackage =
  models.PricingPackage ??
  model<IPricingPackage>("PricingPackage", pricingPackageSchema);

export { pricingPackageSchema };
