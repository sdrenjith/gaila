import { model, models, Schema, type InferSchemaType } from "mongoose";
import { seoSchema } from "./schemas/seo";

const sectionSchema = new Schema(
  {
    id: { type: String, required: true },
    type: {
      type: String,
      enum: [
        "heroSlider",
        "heroEditorial",
        "marquee",
        "categoryStories",
        "serviceGrid",
        "servicesEditorial",
        "statsBand",
        "processSteps",
        "caseStudyGrid",
        "googleReviews",
        "testimonialSlider",
        "faq",
        "ctaBanner",
        "imageText",
        "logoCloud",
        "contactForm",
        "gallery",
        "quote",
      ],
      required: true,
    },
    title: { type: String, default: "" },
    eyebrow: { type: String, default: "" },
    subtitle: { type: String, default: "" },
    enabled: { type: Boolean, default: true },
    settings: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false },
);

const pageSchema = new Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    status: { type: String, enum: ["draft", "published"], default: "draft", index: true },
    template: { type: String, enum: ["standard", "landing", "service", "contact"], default: "standard" },
    showInHeader: { type: Boolean, default: false },
    headerLabel: { type: String, default: "" },
    headerOrder: { type: Number, default: 0 },
    seo: { type: seoSchema, required: true },
    sections: { type: [sectionSchema], default: [] },
  },
  { timestamps: true },
);

export type PageDocument = InferSchemaType<typeof pageSchema>;

export const Page = models.Page || model("Page", pageSchema);
