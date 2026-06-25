export type AdminRole = "admin" | "editor";

export type PublishStatus = "draft" | "published";

export type MenuLocation = "header" | "footer";

export type SectionType =
  | "heroSlider"
  | "heroEditorial"
  | "marquee"
  | "categoryStories"
  | "serviceGrid"
  | "servicesEditorial"
  | "statsBand"
  | "processSteps"
  | "caseStudyGrid"
  | "googleReviews"
  | "testimonialSlider"
  | "faq"
  | "ctaBanner"
  | "imageText"
  | "logoCloud"
  | "contactForm"
  | "gallery"
  | "quote"
  | "ambientBackgroundSlider"
  | "editorialImageSlider"
  | "scrollProgressCircle";

export type GoogleReviewRecord = {
  author: string;
  rating: number;
  review: string;
  location: string;
  postedAt: string;
};

export type SeoMeta = {
  title: string;
  description: string;
  keywords?: string[];
  canonicalPath?: string;
  image?: string;
  noIndex?: boolean;
};

export type PageSection = {
  id: string;
  type: SectionType;
  title?: string;
  eyebrow?: string;
  subtitle?: string;
  enabled: boolean;
  settings: Record<string, unknown>;
};

export type PageRecord = {
  _id: string;
  title: string;
  slug: string;
  status: PublishStatus;
  template: "standard" | "landing" | "service" | "contact";
  showInHeader?: boolean;
  headerLabel?: string;
  headerOrder?: number;
  seo: SeoMeta;
  sections: PageSection[];
  updatedAt?: string;
};

export type AdminPageListItem = Pick<PageRecord, "_id" | "slug" | "title" | "status" | "updatedAt">;

export type MenuItem = {
  label: string;
  href: string;
  order: number;
  visible: boolean;
  children?: MenuItem[];
};

export type NavigationRecord = {
  _id: string;
  location: MenuLocation;
  title: string;
  items: MenuItem[];
  cta?: {
    eyebrow?: string;
    headline?: string;
    headlineAccent?: string;
    label: string;
    href: string;
    visible: boolean;
  };
};

export type SiteSettingsRecord = {
  _id: string;
  siteName: string;
  tagline: string;
  logoText: string;
  logo: string;
  contact: {
    email: string;
    phone: string;
    address: string;
    whatsapp: string;
  };
  social: {
    instagram: string;
    linkedin: string;
    facebook: string;
    x: string;
  };
  seoDefaults: SeoMeta;
  footer: {
    description: string;
    copyright: string;
    tagline?: string;
  };
  googleReviews: GoogleReviewRecord[];
  theme: {
    primary: string;
    accent: string;
    highlight: string;
  };
  heroVideo: string;
};

export type ContentRecord = {
  _id: string;
  kind: "service" | "caseStudy" | "blog";
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage?: string;
  tags: string[];
  status: PublishStatus;
  featured: boolean;
  seo: SeoMeta;
  metrics?: { label: string; value: string }[];
  updatedAt?: string;
};

export type AdminContentListItem = Pick<
  ContentRecord,
  "_id" | "slug" | "title" | "kind" | "status" | "featured"
>;

export type StorySubitemRecord = {
  id: string;
  title: string;
  content: string;
  status: PublishStatus;
  media?: string;
  order?: number;
  updatedAt?: string;
};

export type CategoryStoryRecord = {
  id: string;
  title: string;
  slug: string;
  summary: string;
  body: string;
  status: PublishStatus;
  media?: string;
  order?: number;
  subitems: StorySubitemRecord[];
  updatedAt?: string;
};

export type CategoryRecord = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  status: PublishStatus;
  stories: CategoryStoryRecord[];
  updatedAt?: string;
};

export type AdminCategoryListItem = Pick<CategoryRecord, "_id" | "slug" | "title" | "status" | "updatedAt">;

export type LeadRecord = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  service?: string;
  message: string;
  status: "new" | "contacted" | "qualified" | "closed";
  createdAt?: string;
};

export type MediaAssetRecord = {
  _id: string;
  title: string;
  url: string;
  alt: string;
  folder: string;
  mimeType: string;
  size: number;
  createdAt?: string;
};
