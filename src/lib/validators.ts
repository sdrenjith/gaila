import { z } from "zod";

export const seoSchema = z.object({
  title: z.string().min(3).max(90),
  description: z.string().min(20).max(180),
  keywords: z.array(z.string()).default([]),
  canonicalPath: z.string().optional().default(""),
  image: z.string().optional().default(""),
  noIndex: z.boolean().default(false),
});

export const leadSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email(),
  phone: z.string().max(40).optional().default(""),
  company: z.string().max(120).optional().default(""),
  service: z.string().max(120).optional().default(""),
  message: z.string().min(10).max(2000),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const pageFormSchema = z.object({
  id: z.string().optional().default(""),
  title: z.string().min(2).max(120),
  slug: z.string().min(1).max(140),
  status: z.enum(["draft", "published"]),
  template: z.enum(["standard", "landing", "service", "contact"]),
  showInHeader: z.boolean().default(false),
  headerLabel: z.string().max(80).optional().default(""),
  headerOrder: z.coerce.number().min(0).max(1000).default(0),
  seoTitle: z.string().min(3).max(90),
  seoDescription: z.string().min(20).max(180),
  sectionsJson: z.string().min(2),
});

export const contentFormSchema = z.object({
  id: z.string().optional().default(""),
  kind: z.enum(["service", "caseStudy", "blog"]),
  title: z.string().min(2).max(140),
  slug: z.string().min(1).max(140),
  excerpt: z.string().min(20).max(280),
  body: z.string().min(20),
  coverImage: z.string().optional().default(""),
  tags: z.string().optional().default(""),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().default(false),
  seoTitle: z.string().min(3).max(90),
  seoDescription: z.string().min(20).max(180),
});

export const settingsFormSchema = z.object({
  siteName: z.string().min(2).max(80),
  tagline: z.string().min(2).max(160),
  logoText: z.string().min(1).max(40),
  email: z.string().email(),
  phone: z.string().min(4).max(40),
  whatsapp: z.string().max(40).optional().default(""),
  address: z.string().min(3).max(200),
  instagram: z.string().url().or(z.literal("")).default(""),
  linkedin: z.string().url().or(z.literal("")).default(""),
  facebook: z.string().url().or(z.literal("")).default(""),
  x: z.string().url().or(z.literal("")).default(""),
  footerDescription: z.string().min(10).max(500),
  copyright: z.string().min(2).max(160),
  footerTagline: z.string().min(2).max(120),
  seoTitle: z.string().min(3).max(90),
  seoDescription: z.string().min(20).max(180),
  googleReviewsJson: z.string().min(2),
  heroVideo: z.string().max(500).default(""),
});

const menuSocialFields = {
  instagram: z.string().url().or(z.literal("")).optional(),
  linkedin: z.string().url().or(z.literal("")).optional(),
  facebook: z.string().url().or(z.literal("")).optional(),
  x: z.string().url().or(z.literal("")).optional(),
};

export const menuFormSchema = z.object({
  location: z.enum(["header", "footer"]),
  title: z.string().min(2).max(80),
  itemsJson: z.string().min(2),
  ctaEyebrow: z.string().max(80).optional().default(""),
  ctaHeadline: z.string().max(120).optional().default(""),
  ctaHeadlineAccent: z.string().max(120).optional().default(""),
  ctaLabel: z.string().max(60).optional().default(""),
  ctaHref: z.string().max(200).optional().default(""),
  ctaVisible: z.boolean().default(false),
  ...menuSocialFields,
});
