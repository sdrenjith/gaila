import { model, models, Schema, type InferSchemaType } from "mongoose";

const menuItemSchema = new Schema(
  {
    label: { type: String, required: true },
    href: { type: String, required: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { _id: false },
);

menuItemSchema.add({
  children: [menuItemSchema],
});

const navigationMenuSchema = new Schema(
  {
    location: { type: String, enum: ["header", "footer"], required: true, unique: true },
    title: { type: String, required: true },
    items: { type: [menuItemSchema], default: [] },
    cta: {
      eyebrow: { type: String, default: "" },
      headline: { type: String, default: "" },
      headlineAccent: { type: String, default: "" },
      label: { type: String, default: "" },
      href: { type: String, default: "" },
      visible: { type: Boolean, default: false },
    },
  },
  { timestamps: true },
);

export type NavigationMenuDocument = InferSchemaType<typeof navigationMenuSchema>;

export const NavigationMenu =
  models.NavigationMenu || model("NavigationMenu", navigationMenuSchema);
