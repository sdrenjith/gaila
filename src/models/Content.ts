import { model, models, Schema, type InferSchemaType } from "mongoose";
import { seoSchema } from "./schemas/seo";

const metricSchema = new Schema(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false },
);

const contentSchema = new Schema(
  {
    kind: { type: String, enum: ["service", "caseStudy", "blog"], required: true, index: true },
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    excerpt: { type: String, required: true },
    body: { type: String, required: true },
    coverImage: { type: String, default: "" },
    tags: { type: [String], default: [] },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    featured: { type: Boolean, default: false, index: true },
    seo: { type: seoSchema, required: true },
    metrics: { type: [metricSchema], default: [] },
  },
  { timestamps: true },
);

export type ContentDocument = InferSchemaType<typeof contentSchema>;

export const Content = models.Content || model("Content", contentSchema);
