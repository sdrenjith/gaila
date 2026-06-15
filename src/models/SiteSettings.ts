import { model, models, Schema, type InferSchemaType } from "mongoose";
import { seoSchema } from "./schemas/seo";

const siteSettingsSchema = new Schema(
  {
    siteName: { type: String, default: "Krew Marketing" },
    tagline: { type: String, default: "A Dubai digital marketing agency for brands that report on revenue." },
    logoText: { type: String, default: "Krew" },
    logo: { type: String, default: "/krew-logo.webp" },
    contact: {
      email: { type: String, default: "aju@krewmarketing.ae" },
      phone: { type: String, default: "+971 50 282 7279" },
      address: {
        type: String,
        default:
          "Zig Zag tower, Office No F10 Floor - 5th St - near Al Dana Hotel - Al Zahiyah - E14 - Abu Dhabi",
      },
      whatsapp: { type: String, default: "+971502827279" },
    },
    social: {
      instagram: { type: String, default: "https://instagram.com/krewmarketing.ae" },
      linkedin: { type: String, default: "https://www.linkedin.com/company/krew-marketing" },
      facebook: { type: String, default: "https://www.facebook.com/krewmarketing.ae" },
      x: { type: String, default: "https://x.com/krewmarketing" },
    },
    seoDefaults: {
      type: seoSchema,
      default: () => ({
        title: "Krew Marketing | Digital Marketing Agency in Dubai",
        description:
          "Krew Marketing is a Dubai digital marketing agency for SEO, performance marketing, social, content, web design, and analytics across the UAE.",
        keywords: [
          "Dubai digital marketing agency",
          "SEO Dubai",
          "PPC Dubai",
          "performance marketing UAE",
          "web design Dubai",
        ],
      }),
    },
    footer: {
      description: {
        type: String,
        default:
          "Krew Marketing is a senior, performance-led digital marketing agency in Downtown Dubai. We help UAE brands turn search, social, and paid media into measurable revenue.",
      },
      copyright: {
        type: String,
        default: "© 2026 Krew Marketing FZ-LLC · DED Trade Licence 1187462 · All rights reserved.",
      },
      tagline: {
        type: String,
        default: "Built in Dubai · Made for the world",
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
            "We came to Krew with a flat pipeline and walked out with a proper system. SEO, landing pages, and tracking were fixed in the first month and qualified leads were up by the second.",
          location: "Dubai Marina",
          postedAt: "3 weeks ago",
        },
        {
          author: "Omar Rashid",
          rating: 5,
          review:
            "Senior team, no account-handler theatrics. Weekly reporting actually answers the question we care about — what is producing revenue this week.",
          location: "Business Bay",
          postedAt: "1 month ago",
        },
        {
          author: "Sara Al Ali",
          rating: 5,
          review:
            "They understood the Dubai market immediately. The Arabic and English split in our paid search, the creative direction, and the landing pages all felt premium and intentional.",
          location: "Jumeirah 1",
          postedAt: "2 months ago",
        },
        {
          author: "Hassan Al Qassimi",
          rating: 5,
          review:
            "Bilingual campaigns done properly. Their Arabic and English creative direction lifted our paid search conversion 42% within the first 60 days.",
          location: "Downtown Dubai",
          postedAt: "5 weeks ago",
        },
        {
          author: "Priya Nair",
          rating: 5,
          review:
            "We hired Krew for a website rebuild and extended into SEO and PPC the next quarter. Fast turnaround, clear process, dashboards everyone on the leadership team actually reads.",
          location: "Dubai Internet City",
          postedAt: "6 weeks ago",
        },
        {
          author: "Khalid bin Sulaiman",
          rating: 5,
          review:
            "Honest agency — they told us what not to spend on, which is rare in this market. The result is a leaner stack and a 23% increase in qualified pipeline in the first quarter.",
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
