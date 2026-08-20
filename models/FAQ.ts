import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { publishStatusEnum } from "./shared";

const faqSchema = new Schema(
  {
    question: { type: String, required: true, trim: true },
    answer: { type: String, required: true },
    category: { type: String, trim: true, default: "general", index: true },
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

faqSchema.index({ status: 1, category: 1, sortOrder: 1 });

export type IFAQ = InferSchemaType<typeof faqSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type FAQDocument = HydratedDocument<IFAQ>;

export const FAQ = models.FAQ ?? model<IFAQ>("FAQ", faqSchema);

export { faqSchema };
