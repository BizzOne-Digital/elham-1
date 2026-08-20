import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import {
  buttonSchema,
  mediaReferenceSchema,
  publishStatusEnum,
  sectionSchema,
  seoSchema,
} from "./shared";

const serviceHeroSchema = new Schema(
  {
    title: { type: String, trim: true },
    subtitle: { type: String, trim: true },
    image: { type: mediaReferenceSchema },
    cta: { type: buttonSchema },
  },
  { _id: false },
);

const serviceDetailPageSchema = new Schema(
  {
    hero: { type: serviceHeroSchema, default: () => ({}) },
    sections: { type: [sectionSchema], default: [] },
    seo: { type: seoSchema, default: () => ({}) },
    cta: { type: buttonSchema },
    content: { type: String },
  },
  { _id: false },
);

const serviceSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    shortDescription: { type: String, trim: true },
    description: { type: String },
    icon: { type: String, trim: true },
    featuredImage: { type: mediaReferenceSchema },
    highlights: [{ type: String, trim: true }],
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0, index: true },
    status: {
      type: String,
      enum: publishStatusEnum,
      default: "draft",
      index: true,
    },
    detailPage: { type: serviceDetailPageSchema, default: () => ({}) },
  },
  { timestamps: true },
);

serviceSchema.index({ status: 1, sortOrder: 1 });
serviceSchema.index({ isFeatured: 1, status: 1 });

export type IService = InferSchemaType<typeof serviceSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type ServiceDocument = HydratedDocument<IService>;

export const Service =
  models.Service ?? model<IService>("Service", serviceSchema);

export { serviceSchema, serviceDetailPageSchema };
