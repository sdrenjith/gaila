import { model, models, Schema, type InferSchemaType } from "mongoose";
import { seoSchema } from "./schemas/seo";

const siteSettingsSchema = new Schema(
  {
    siteName: { type: String, default: "Gaila" },
    tagline: {
      type: String,
      default: "A Dubai event management team for brands that expect flawless execution.",
    },
    logoText: { type: String, default: "Gaila" },
    logo: { type: String, default: "" },
    contact: {
      email: { type: String, default: "gailaevents@gmail.com" },
      phone: { type: String, default: "+971 50 282 7279" },
      address: {
        type: String,
        default:
          "Zig Zag tower, Office No F10 Floor - 5th St - near Al Dana Hotel - Al Zahiyah - E14 - Abu Dhabi",
      },
      whatsapp: { type: String, default: "+971567045314" },
    },
    social: {
      instagram: { type: String, default: "https://instagram.com/gaila.ae" },
      linkedin: { type: String, default: "https://www.linkedin.com/company/gaila" },
      facebook: { type: String, default: "https://www.facebook.com/gaila.ae" },
      x: { type: String, default: "https://x.com/gaila" },
    },
    seoDefaults: {
      type: seoSchema,
      default: () => ({
        title: "Gaila | Event Management Company in Dubai",
        description:
          "Gaila is a Dubai event management company for corporate events, conferences, weddings, galas, and experiential activations across the UAE.",
        keywords: [
          "event management Dubai",
          "corporate events UAE",
          "conference planning Dubai",
          "wedding planners Dubai",
          "event production UAE",
        ],
      }),
    },
    footer: {
      description: {
        type: String,
        default:
          "Gaila is a senior event management team in Dubai. We plan, design, and deliver corporate events, conferences, weddings, and brand experiences with precision across the UAE.",
      },
      copyright: {
        type: String,
        default: "© 2026 Gaila · All rights reserved.",
      },
      tagline: {
        type: String,
        default: "Built in Dubai · Made for memorable moments",
      },
    },
    googleReviews: {
      type: [
        {
          author: { type: String, required: true },
          rating: { type: Number, min: 1, max: 5, required: true },
          review: { type: String, required: true },
          location: { type: String, required: true },
          postedAt: { type: String, required: true },
        },
      ],
      default: [
        {
          author: "Lina Mathew",
          rating: 5,
          review:
            "Gaila ran our annual leadership summit end to end — venue, production, catering, and guest experience. Flawless on the day and genuinely calm under pressure.",
          location: "Dubai Marina",
          postedAt: "3 weeks ago",
        },
        {
          author: "Omar Rashid",
          rating: 5,
          review:
            "Senior team, no hand-offs. Weekly run-of-show updates, clear budgets, and a production crew that solved problems before we noticed them.",
          location: "Business Bay",
          postedAt: "1 month ago",
        },
        {
          author: "Sara Al Ali",
          rating: 5,
          review:
            "They understood our bilingual guest list immediately. Arabic and English signage, MC coordination, and a registration flow that felt premium from arrival to close.",
          location: "Jumeirah 1",
          postedAt: "2 months ago",
        },
        {
          author: "Hassan Al Qassimi",
          rating: 5,
          review:
            "Our product launch needed theatre, not just a stage. Gaila delivered creative direction, AV, and an experiential walk-through that guests still talk about.",
          location: "Downtown Dubai",
          postedAt: "5 weeks ago",
        },
        {
          author: "Priya Nair",
          rating: 5,
          review:
            "We hired Gaila for a corporate gala and extended into our conference series the next quarter. Fast turnaround, clear process, and a team leadership actually trusts on event day.",
          location: "Dubai Internet City",
          postedAt: "6 weeks ago",
        },
        {
          author: "Khalid bin Sulaiman",
          rating: 5,
          review:
            "Honest planners — they told us what not to overspend on, which is rare in this market. The result was a sharper event and a smoother guest journey throughout the evening.",
          location: "Jumeirah Lake Towers",
          postedAt: "2 months ago",
        },
      ],
    },
    theme: {
      primary: { type: String, default: "#0b1020" },
      accent: { type: String, default: "#21d4fd" },
      highlight: { type: String, default: "#f7b955" },
    },
    heroVideo: { type: String, default: "/uploads/video/home-hero.mp4" },
  },
  { timestamps: true },
);

export type SiteSettingsDocument = InferSchemaType<typeof siteSettingsSchema>;

export const SiteSettings =
  models.SiteSettings || model("SiteSettings", siteSettingsSchema);
