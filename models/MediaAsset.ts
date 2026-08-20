import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";

const mediaAssetSchema = new Schema(
  {
    filename: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    url: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    alt: { type: String, trim: true },
    caption: { type: String, trim: true },
    width: { type: Number, min: 0 },
    height: { type: Number, min: 0 },
    folder: { type: String, trim: true, default: "general" },
    tags: [{ type: String, trim: true }],
    uploadedBy: { type: Schema.Types.ObjectId, ref: "AdminUser" },
  },
  { timestamps: true },
);

mediaAssetSchema.index({ mimeType: 1, createdAt: -1 });
mediaAssetSchema.index({ folder: 1, createdAt: -1 });
mediaAssetSchema.index({ tags: 1 });

export type IMediaAsset = InferSchemaType<typeof mediaAssetSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type MediaAssetDocument = HydratedDocument<IMediaAsset>;

export const MediaAsset =
  models.MediaAsset ?? model<IMediaAsset>("MediaAsset", mediaAssetSchema);

export { mediaAssetSchema };
