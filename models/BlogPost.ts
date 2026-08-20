import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { mediaReferenceSchema, publishStatusEnum, seoSchema } from "./shared";

const blogPostSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true },
    featuredImage: { type: mediaReferenceSchema },
    author: { type: Schema.Types.ObjectId, ref: "AdminUser" },
    tags: [{ type: String, trim: true, lowercase: true }],
    categories: [{ type: String, trim: true }],
    seo: { type: seoSchema, default: () => ({}) },
    status: {
      type: String,
      enum: publishStatusEnum,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date, index: true },
    readingTimeMinutes: { type: Number, min: 1 },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

blogPostSchema.index({ status: 1, publishedAt: -1 });
blogPostSchema.index({ tags: 1, status: 1 });
blogPostSchema.index({ isFeatured: 1, status: 1, publishedAt: -1 });

export type IBlogPost = InferSchemaType<typeof blogPostSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type BlogPostDocument = HydratedDocument<IBlogPost>;

export const BlogPost =
  models.BlogPost ?? model<IBlogPost>("BlogPost", blogPostSchema);

export { blogPostSchema };
