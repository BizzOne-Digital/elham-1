import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { publishStatusEnum, sectionSchema, seoSchema } from "./shared";

const pageNavigationSchema = new Schema(
  {
    showInNav: { type: Boolean, default: false },
    navLabel: { type: String, trim: true },
    navOrder: { type: Number, default: 0 },
    parentPage: { type: Schema.Types.ObjectId, ref: "Page" },
  },
  { _id: false },
);

const pageSchema = new Schema(
  {
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    title: { type: String, required: true, trim: true },
    subtitle: { type: String, trim: true },
    sections: { type: [sectionSchema], default: [] },
    seo: { type: seoSchema, default: () => ({}) },
    navigation: { type: pageNavigationSchema, default: () => ({}) },
    status: {
      type: String,
      enum: publishStatusEnum,
      default: "draft",
      index: true,
    },
    publishedAt: { type: Date },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

pageSchema.index({ status: 1, sortOrder: 1 });
pageSchema.index({ "navigation.showInNav": 1, "navigation.navOrder": 1 });

export type IPage = InferSchemaType<typeof pageSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type PageDocument = HydratedDocument<IPage>;

export const Page = models.Page ?? model<IPage>("Page", pageSchema);

export { pageSchema };
