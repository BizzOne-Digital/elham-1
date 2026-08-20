import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { mediaReferenceSchema, publishStatusEnum } from "./shared";

const testimonialSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, trim: true },
    company: { type: String, trim: true },
    content: { type: String, required: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    avatar: { type: mediaReferenceSchema },
    service: { type: Schema.Types.ObjectId, ref: "Service" },
    isFeatured: { type: Boolean, default: false },
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

testimonialSchema.index({ status: 1, sortOrder: 1 });
testimonialSchema.index({ isFeatured: 1, status: 1 });

export type ITestimonial = InferSchemaType<typeof testimonialSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type TestimonialDocument = HydratedDocument<ITestimonial>;

export const Testimonial =
  models.Testimonial ?? model<ITestimonial>("Testimonial", testimonialSchema);

export { testimonialSchema };
