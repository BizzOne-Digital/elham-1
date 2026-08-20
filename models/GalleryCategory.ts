import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { publishStatusEnum } from "./shared";

const galleryCategorySchema = new Schema(
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
    sortOrder: { type: Number, default: 0 },
    status: {
      type: String,
      enum: publishStatusEnum,
      default: "published",
      index: true,
    },
  },
  { timestamps: true },
);

galleryCategorySchema.index({ status: 1, sortOrder: 1 });

export type IGalleryCategory = InferSchemaType<
  typeof galleryCategorySchema
> & {
  _id: mongoose.Types.ObjectId;
};
export type GalleryCategoryDocument = HydratedDocument<IGalleryCategory>;

export const GalleryCategory =
  models.GalleryCategory ??
  model<IGalleryCategory>("GalleryCategory", galleryCategorySchema);

export { galleryCategorySchema };
