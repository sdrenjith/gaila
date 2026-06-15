"use server";

import { unlink } from "node:fs/promises";
import { join, normalize, sep } from "node:path";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { authenticateAdmin, createSession, destroySession, hashPassword, requireAdmin } from "@/lib/auth";
import {
  legacyKindForCategorySlug,
  syncCategoryStoriesToContent,
  syncContentFieldsToCategoryStory,
} from "@/lib/category-content-sync";
import { withSequentialStoryOrder } from "@/lib/category-order";
import { connectDB } from "@/lib/db";
import { deleteMediaAssetById } from "@/lib/media-assets";
import { normalizePageSlug, slugify } from "@/lib/slug";
import {
  contentFormSchema,
  loginSchema,
  menuFormSchema,
  pageFormSchema,
  settingsFormSchema,
} from "@/lib/validators";
import { AdminUser } from "@/models/AdminUser";
import { Category } from "@/models/Category";
import { Content } from "@/models/Content";
import { Lead } from "@/models/Lead";
import { NavigationMenu } from "@/models/NavigationMenu";
import { Page } from "@/models/Page";
import { SiteSettings } from "@/models/SiteSettings";
import type { CategoryStoryRecord, GoogleReviewRecord, MenuItem, PageSection } from "@/types/cms";

export type AdminActionState = {
  ok: boolean;
  message: string;
};

function firstIssue(error: { issues: { message: string }[] }) {
  return error.issues[0]?.message || "Please check the submitted data.";
}

function revalidateAdminPages(slug?: string) {
  revalidateTag("admin-pages", "max");
  if (slug) {
    revalidateTag(`admin-page:${slug}`, "max");
  }
}

function revalidateAdminCategories(slug?: string) {
  revalidateTag("admin-categories", "max");
  if (slug) {
    revalidateTag(`admin-category:${slug}`, "max");
  }
}

function revalidateAdminContent(slug?: string) {
  revalidateTag("admin-content", "max");
  if (slug) {
    revalidateTag(`admin-content:${slug}`, "max");
  }
}

function formatDbError(error: unknown, context: string): string {
  if (error && typeof error === "object" && "code" in error && error.code === 11000) {
    const keyValue =
      "keyValue" in error && error.keyValue && typeof error.keyValue === "object"
        ? Object.values(error.keyValue as Record<string, unknown>).join(", ")
        : "";
    return keyValue
      ? `A record with slug “${keyValue}” already exists. Choose a unique slug or edit it in the content library.`
      : "A record with this slug already exists. Choose a unique slug.";
  }

  console.error(`${context}:`, error);
  return "Something went wrong while saving. Please try again.";
}

export async function loginAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { ok: false, message: firstIssue(parsed.error) };
  }

  const user = await authenticateAdmin(parsed.data.email, parsed.data.password);
  if (!user) {
    return { ok: false, message: "Invalid email or password." };
  }

  await createSession(user);
  redirect("/admin");
}

export async function logoutAction() {
  await destroySession();
  redirect("/admin/login");
}

export async function savePageAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = pageFormSchema.safeParse({
    id: formData.get("id") || "",
    title: formData.get("title"),
    slug: formData.get("slug"),
    status: formData.get("status"),
    template: formData.get("template"),
    showInHeader: formData.get("showInHeader") === "on",
    headerLabel: formData.get("headerLabel") || "",
    headerOrder: formData.get("headerOrder") || 0,
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    sectionsJson: formData.get("sectionsJson"),
  });

  if (!parsed.success) {
    return { ok: false, message: firstIssue(parsed.error) };
  }

  let sections: PageSection[];
  try {
    sections = JSON.parse(parsed.data.sectionsJson) as PageSection[];
    if (!Array.isArray(sections)) throw new Error("Sections must be an array.");
  } catch {
    return { ok: false, message: "Sections JSON is invalid." };
  }

  await connectDB();
  const pageSlug = normalizePageSlug(parsed.data.slug);
  const pagePayload = {
    title: parsed.data.title,
    slug: pageSlug,
    status: parsed.data.status,
    template: parsed.data.template,
    showInHeader: parsed.data.showInHeader && parsed.data.status === "published",
    headerLabel: parsed.data.headerLabel.trim(),
    headerOrder: parsed.data.headerOrder,
    seo: {
      title: parsed.data.seoTitle,
      description: parsed.data.seoDescription,
      keywords: [],
    },
    sections,
  };

  if (parsed.data.id) {
    await Page.updateOne({ _id: parsed.data.id }, { $set: pagePayload }, { upsert: false });
  } else {
    await Page.updateOne({ slug: pageSlug }, { $set: pagePayload }, { upsert: true });
  }

  revalidatePath("/");
  revalidatePath(`/${normalizePageSlug(parsed.data.slug)}`);
  revalidatePath("/admin/pages");
  revalidatePath("/admin/menus");
  revalidateAdminPages(pageSlug);
  return { ok: true, message: "Page saved." };
}

export async function deletePageAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) {
    return { ok: false, message: "Page id is required." };
  }

  await connectDB();
  const page = await Page.findOne({ _id: id }, { slug: 1, title: 1 }).lean<{ slug?: string; title?: string }>();
  if (!page) {
    return { ok: false, message: "Page not found." };
  }
  if (page.slug === "home") {
    return { ok: false, message: "The home page cannot be deleted." };
  }

  await Page.deleteOne({ _id: id });
  revalidatePath("/");
  revalidatePath("/admin/pages");
  revalidatePath("/admin/menus");
  revalidateAdminPages(page.slug);
  return { ok: true, message: `Deleted “${page.title || page.slug}”.` };
}

export async function saveContentAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = contentFormSchema.safeParse({
    id: formData.get("id") || "",
    kind: formData.get("kind"),
    title: formData.get("title"),
    slug: formData.get("slug"),
    excerpt: formData.get("excerpt"),
    body: formData.get("body"),
    coverImage: formData.get("coverImage") || "",
    tags: formData.get("tags") || "",
    status: formData.get("status"),
    featured: formData.get("featured") === "on",
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
  });

  if (!parsed.success) {
    return { ok: false, message: firstIssue(parsed.error) };
  }

  await connectDB();
  const slug = slugify(parsed.data.slug);
  const categorySlugByKind = {
    caseStudy: "case-studies",
    service: "services",
    blog: "insights",
  } as const;
  const categorySlug = categorySlugByKind[parsed.data.kind];
  const contentPayload = {
    kind: parsed.data.kind,
    title: parsed.data.title,
    slug,
    excerpt: parsed.data.excerpt,
    body: parsed.data.body,
    coverImage: parsed.data.coverImage,
    tags: parsed.data.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
    status: parsed.data.status,
    featured: parsed.data.featured,
    seo: {
      title: parsed.data.seoTitle,
      description: parsed.data.seoDescription,
      keywords: [],
    },
  };

  try {
    if (parsed.data.id) {
      await Content.updateOne({ _id: parsed.data.id }, { $set: contentPayload }, { upsert: false });
    } else {
      await Content.updateOne({ slug }, { $set: contentPayload }, { upsert: true });
    }

    if (categorySlug) {
      await syncContentFieldsToCategoryStory(parsed.data.kind, slug, {
        title: parsed.data.title,
        excerpt: parsed.data.excerpt,
        body: parsed.data.body,
        coverImage: parsed.data.coverImage,
        status: parsed.data.status,
      });
    }
  } catch (error) {
    return { ok: false, message: formatDbError(error, "saveContentAction") };
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/case-studies");
  revalidatePath("/blog");
  revalidatePath("/admin/content");
  revalidatePath("/admin/categories");
  revalidateTag(`content:${parsed.data.kind}`, "max");
  revalidateAdminContent(slug);
  revalidateAdminCategories(categorySlug);
  return { ok: true, message: "Content saved." };
}

export async function deleteContentAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) {
    return { ok: false, message: "Content id is required." };
  }

  await connectDB();
  const item = await Content.findOne({ _id: id }, { title: 1, slug: 1 }).lean<{ title?: string; slug?: string }>();
  if (!item) {
    return { ok: false, message: "Content not found." };
  }

  await Content.deleteOne({ _id: id });
  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/case-studies");
  revalidatePath("/blog");
  revalidatePath("/admin/content");
  revalidateAdminContent(item.slug);
  return { ok: true, message: `Deleted “${item.title || "content entry"}”.` };
}

export async function saveSettingsAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = settingsFormSchema.safeParse({
    siteName: formData.get("siteName"),
    tagline: formData.get("tagline"),
    logoText: formData.get("logoText"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    whatsapp: formData.get("whatsapp") || "",
    address: formData.get("address"),
    instagram: formData.get("instagram") || "",
    linkedin: formData.get("linkedin") || "",
    facebook: formData.get("facebook") || "",
    x: formData.get("x") || "",
    footerDescription: formData.get("footerDescription"),
    copyright: formData.get("copyright"),
    footerTagline: formData.get("footerTagline"),
    seoTitle: formData.get("seoTitle"),
    seoDescription: formData.get("seoDescription"),
    googleReviewsJson: formData.get("googleReviewsJson"),
  });

  if (!parsed.success) {
    return { ok: false, message: firstIssue(parsed.error) };
  }

  let googleReviews: GoogleReviewRecord[];
  try {
    googleReviews = JSON.parse(parsed.data.googleReviewsJson) as GoogleReviewRecord[];
    if (!Array.isArray(googleReviews)) {
      throw new Error("Google reviews must be an array.");
    }
  } catch {
    return { ok: false, message: "Google reviews JSON is invalid." };
  }

  await connectDB();
  await SiteSettings.updateOne(
    {},
    {
      $set: {
        siteName: parsed.data.siteName,
        tagline: parsed.data.tagline,
        logoText: parsed.data.logoText,
        contact: {
          email: parsed.data.email,
          phone: parsed.data.phone,
          whatsapp: parsed.data.whatsapp,
          address: parsed.data.address,
        },
        social: {
          instagram: parsed.data.instagram,
          linkedin: parsed.data.linkedin,
          facebook: parsed.data.facebook,
          x: parsed.data.x,
        },
        footer: {
          description: parsed.data.footerDescription,
          copyright: parsed.data.copyright,
          tagline: parsed.data.footerTagline,
        },
        googleReviews,
        seoDefaults: {
          title: parsed.data.seoTitle,
          description: parsed.data.seoDescription,
          keywords: [],
        },
      },
    },
    { upsert: true },
  );

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/login");
  revalidateTag("site-settings", "max");
  return { ok: true, message: "Settings saved." };
}

export async function saveMenuAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const parsed = menuFormSchema.safeParse({
    location: formData.get("location"),
    title: formData.get("title"),
    itemsJson: formData.get("itemsJson"),
    ctaEyebrow: formData.get("ctaEyebrow") || "",
    ctaHeadline: formData.get("ctaHeadline") || "",
    ctaHeadlineAccent: formData.get("ctaHeadlineAccent") || "",
    ctaLabel: formData.get("ctaLabel") || "",
    ctaHref: formData.get("ctaHref") || "",
    ctaVisible: formData.get("ctaVisible") === "on",
    instagram: formData.get("instagram") || "",
    linkedin: formData.get("linkedin") || "",
    facebook: formData.get("facebook") || "",
    x: formData.get("x") || "",
  });

  if (!parsed.success) {
    return { ok: false, message: firstIssue(parsed.error) };
  }

  let items: MenuItem[];
  try {
    items = JSON.parse(parsed.data.itemsJson) as MenuItem[];
    if (!Array.isArray(items)) throw new Error("Menu items must be an array.");
  } catch {
    return { ok: false, message: "Menu JSON is invalid." };
  }

  await connectDB();
  await NavigationMenu.updateOne(
    { location: parsed.data.location },
    {
      $set: {
        location: parsed.data.location,
        title: parsed.data.title,
        items,
        cta: {
          eyebrow: parsed.data.ctaEyebrow,
          headline: parsed.data.ctaHeadline,
          headlineAccent: parsed.data.ctaHeadlineAccent,
          label: parsed.data.ctaLabel,
          href: parsed.data.ctaHref,
          visible: parsed.data.ctaVisible,
        },
      },
    },
    { upsert: true },
  );

  if (parsed.data.location === "footer") {
    await SiteSettings.updateOne(
      {},
      {
        $set: {
          social: {
            instagram: parsed.data.instagram ?? "",
            linkedin: parsed.data.linkedin ?? "",
            facebook: parsed.data.facebook ?? "",
            x: parsed.data.x ?? "",
          },
        },
      },
      { upsert: true },
    );
    revalidateTag("site-settings", "max");
  }

  revalidatePath("/");
  revalidatePath("/admin/menus");
  revalidateTag(`navigation:${parsed.data.location}`, "max");
  return { ok: true, message: "Menu saved." };
}

const LEAD_STATUSES = ["new", "contacted", "qualified", "closed"] as const;
type LeadStatus = (typeof LEAD_STATUSES)[number];

export async function updateLeadStatusAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) {
    return { ok: false, message: "Lead id is required." };
  }

  await connectDB();
  const rawStatus = String(formData.get("status") || "new");
  const status: LeadStatus = (LEAD_STATUSES as readonly string[]).includes(rawStatus)
    ? (rawStatus as LeadStatus)
    : "new";
  const result = await Lead.updateOne({ _id: id }, { $set: { status } });
  if (result.matchedCount === 0) {
    return { ok: false, message: "Lead not found." };
  }

  revalidatePath("/admin/leads");
  return { ok: true, message: `Lead status updated to ${status}.` };
}

export async function createAdminUserAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  const session = await requireAdmin();
  if (session.role !== "admin") {
    return { ok: false, message: "Only admins can create users." };
  }

  const name = String(formData.get("name") || "");
  const email = String(formData.get("email") || "").toLowerCase();
  const password = String(formData.get("password") || "");
  const emailValid = z.string().email().safeParse(email).success;
  if (!name || !emailValid || password.length < 8) {
    return { ok: false, message: "Name, valid email, and 8+ character password are required." };
  }

  await connectDB();
  await AdminUser.updateOne(
    { email },
    { $set: { name, email, passwordHash: await hashPassword(password), role: "editor", status: "active" } },
    { upsert: true },
  );
  revalidatePath("/admin/users");
  return { ok: true, message: "User saved." };
}

export async function updateAdminUserAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  const session = await requireAdmin();
  if (session.role !== "admin") {
    return { ok: false, message: "Only admins can edit users." };
  }

  const id = String(formData.get("id") || "");
  const name = String(formData.get("name") || "").trim();
  const email = String(formData.get("email") || "").toLowerCase().trim();
  const password = String(formData.get("password") || "");
  const role = String(formData.get("role") || "editor");
  const status = String(formData.get("status") || "active");

  const emailValid = z.string().email().safeParse(email).success;
  if (!id || !name || !emailValid) {
    return { ok: false, message: "Name and a valid email are required." };
  }
  if (password && password.length < 8) {
    return { ok: false, message: "Passwords must be at least 8 characters." };
  }
  if (!["admin", "editor"].includes(role)) {
    return { ok: false, message: "Invalid role." };
  }
  if (!["active", "disabled"].includes(status)) {
    return { ok: false, message: "Invalid status." };
  }

  await connectDB();
  const update: Record<string, unknown> = { name, email, role, status };
  if (password) {
    update.passwordHash = await hashPassword(password);
  }

  await AdminUser.updateOne({ _id: id }, { $set: update }, { upsert: false });
  revalidatePath("/admin/users");
  return { ok: true, message: "User updated." };
}

function parseCategoryStories(raw: string): CategoryStoryRecord[] {
  const parsed = JSON.parse(raw) as unknown;
  if (!Array.isArray(parsed)) {
    throw new Error("Stories must be an array.");
  }

  const stories = parsed.map((story, storyIndex) => {
    const source = story && typeof story === "object" ? (story as Record<string, unknown>) : {};
    const rawSubitems = Array.isArray(source.subitems) ? source.subitems : [];
    return {
      id: String(source.id || `story-${storyIndex + 1}`),
      title: String(source.title || "").trim(),
      slug: slugify(String(source.slug || source.title || `story-${storyIndex + 1}`)),
      summary: String(source.summary || "").trim(),
      body: String(source.body || "").trim(),
      status: source.status === "published" ? ("published" as const) : ("draft" as const),
      media: String(source.media || "").trim(),
      order: typeof source.order === "number" ? source.order : storyIndex,
      subitems: rawSubitems.map((subitem, subitemIndex) => {
        const subSource =
          subitem && typeof subitem === "object" ? (subitem as Record<string, unknown>) : {};
        return {
          id: String(subSource.id || `subitem-${subitemIndex + 1}`),
          title: String(subSource.title || "").trim(),
          content: String(subSource.content || "").trim(),
          status: subSource.status === "published" ? ("published" as const) : ("draft" as const),
          media: String(subSource.media || "").trim(),
          order: typeof subSource.order === "number" ? subSource.order : subitemIndex,
        };
      }),
    };
  });

  return withSequentialStoryOrder(stories);
}

export async function saveCategoryAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const title = String(formData.get("title") || "").trim();
  const slug = slugify(String(formData.get("slug") || title));
  const description = String(formData.get("description") || "").trim();
  const status = String(formData.get("status") || "draft");
  const storiesJson = String(formData.get("storiesJson") || "[]");

  if (title.length < 2) {
    return { ok: false, message: "Category title is required." };
  }
  if (!slug) {
    return { ok: false, message: "Category slug is required." };
  }
  if (!["draft", "published"].includes(status)) {
    return { ok: false, message: "Invalid category status." };
  }

  let stories: CategoryStoryRecord[];
  try {
    stories = parseCategoryStories(storiesJson);
  } catch {
    return { ok: false, message: "Stories JSON is invalid." };
  }

  if (stories.some((story) => !story.title || !story.slug)) {
    return { ok: false, message: "Every story needs a title and slug." };
  }
  const storySlugs = stories.map((story) => story.slug);
  if (new Set(storySlugs).size !== storySlugs.length) {
    return { ok: false, message: "Each story must have a unique slug." };
  }
  if (
    stories.some((story) =>
      story.subitems.some((subitem) => !subitem.title),
    )
  ) {
    return { ok: false, message: "Every subitem needs a title." };
  }

  await connectDB();
  const payload = { title, slug, description, status, stories };

  try {
    if (id) {
      await Category.updateOne({ _id: id }, { $set: payload }, { upsert: false });
    } else {
      await Category.updateOne({ slug }, { $set: payload }, { upsert: true });
    }

    await syncCategoryStoriesToContent(slug, stories);
  } catch (error) {
    return { ok: false, message: formatDbError(error, "saveCategoryAction") };
  }

  revalidatePath("/");
  revalidatePath("/services");
  revalidatePath("/case-studies");
  revalidatePath("/blog");
  revalidatePath("/admin/categories");
  revalidatePath("/admin/content");
  revalidateAdminCategories(slug);
  const kind = legacyKindForCategorySlug(slug);
  if (kind) {
    revalidateTag(`content:${kind}`, "max");
  }
  return { ok: true, message: "Category saved." };
}

export async function deleteCategoryAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  if (!id) {
    return { ok: false, message: "Category id is required." };
  }

  await connectDB();
  const category = await Category.findOne({ _id: id }, { title: 1, slug: 1 }).lean<{ title?: string; slug?: string }>();
  if (!category) {
    return { ok: false, message: "Category not found." };
  }

  await Category.deleteOne({ _id: id });
  revalidatePath("/");
  revalidatePath("/admin/categories");
  revalidateAdminCategories(category.slug);
  return { ok: true, message: `Deleted “${category.title || "category"}”.` };
}

const heroVideoUrlSchema = z
  .string()
  .url({ message: "Hero video must be a valid https URL or a /uploads/ path." })
  .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
    message: "Only http(s) URLs are allowed.",
  });

function isLocalUploadsPath(value: string): boolean {
  return value.startsWith("/uploads/");
}

async function tryDeleteUploadedFile(relativeUrl: string) {
  if (!isLocalUploadsPath(relativeUrl)) return;
  const trimmed = relativeUrl.replace(/^\/+/, "");
  const publicRoot = join(process.cwd(), "public");
  const absolute = normalize(join(publicRoot, trimmed));
  const uploadsRoot = join(publicRoot, "uploads") + sep;
  if (!absolute.startsWith(uploadsRoot)) return;
  try {
    await unlink(absolute);
  } catch (error) {
    console.warn(`Failed to delete previous hero video at ${absolute}:`, error);
  }
}

export async function saveHeroVideoAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const rawValue = String(formData.get("heroVideo") ?? "").trim();

  if (rawValue.length > 500) {
    return { ok: false, message: "Hero video path is too long." };
  }

  if (rawValue && !isLocalUploadsPath(rawValue)) {
    const parsed = heroVideoUrlSchema.safeParse(rawValue);
    if (!parsed.success) {
      return { ok: false, message: firstIssue(parsed.error) };
    }
  }

  await connectDB();
  const current = await SiteSettings.findOne({}, { heroVideo: 1 }).lean<{
    heroVideo?: string;
  } | null>();
  const previousValue = current?.heroVideo ?? "";

  if (previousValue && previousValue !== rawValue && isLocalUploadsPath(previousValue)) {
    await tryDeleteUploadedFile(previousValue);
  }

  await SiteSettings.updateOne({}, { $set: { heroVideo: rawValue } }, { upsert: true });

  revalidatePath("/");
  revalidatePath("/admin/settings");

  return {
    ok: true,
    message: rawValue ? "Hero video updated." : "Hero video cleared — using default.",
  };
}

const logoPathSchema = z
  .string()
  .max(500)
  .refine((value) => !value || value.startsWith("/"), {
    message: "Logo must be a site path (e.g. /uploads/brand/logo.webp).",
  });

const logoUrlSchema = z
  .string()
  .url({ message: "Logo must be a valid https URL or a site path." })
  .refine((value) => value.startsWith("http://") || value.startsWith("https://"), {
    message: "Only http(s) URLs are allowed.",
  });

export async function saveLogoAction(_: AdminActionState, formData: FormData): Promise<AdminActionState> {
  await requireAdmin();
  const rawValue = String(formData.get("logo") ?? "").trim();

  if (rawValue.length > 500) {
    return { ok: false, message: "Logo path is too long." };
  }

  if (rawValue && !isLocalUploadsPath(rawValue)) {
    if (rawValue.startsWith("/")) {
      const parsed = logoPathSchema.safeParse(rawValue);
      if (!parsed.success) {
        return { ok: false, message: firstIssue(parsed.error) };
      }
    } else {
      const parsed = logoUrlSchema.safeParse(rawValue);
      if (!parsed.success) {
        return { ok: false, message: firstIssue(parsed.error) };
      }
    }
  }

  await connectDB();
  const current = await SiteSettings.findOne({}, { logo: 1 }).lean<{ logo?: string } | null>();
  const previousValue = current?.logo ?? "";

  if (previousValue && previousValue !== rawValue && isLocalUploadsPath(previousValue)) {
    await tryDeleteUploadedFile(previousValue);
  }

  await SiteSettings.updateOne({}, { $set: { logo: rawValue } }, { upsert: true });

  revalidatePath("/");
  revalidatePath("/admin/settings");
  revalidatePath("/admin/login");
  revalidatePath("/admin", "layout");

  return {
    ok: true,
    message: rawValue ? "Site logo updated." : "Site logo cleared — using text fallback.",
  };
}

export async function deleteMediaAssetAction(
  _: AdminActionState,
  formData: FormData,
): Promise<AdminActionState> {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const result = await deleteMediaAssetById(id);

  if (!result.ok) {
    return { ok: false, message: result.message };
  }

  revalidatePath("/admin/media");
  return { ok: true, message: `Deleted “${result.title}”.` };
}
