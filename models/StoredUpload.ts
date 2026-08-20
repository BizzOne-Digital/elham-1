import mongoose, {
  Schema,
  model,
  models,
  type HydratedDocument,
  type InferSchemaType,
} from "mongoose";
import { STORED_UPLOAD_FOLDERS } from "@/lib/uploads/constants";

export { STORED_UPLOAD_FOLDERS, type StoredUploadFolder } from "@/lib/uploads/constants";

const storedUploadSchema = new Schema(
  {
    folder: {
      type: String,
      required: true,
      enum: STORED_UPLOAD_FOLDERS,
      index: true,
    },
    filename: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    data: { type: Buffer, required: true },
  },
  { timestamps: true },
);

storedUploadSchema.index({ folder: 1, filename: 1 }, { unique: true });

export type IStoredUpload = InferSchemaType<typeof storedUploadSchema> & {
  _id: mongoose.Types.ObjectId;
};
export type StoredUploadDocument = HydratedDocument<IStoredUpload>;

export const StoredUpload =
  models?.StoredUpload ?? model<IStoredUpload>("StoredUpload", storedUploadSchema);

export { storedUploadSchema };
