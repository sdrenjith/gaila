import { model, models, Schema, type InferSchemaType } from "mongoose";

const subitemSchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    media: { type: String, default: "" },
    order: { type: Number, default: 0 },
  },
  { _id: false, timestamps: true },
);

const storySchema = new Schema(
  {
    id: { type: String, required: true },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    summary: { type: String, default: "" },
    body: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    media: { type: String, default: "" },
    order: { type: Number, default: 0 },
    subitems: { type: [subitemSchema], default: [] },
  },
  { _id: false, timestamps: true },
);

const categorySchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: "" },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    stories: { type: [storySchema], default: [] },
  },
  { timestamps: true },
);

export type CategoryDocument = InferSchemaType<typeof categorySchema>;

export const Category = models.Category || model("Category", categorySchema);
