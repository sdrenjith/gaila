import { model, models, Schema, type InferSchemaType } from "mongoose";

const leadSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: "" },
    company: { type: String, default: "" },
    service: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "contacted", "qualified", "closed"], default: "new", index: true },
  },
  { timestamps: true },
);

export type LeadDocument = InferSchemaType<typeof leadSchema>;

export const Lead = models.Lead || model("Lead", leadSchema);
