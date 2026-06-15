import { Schema } from "mongoose";

export const seoSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    keywords: { type: [String], default: [] },
    canonicalPath: { type: String, default: "" },
    image: { type: String, default: "" },
    noIndex: { type: Boolean, default: false },
  },
  { _id: false },
);
