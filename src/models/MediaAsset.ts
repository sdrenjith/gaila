import { model, models, Schema, type InferSchemaType } from "mongoose";

const mediaAssetSchema = new Schema(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    alt: { type: String, default: "" },
    folder: { type: String, default: "general" },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
  },
  { timestamps: true },
);

export type MediaAssetDocument = InferSchemaType<typeof mediaAssetSchema>;

export const MediaAsset = models.MediaAsset || model("MediaAsset", mediaAssetSchema);
