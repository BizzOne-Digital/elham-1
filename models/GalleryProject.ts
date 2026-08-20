import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { mediaReferenceSchema, publishStatusEnum, seoSchema } from "./shared";

const galleryProjectSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: "GalleryCategory",
      required: true,
      index: true,
    },
    description: { type: String },
    excerpt: { type: String, trim: true },
    coverImage: { type: mediaReferenceSchema },
    images: { type: [mediaReferenceSchema], default: [] },
    clientName: { type: String, trim: true },
    projectDate: { type: Date },
    location: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    seo: { type: seoSchema, default: () => ({}) },
    isFeatured: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: publishStatusEnum,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },
  },
  { timestamps: true },
);

galleryProjectSchema.index({ status: 1, sortOrder: 1 });
galleryProjectSchema.index({ category: 1, status: 1, sortOrder: 1 });
galleryProjectSchema.index({ isFeatured: 1, status: 1 });

export type IGalleryProject = InferSchemaType<typeof galleryProjectSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type GalleryProjectDocument = HydratedDocument<IGalleryProject>;

export const GalleryProject =
  models.GalleryProject ??
  model<IGalleryProject>("GalleryProject", galleryProjectSchema);

export { galleryProjectSchema };
