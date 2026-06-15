import { z } from "zod";
import type { PageSection, SectionType } from "@/types/cms";

const stringDefault = (fallback = "") => z.string().optional().default(fallback);

const ctaSettingsSchema = z.object({
  ctaLabel: stringDefault(""),
  ctaHref: stringDefault(""),
  secondaryCtaLabel: stringDefault(""),
  secondaryCtaHref: stringDefault(""),
});

const heroCategorySchema = z.object({
  label: z.string().default(""),
  href: z.string().default(""),
  meta: z.string().optional().default(""),
});

const heroEditorialSettingsSchema = z.object({
  image: stringDefault(""),
  imageAlt: stringDefault(""),
  video: stringDefault(""),
  poster: stringDefault(""),
  rotatingTitles: z.array(z.string()).default([]),
  rotationSeconds: z.coerce.number().optional().default(4),
  ...ctaSettingsSchema.shape,
  categories: z.array(heroCategorySchema).default([]),
});

const heroSliderSettingsSchema = z.object({
  slides: z
    .array(
      z.object({
        title: stringDefault(""),
        subtitle: stringDefault(""),
        ctaLabel: stringDefault(""),
        ctaHref: stringDefault(""),
      }),
    )
    .default([]),
});

const marqueeSettingsSchema = z.object({
  items: z.array(z.string()).default([]),
  speedSeconds: z.coerce.number().default(38),
});

const categoryStoriesSettingsSchema = z.object({
  categorySlugs: z.array(z.string()).default([]),
  storyLimit: z.coerce.number().default(6),
  subitemLimit: z.coerce.number().default(4),
  showSubitems: z.boolean().optional().default(true),
});

const servicesEditorialCardSchema = z.object({
  title: z.string().default(""),
  description: z.string().default(""),
  href: z.string().default(""),
  ctaLabel: z.string().default(""),
  image: z.string().default(""),
});

const servicesEditorialSettingsSchema = z.object({
  limit: z.coerce.number().default(6),
  serviceSlugs: z.array(z.string()).default([]),
  linkLabel: z.string().default(""),
  layout: z.enum(["editorial", "stacked"]).default("editorial"),
  cards: z.array(servicesEditorialCardSchema).default([]),
});

const serviceGridSettingsSchema = z.object({});

const statsSchema = z.object({
  value: z.string().default(""),
  label: z.string().default(""),
});

const statsBandSettingsSchema = z.object({
  stats: z.array(statsSchema).default([]),
});

const processStepSchema = z.object({
  title: z.string().default(""),
  text: z.string().default(""),
});

const processStepsSettingsSchema = z.object({
  steps: z.array(processStepSchema).default([]),
});

const caseStudyGridSettingsSchema = z.object({
  categorySlug: z.string().default("case-studies"),
  limit: z.coerce.number().optional().default(0),
});

const faqEntrySchema = z.object({
  question: z.string().default(""),
  answer: z.string().default(""),
});

const faqSettingsSchema = z.object({
  faqs: z.array(faqEntrySchema).default([]),
});

const ctaBannerSettingsSchema = z.object({
  ctaLabel: stringDefault("Start a project"),
  ctaHref: stringDefault("/contact"),
  body: stringDefault(""),
  variant: z.enum(["light", "dark"]).default("dark"),
  background: stringDefault(""),
});

const imageTextSettingsSchema = z.object({
  image: stringDefault(""),
  imageAlt: stringDefault(""),
  body: stringDefault(""),
  checklistTitle: stringDefault(""),
  footer: stringDefault(""),
  bullets: z.array(z.string()).default([]),
  align: z.enum(["left", "right"]).default("left"),
  ctaLabel: stringDefault(""),
  ctaHref: stringDefault(""),
  headingAs: z.enum(["h1", "h2"]).default("h2"),
});

const logoCloudSettingsSchema = z.object({
  logos: z
    .array(
      z.object({
        label: z.string().default(""),
        image: z.string().default(""),
      }),
    )
    .default([]),
});

const galleryItemSchema = z.object({
  image: z.string().default(""),
  alt: z.string().default(""),
  caption: z.string().default(""),
});

const gallerySettingsSchema = z.object({
  items: z.array(galleryItemSchema).default([]),
  columns: z.coerce.number().default(3),
});

const quoteSettingsSchema = z.object({
  quote: z.string().default(""),
  author: z.string().default(""),
  role: z.string().default(""),
  image: z.string().default(""),
});

const contactFormSettingsSchema = z.object({});

const googleReviewsSettingsSchema = z.object({});

// =====================================================================
// Registry — single source of truth used by both admin and renderer
// =====================================================================

export type SectionFieldKind =
  | "text"
  | "longtext"
  | "url"
  | "image"
  | "video"
  | "number"
  | "select"
  | "categorySelect"
  | "switch";

export type SectionFieldSpec = {
  name: string;
  label: string;
  kind: SectionFieldKind;
  placeholder?: string;
  description?: string;
  options?: { label: string; value: string }[];
  required?: boolean;
  /** Render the field inside this settings sub-array (e.g. "stats", "steps"). */
  groupKey?: string;
};

export type SectionTypeSpec = {
  type: SectionType;
  label: string;
  description: string;
  category: "hero" | "content" | "social-proof" | "marketing" | "form";
  /** Top-level page-section fields (title, eyebrow, subtitle, enabled are always rendered). */
  topLevel?: ("title" | "eyebrow" | "subtitle")[];
  /** Discrete fields in the section's `settings` object. */
  fields: SectionFieldSpec[];
  /** Repeatable groups inside settings — e.g. `stats: []`, `steps: []`. */
  groups?: {
    name: string;
    label: string;
    itemLabel: string;
    fields: SectionFieldSpec[];
  }[];
  defaultSettings: Record<string, unknown>;
  schema: z.ZodTypeAny;
};

const standardTop: ("title" | "eyebrow" | "subtitle")[] = ["eyebrow", "title", "subtitle"];

export const SECTION_SPECS: Record<SectionType, SectionTypeSpec> = {
  heroEditorial: {
    type: "heroEditorial",
    label: "Hero — Editorial",
    description: "Full-bleed video/image hero with side-nav category list.",
    category: "hero",
    topLevel: standardTop,
    fields: [
      { name: "video", label: "Background video URL", kind: "video", placeholder: "https://…/clip.mp4" },
      { name: "poster", label: "Video poster image", kind: "image" },
      { name: "image", label: "Fallback image (no video)", kind: "image" },
      { name: "imageAlt", label: "Image alt text", kind: "text" },
      {
        name: "rotationSeconds",
        label: "Headline rotation (seconds)",
        kind: "number",
        description: "How long each rotating headline is shown. Used when 2+ headlines are added.",
      },
      { name: "ctaLabel", label: "Primary CTA label", kind: "text" },
      { name: "ctaHref", label: "Primary CTA link", kind: "url" },
      { name: "secondaryCtaLabel", label: "Secondary CTA label", kind: "text" },
      { name: "secondaryCtaHref", label: "Secondary CTA link", kind: "url" },
    ],
    groups: [
      {
        name: "rotatingTitles",
        label: "Rotating headlines",
        itemLabel: "Headline",
        fields: [
          {
            name: "value",
            label: "Headline",
            kind: "text",
            description:
              "Use “ | ” to force a line break, e.g. “We build brand stories | that earn revenue.”",
          },
        ],
      },
      {
        name: "categories",
        label: "Side-nav categories",
        itemLabel: "Category",
        fields: [
          { name: "label", label: "Label", kind: "text" },
          { name: "href", label: "Link", kind: "url" },
          { name: "meta", label: "Meta (e.g. count)", kind: "text" },
        ],
      },
    ],
    defaultSettings: {
      video: "",
      poster: "",
      image: "",
      imageAlt: "",
      rotatingTitles: [],
      rotationSeconds: 4,
      ctaLabel: "Plan your event",
      ctaHref: "/contact",
      secondaryCtaLabel: "Request a proposal",
      secondaryCtaHref: "tel:+971502827279",
      categories: [
        { label: "Services", href: "/services", meta: "" },
        { label: "Case Studies", href: "/case-studies", meta: "" },
        { label: "Blog", href: "/blog", meta: "" },
        { label: "About", href: "/about", meta: "" },
        { label: "Contact", href: "/contact", meta: "" },
      ],
    },
    schema: heroEditorialSettingsSchema,
  },
  heroSlider: {
    type: "heroSlider",
    label: "Hero — Slider",
    description: "Legacy hero with up to 3 rotating cards.",
    category: "hero",
    topLevel: standardTop,
    fields: [],
    groups: [
      {
        name: "slides",
        label: "Slides",
        itemLabel: "Slide",
        fields: [
          { name: "title", label: "Title", kind: "text" },
          { name: "subtitle", label: "Subtitle", kind: "longtext" },
          { name: "ctaLabel", label: "CTA label", kind: "text" },
          { name: "ctaHref", label: "CTA link", kind: "url" },
        ],
      },
    ],
    defaultSettings: { slides: [] },
    schema: heroSliderSettingsSchema,
  },
  marquee: {
    type: "marquee",
    label: "Marquee — Brand strip",
    description: "Infinite horizontal scroll of brand/service words.",
    category: "social-proof",
    topLevel: [],
    fields: [{ name: "speedSeconds", label: "Loop speed (seconds)", kind: "number" }],
    groups: [
      {
        name: "items",
        label: "Items",
        itemLabel: "Word",
        fields: [{ name: "value", label: "Text", kind: "text" }],
      },
    ],
    defaultSettings: { items: [], speedSeconds: 38 },
    schema: marqueeSettingsSchema,
  },
  categoryStories: {
    type: "categoryStories",
    label: "Categories + stories",
    description: "Published categories with nested stories and optional subitems.",
    category: "content",
    topLevel: standardTop,
    fields: [
      { name: "storyLimit", label: "Max stories per category", kind: "number" },
      { name: "subitemLimit", label: "Max subitems per story", kind: "number" },
      { name: "showSubitems", label: "Show subitems", kind: "switch" },
    ],
    groups: [
      {
        name: "categorySlugs",
        label: "Included category slugs",
        itemLabel: "Category",
        fields: [{ name: "value", label: "Category slug", kind: "text" }],
      },
    ],
    defaultSettings: {
      categorySlugs: [],
      storyLimit: 6,
      subitemLimit: 4,
      showSubitems: true,
    },
    schema: categoryStoriesSettingsSchema,
  },
  servicesEditorial: {
    type: "servicesEditorial",
    label: "Services — Editorial",
    description: "Large numbered service rows pulled from Content (kind=service).",
    category: "content",
    topLevel: standardTop,
    fields: [{ name: "limit", label: "Max services to show", kind: "number" }],
    defaultSettings: { limit: 6 },
    schema: servicesEditorialSettingsSchema,
  },
  serviceGrid: {
    type: "serviceGrid",
    label: "Services — Card grid",
    description: "Legacy 4-up service cards.",
    category: "content",
    topLevel: standardTop,
    fields: [],
    defaultSettings: {},
    schema: serviceGridSettingsSchema,
  },
  statsBand: {
    type: "statsBand",
    label: "Stats band",
    description: "Oversized counting stat numerals.",
    category: "social-proof",
    topLevel: ["eyebrow", "title"],
    fields: [],
    groups: [
      {
        name: "stats",
        label: "Stats",
        itemLabel: "Stat",
        fields: [
          { name: "value", label: "Value (e.g. 120+)", kind: "text" },
          { name: "label", label: "Label", kind: "text" },
        ],
      },
    ],
    defaultSettings: { stats: [] },
    schema: statsBandSettingsSchema,
  },
  processSteps: {
    type: "processSteps",
    label: "Process — Sticky stepper",
    description: "Vertical stepper with sticky label and scrolling steps.",
    category: "content",
    topLevel: standardTop,
    fields: [],
    groups: [
      {
        name: "steps",
        label: "Steps",
        itemLabel: "Step",
        fields: [
          { name: "title", label: "Step title", kind: "text" },
          { name: "text", label: "Step body", kind: "longtext" },
        ],
      },
    ],
    defaultSettings: { steps: [] },
    schema: processStepsSettingsSchema,
  },
  caseStudyGrid: {
    type: "caseStudyGrid",
    label: "Editorial grid",
    description: "Alternating image + meta layout for case studies or insights.",
    category: "content",
    topLevel: standardTop,
    fields: [
      {
        name: "categorySlug",
        label: "Source",
        kind: "categorySelect",
        description: "Published stories and subitems are loaded from the selected category.",
      },
      { name: "limit", label: "Max items (0 = all)", kind: "number" },
    ],
    defaultSettings: { categorySlug: "case-studies", limit: 0 },
    schema: caseStudyGridSettingsSchema,
  },
  googleReviews: {
    type: "googleReviews",
    label: "Google reviews",
    description: "Animated slider of Google reviews from Site Settings.",
    category: "social-proof",
    topLevel: standardTop,
    fields: [],
    defaultSettings: {},
    schema: googleReviewsSettingsSchema,
  },
  testimonialSlider: {
    type: "testimonialSlider",
    label: "Testimonial slider",
    description: "Alias of Google reviews slider.",
    category: "social-proof",
    topLevel: standardTop,
    fields: [],
    defaultSettings: {},
    schema: googleReviewsSettingsSchema,
  },
  faq: {
    type: "faq",
    label: "FAQ — Minimal rows",
    description: "Minimal underlined accordion rows.",
    category: "marketing",
    topLevel: ["eyebrow", "title", "subtitle"],
    fields: [],
    groups: [
      {
        name: "faqs",
        label: "Questions",
        itemLabel: "FAQ",
        fields: [
          { name: "question", label: "Question", kind: "text" },
          { name: "answer", label: "Answer", kind: "longtext" },
        ],
      },
    ],
    defaultSettings: { faqs: [] },
    schema: faqSettingsSchema,
  },
  ctaBanner: {
    type: "ctaBanner",
    label: "CTA — Full-bleed band",
    description: "Full-bleed dark CTA with gold accent.",
    category: "marketing",
    topLevel: ["title", "subtitle"],
    fields: [
      { name: "body", label: "Supporting paragraph (optional)", kind: "longtext" },
      { name: "ctaLabel", label: "CTA label", kind: "text" },
      { name: "ctaHref", label: "CTA link", kind: "url" },
      {
        name: "variant",
        label: "Variant",
        kind: "select",
        options: [
          { label: "Dark (ink)", value: "dark" },
          { label: "Light (cream)", value: "light" },
        ],
      },
      { name: "background", label: "Background image (optional)", kind: "image" },
    ],
    defaultSettings: { ctaLabel: "Start a project", ctaHref: "/contact", body: "", variant: "dark", background: "" },
    schema: ctaBannerSettingsSchema,
  },
  imageText: {
    type: "imageText",
    label: "Image + text",
    description: "Full-bleed image paired with editorial text.",
    category: "content",
    topLevel: standardTop,
    fields: [
      { name: "image", label: "Image", kind: "image" },
      { name: "imageAlt", label: "Image alt text", kind: "text" },
      { name: "body", label: "Body copy", kind: "longtext" },
      { name: "checklistTitle", label: "Checklist heading", kind: "text" },
      { name: "footer", label: "Closing copy (after checklist)", kind: "longtext" },
      {
        name: "align",
        label: "Image alignment",
        kind: "select",
        options: [
          { label: "Image left", value: "left" },
          { label: "Image right", value: "right" },
        ],
      },
      { name: "ctaLabel", label: "CTA label", kind: "text" },
      { name: "ctaHref", label: "CTA link", kind: "url" },
    ],
    groups: [
      {
        name: "bullets",
        label: "Checklist items",
        itemLabel: "Item",
        fields: [{ name: "value", label: "Item", kind: "text" }],
      },
    ],
    defaultSettings: {
      image: "",
      imageAlt: "",
      body: "",
      checklistTitle: "",
      footer: "",
      bullets: [],
      align: "left",
      ctaLabel: "",
      ctaHref: "",
      headingAs: "h2",
    },
    schema: imageTextSettingsSchema,
  },
  logoCloud: {
    type: "logoCloud",
    label: "Logo cloud",
    description: "Client logo wall.",
    category: "social-proof",
    topLevel: standardTop,
    fields: [],
    groups: [
      {
        name: "logos",
        label: "Logos",
        itemLabel: "Logo",
        fields: [
          { name: "label", label: "Brand name", kind: "text" },
          { name: "image", label: "Logo image", kind: "image" },
        ],
      },
    ],
    defaultSettings: { logos: [] },
    schema: logoCloudSettingsSchema,
  },
  contactForm: {
    type: "contactForm",
    label: "Contact form",
    description: "Lead capture form with left-column copy.",
    category: "form",
    topLevel: ["title", "subtitle"],
    fields: [],
    defaultSettings: {},
    schema: contactFormSettingsSchema,
  },
  gallery: {
    type: "gallery",
    label: "Gallery grid",
    description: "Editorial image grid with captions.",
    category: "content",
    topLevel: standardTop,
    fields: [{ name: "columns", label: "Columns", kind: "number" }],
    groups: [
      {
        name: "items",
        label: "Images",
        itemLabel: "Image",
        fields: [
          { name: "image", label: "Image", kind: "image" },
          { name: "alt", label: "Alt text", kind: "text" },
          { name: "caption", label: "Caption", kind: "text" },
        ],
      },
    ],
    defaultSettings: { items: [], columns: 3 },
    schema: gallerySettingsSchema,
  },
  quote: {
    type: "quote",
    label: "Quote",
    description: "Large editorial pull-quote.",
    category: "social-proof",
    topLevel: ["eyebrow"],
    fields: [
      { name: "quote", label: "Quote", kind: "longtext" },
      { name: "author", label: "Author", kind: "text" },
      { name: "role", label: "Role / company", kind: "text" },
      { name: "image", label: "Author avatar", kind: "image" },
    ],
    defaultSettings: { quote: "", author: "", role: "", image: "" },
    schema: quoteSettingsSchema,
  },
};

export function getSectionSpec(type: SectionType): SectionTypeSpec {
  return SECTION_SPECS[type];
}

export function buildDefaultSection(type: SectionType): PageSection {
  const spec = SECTION_SPECS[type];
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    title: "",
    eyebrow: "",
    subtitle: "",
    enabled: true,
    settings: structuredClone(spec.defaultSettings),
  };
}

export const SECTION_GROUPS: { label: string; types: SectionType[] }[] = [
  { label: "Hero", types: ["heroEditorial", "heroSlider"] },
  { label: "Content", types: ["categoryStories", "servicesEditorial", "serviceGrid", "caseStudyGrid", "processSteps", "imageText", "gallery"] },
  { label: "Social proof", types: ["statsBand", "marquee", "logoCloud", "googleReviews", "testimonialSlider", "quote"] },
  { label: "Marketing", types: ["faq", "ctaBanner"] },
  { label: "Form", types: ["contactForm"] },
];
