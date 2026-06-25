import { SectionProgressiveLoader } from "@/components/sections/SectionProgressiveLoader";
import { CategoryStoriesSection } from "@/components/sections/CategoryStoriesSection";
import { CaseStudiesEditorial } from "@/components/sections/CaseStudiesEditorial";
import { ContentCard } from "@/components/sections/ContentCard";
import { EditorialContact } from "@/components/sections/EditorialContact";
import { EditorialCta } from "@/components/sections/EditorialCta";
import { EditorialFaq } from "@/components/sections/EditorialFaq";
import { EditorialGallery } from "@/components/sections/EditorialGallery";
import { EditorialImageSlider } from "@/components/sections/EditorialImageSlider";
import { AmbientBackgroundSlider } from "@/components/sections/AmbientBackgroundSlider";
import { EditorialImageText } from "@/components/sections/EditorialImageText";
import { EditorialMarquee } from "@/components/sections/EditorialMarquee";
import { EditorialProcess } from "@/components/sections/EditorialProcess";
import { EditorialQuote } from "@/components/sections/EditorialQuote";
import { EditorialStats } from "@/components/sections/EditorialStats";
import { GoogleReviewsSlider } from "@/components/sections/GoogleReviewsSlider";
import { HeroAnimated } from "@/components/sections/HeroAnimated";
import { HeroEditorial, type HeroEditorialCategory } from "@/components/sections/HeroEditorial";
import { ServicesEditorial, type ServicesEditorialItem } from "@/components/sections/ServicesEditorial";
import { ScrollProgressCircle } from "@/components/sections/ScrollProgressCircle";
import { SectionShell } from "@/components/ui/SectionShell";
import { getCategories, getContent, getSiteSettings } from "@/lib/cms";
import { whatsappWaMeUrl } from "@/lib/phone";
import {
  getCategoryEditorialItems,
  resolveCaseStudyGridCategorySlug,
} from "@/lib/section-category-source";
import { sortStoriesByOrder } from "@/lib/category-order";
import { collectPageSectionAssets } from "@/lib/section-assets";
import type { PageSection, SiteSettingsRecord } from "@/types/cms";

type StringRecord = Record<string, unknown>;

function sectionSettings(section: PageSection): StringRecord {
  return (section.settings && typeof section.settings === "object" ? section.settings : {}) as StringRecord;
}

function getArray<T>(settings: StringRecord | undefined, key: string): T[] {
  const source = settings ?? {};
  const value = source[key];
  return Array.isArray(value) ? (value as T[]) : [];
}

function getString(settings: StringRecord | undefined, key: string, fallback = "") {
  const source = settings ?? {};
  const value = source[key];
  return typeof value === "string" ? value : fallback;
}

function getNumber(settings: StringRecord | undefined, key: string, fallback = 0) {
  const source = settings ?? {};
  const value = source[key];
  if (typeof value === "number") return value;
  if (typeof value === "string" && value.trim()) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return fallback;
}

async function renderSectionInner(section: PageSection, siteSettings: SiteSettingsRecord | null) {
  const settings = sectionSettings(section);

  switch (section.type) {
    case "heroEditorial": {
      const categories = getArray<HeroEditorialCategory>(settings, "categories").filter(
        (entry) => entry && entry.label && entry.href,
      );
      const sectionVideo = getString(settings, "video", "");
      const heroVideoOverride =
        sectionVideo || siteSettings?.heroVideo || "";
      const rotatingTitles = getArray<unknown>(settings, "rotatingTitles")
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (entry && typeof entry === "object" && "value" in entry) {
            const v = (entry as { value?: unknown }).value;
            return typeof v === "string" ? v : "";
          }
          return "";
        })
        .map((t) => t.trim())
        .filter((t) => t.length > 0);
      const rotationSeconds = getNumber(settings, "rotationSeconds", 4) || 4;
      const backgroundImages = getArray<{ image?: string; alt?: string }>(settings, "backgroundImages")
        .map((entry) => entry?.image?.trim() ?? "")
        .filter(Boolean);
      const backgroundIntervalSeconds = getNumber(settings, "backgroundIntervalSeconds", 6) || 6;
      return (
        <HeroEditorial
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          video={heroVideoOverride}
          poster={getString(settings, "poster", "")}
          image={getString(settings, "image", "")}
          imageAlt={getString(settings, "imageAlt", section.title || "")}
          ctaLabel={getString(settings, "ctaLabel", "Plan your event")}
          ctaHref={getString(settings, "ctaHref", "/contact")}
          secondaryCtaLabel={getString(settings, "secondaryCtaLabel", "Request a proposal")}
          secondaryCtaHref={getString(settings, "secondaryCtaHref", "tel:+971502827279")}
          categories={categories}
          whatsappHref={whatsappWaMeUrl(siteSettings?.contact?.whatsapp ?? "+971567045314")}
          instagramHref={siteSettings?.social?.instagram ?? "https://instagram.com/gaila.ae"}
          contactHref="/contact"
          rotatingTitles={rotatingTitles}
          rotationSeconds={rotationSeconds}
          backgroundImages={backgroundImages}
          backgroundIntervalSeconds={backgroundIntervalSeconds}
        />
      );
    }

    case "heroSlider": {
      const slides = getArray<{
        title?: string;
        subtitle?: string;
        ctaLabel?: string;
        ctaHref?: string;
      }>(settings, "slides");
      const sectionVideo = getString(settings, "video", "");
      const heroVideoOverride =
        sectionVideo || siteSettings?.heroVideo || "";
      return (
        <HeroAnimated
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          slides={slides}
          video={heroVideoOverride}
          poster={getString(settings, "poster", "")}
        />
      );
    }

    case "marquee": {
      const items = getArray<string>(settings, "items").filter(
        (entry): entry is string => typeof entry === "string",
      );
      const speed = getNumber(settings, "speedSeconds", 38) || 38;
      return <EditorialMarquee items={items} speedSeconds={speed} />;
    }

    case "categoryStories": {
      const selectedSlugs = getArray<unknown>(settings, "categorySlugs")
        .map((entry) => {
          if (typeof entry === "string") return entry;
          if (entry && typeof entry === "object" && "value" in entry) {
            const value = (entry as { value?: unknown }).value;
            return typeof value === "string" ? value : "";
          }
          return "";
        })
        .map((value) => value.trim())
        .filter(Boolean);
      const storyLimit = getNumber(settings, "storyLimit", 6) || 6;
      const subitemLimit = getNumber(settings, "subitemLimit", 4) || 4;
      const showSubitems = settings["showSubitems"] !== false;
      const categories = await getCategories(true);
      const visibleCategories = (selectedSlugs.length
        ? categories.filter((category) => selectedSlugs.includes(category.slug))
        : categories).map((category) => ({
        ...category,
        stories: sortStoriesByOrder(category.stories).filter((story) => story.status === "published"),
      })).filter((category) => category.stories.length > 0);

      return (
        <CategoryStoriesSection
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          categories={visibleCategories}
          storyLimit={storyLimit}
          subitemLimit={subitemLimit}
          showSubitems={showSubitems}
        />
      );
    }

    case "servicesEditorial": {
      const limit = getNumber(settings, "limit", 6) || 6;
      const linkLabel = getString(settings, "linkLabel", "");
      const layoutRaw = getString(settings, "layout", "editorial");
      const manualCards = getArray<{
        title?: string;
        description?: string;
        href?: string;
        ctaLabel?: string;
        image?: string;
      }>(settings, "cards");

      let items: ServicesEditorialItem[];

      if (manualCards.length > 0) {
        items = manualCards
          .filter((card) => card.title?.trim())
          .map((card, index) => ({
            _id: `manual-${index}`,
            title: card.title?.trim() || "",
            excerpt: card.description?.trim() || "",
            href: card.href?.trim() || undefined,
            coverImage: card.image?.trim() || undefined,
            ctaLabel: card.ctaLabel?.trim() || undefined,
            tags: [],
            slug: "",
          }));
      } else {
        const selectedSlugs = getArray<unknown>(settings, "serviceSlugs")
          .map((entry) => {
            if (typeof entry === "string") return entry;
            if (entry && typeof entry === "object" && "value" in entry) {
              const value = (entry as { value?: unknown }).value;
              return typeof value === "string" ? value : "";
            }
            return "";
          })
          .map((value) => value.trim())
          .filter(Boolean);

        let services = await getContent("service", true);
        if (selectedSlugs.length > 0) {
          const order = new Map(selectedSlugs.map((slug, index) => [slug, index]));
          services = services
            .filter((service) => order.has(service.slug))
            .sort((a, b) => (order.get(a.slug) ?? 0) - (order.get(b.slug) ?? 0));
        }
        items = services.slice(0, limit);
      }

      const layout: "editorial" | "stacked" =
        layoutRaw === "stacked" || manualCards.length > 0 ? "stacked" : "editorial";
      const sliderImages = getArray<{ image?: string; alt?: string }>(settings, "sliderImages");
      const intervalSeconds = getNumber(settings, "intervalSeconds", 3.5) || 3.5;

      return (
        <ServicesEditorial
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          items={items}
          linkLabel={linkLabel}
          layout={layout}
          sliderImages={sliderImages}
          intervalSeconds={intervalSeconds}
        />
      );
    }

    case "serviceGrid": {
      const services = await getContent("service", true);
      return (
        <SectionShell eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle}>
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <ContentCard key={service._id} item={service} />
            ))}
          </div>
        </SectionShell>
      );
    }

    case "caseStudyGrid": {
      const categorySlug = resolveCaseStudyGridCategorySlug(settings);
      const limit = getNumber(settings, "limit", 0);
      const { items, hrefBase, kind } = await getCategoryEditorialItems(categorySlug, {
        limit,
        publishedOnly: true,
      });
      return (
        <CaseStudiesEditorial
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          items={items}
          hrefBase={hrefBase}
          kind={kind === "blog" ? "blog" : "caseStudy"}
        />
      );
    }

    case "statsBand": {
      const stats = getArray<{ value?: string; label?: string }>(settings, "stats");
      return <EditorialStats eyebrow={section.eyebrow} title={section.title} stats={stats} />;
    }

    case "processSteps": {
      const steps = getArray<{ title?: string; text?: string }>(settings, "steps");
      return (
        <EditorialProcess
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          steps={steps}
        />
      );
    }

    case "googleReviews":
    case "testimonialSlider": {
      const reviews = siteSettings?.googleReviews ?? [];
      return (
        <SectionShell eyebrow={section.eyebrow} title={section.title} subtitle={section.subtitle}>
          <GoogleReviewsSlider reviews={reviews} />
        </SectionShell>
      );
    }

    case "faq": {
      const faqs = getArray<{ question?: string; answer?: string }>(settings, "faqs");
      return (
        <EditorialFaq
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          faqs={faqs}
        />
      );
    }

    case "ctaBanner": {
      const variantRaw = getString(settings, "variant", "dark");
      const variant: "light" | "dark" = variantRaw === "light" ? "light" : "dark";
      return (
        <EditorialCta
          title={section.title}
          subtitle={section.subtitle}
          body={getString(settings, "body", "")}
          ctaLabel={getString(settings, "ctaLabel", "Plan your event")}
          ctaHref={getString(settings, "ctaHref", "/contact")}
          variant={variant}
          background={getString(settings, "background", "")}
        />
      );
    }

    case "imageText":
    case "logoCloud": {
      const alignRaw = getString(settings, "align", "left");
      const align: "left" | "right" = alignRaw === "right" ? "right" : "left";
      return (
        <EditorialImageText
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          body={getString(settings, "body", "")}
          checklistTitle={getString(settings, "checklistTitle", "")}
          footer={getString(settings, "footer", "")}
          bullets={getArray<string>(settings, "bullets").filter(
            (entry): entry is string => typeof entry === "string",
          )}
          image={getString(settings, "image", "")}
          imageAlt={getString(settings, "imageAlt", section.title || "")}
          align={align}
          ctaLabel={getString(settings, "ctaLabel", "")}
          ctaHref={getString(settings, "ctaHref", "")}
          headingAs={getString(settings, "headingAs", "h2") === "h1" ? "h1" : "h2"}
        />
      );
    }

    case "gallery": {
      const items = getArray<{ image?: string; alt?: string; caption?: string }>(settings, "items");
      const categories = getArray<{
        slug?: string;
        label?: string;
        items?: { image?: string; alt?: string; caption?: string }[];
      }>(settings, "categories");
      const columns = getNumber(settings, "columns", 4) || 4;
      const defaultCategory = getString(settings, "defaultCategory", "");
      return (
        <EditorialGallery
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          items={items}
          categories={categories}
          columns={columns}
          defaultCategory={defaultCategory}
        />
      );
    }

    case "quote": {
      return (
        <EditorialQuote
          eyebrow={section.eyebrow}
          quote={getString(settings, "quote", "")}
          author={getString(settings, "author", "")}
          role={getString(settings, "role", "")}
          image={getString(settings, "image", "")}
        />
      );
    }

    case "contactForm": {
      return <EditorialContact title={section.title} subtitle={section.subtitle} />;
    }

    case "ambientBackgroundSlider": {
      const images = getArray<{ image?: string; alt?: string }>(settings, "images");
      const intervalSeconds = getNumber(settings, "intervalSeconds", 6) || 6;
      return <AmbientBackgroundSlider images={images} intervalSeconds={intervalSeconds} />;
    }

    case "editorialImageSlider": {
      const items = getArray<{ image?: string; alt?: string; caption?: string }>(settings, "items");
      const intervalSeconds = getNumber(settings, "intervalSeconds", 5) || 5;
      return (
        <EditorialImageSlider
          eyebrow={section.eyebrow}
          title={section.title}
          subtitle={section.subtitle}
          items={items}
          intervalSeconds={intervalSeconds}
          ctaLabel={getString(settings, "ctaLabel", "View gallery")}
          ctaHref={getString(settings, "ctaHref", "/gallery")}
        />
      );
    }

    case "scrollProgressCircle": {
      const mode = getString(settings, "mode", "story");
      const reviewLimit = getNumber(settings, "reviewLimit", 5) || 5;

      if (mode === "reviews") {
        const reviews = (siteSettings?.googleReviews ?? []).slice(0, reviewLimit);
        const scrollHeightVh = getNumber(settings, "scrollHeightVh", 0);
        return (
          <ScrollProgressCircle
            mode="reviews"
            reviews={reviews}
            scrollHeightVh={scrollHeightVh}
            header={{
              eyebrow: section.eyebrow,
              title: section.title,
              subtitle: section.subtitle,
            }}
          />
        );
      }

      const steps = getArray<{
        eyebrow?: string;
        title?: string;
        body?: string;
        image?: string;
        imageAlt?: string;
      }>(settings, "steps");
      const scrollHeightVh = getNumber(settings, "scrollHeightVh", 33) || 33;
      return <ScrollProgressCircle mode="story" steps={steps} scrollHeightVh={scrollHeightVh} />;
    }

    default:
      return null;
  }
}

async function renderSection(section: PageSection, siteSettings: SiteSettingsRecord | null) {
  try {
    return await renderSectionInner(section, siteSettings);
  } catch (error) {
    console.error(`Failed to render section "${section.type}":`, error);
    return null;
  }
}

function sectionNeedsSiteSettings(section: PageSection) {
  if (section.type === "scrollProgressCircle") {
    const settings = section.settings ?? {};
    return getString(settings, "mode", "story") === "reviews";
  }

  return (
    section.type === "heroEditorial" ||
    section.type === "heroSlider" ||
    section.type === "googleReviews" ||
    section.type === "testimonialSlider"
  );
}

export async function SectionRenderer({ sections }: { sections: PageSection[] }) {
  const enabledSections = sections.filter((section) => section.enabled);
  const siteSettings = enabledSections.some((section) => sectionNeedsSiteSettings(section))
    ? await getSiteSettings()
    : null;
  const [settled, sectionAssets] = await Promise.all([
    Promise.allSettled(
      enabledSections.map(async (section) => ({
        section,
        node: await renderSection(section, siteSettings),
      })),
    ),
    collectPageSectionAssets(enabledSections, siteSettings),
  ]);
  type RenderedSection = { section: PageSection; node: Awaited<ReturnType<typeof renderSection>> };
  const rendered = settled
    .map((result, index): RenderedSection | null => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      console.error(
        `Failed to render section "${enabledSections[index]?.type}":`,
        result.reason,
      );
      return null;
    })
    .filter((entry): entry is RenderedSection => entry !== null && entry.node !== null);

  return (
    <>
      <SectionProgressiveLoader assets={sectionAssets} />
      {rendered.map(({ section, node }) =>
        node ? (
          <div key={section.id} id={section.id} data-section-type={section.type}>
            {node}
          </div>
        ) : null,
      )}
    </>
  );
}

/** Helper used by pages to build a side-nav of the page's enabled sections. */
export function sectionNavItems(sections: PageSection[]) {
  const labels: Partial<Record<PageSection["type"], string>> = {
    heroEditorial: "Intro",
    heroSlider: "Intro",
    marquee: "Capabilities",
    servicesEditorial: "Services",
    categoryStories: "Categories",
    serviceGrid: "Services",
    caseStudyGrid: "Work",
    statsBand: "Numbers",
    processSteps: "Process",
    faq: "FAQ",
    ctaBanner: "Get in touch",
    imageText: "Story",
    scrollProgressCircle: "Reviews",
    logoCloud: "Clients",
    googleReviews: "Reviews",
    testimonialSlider: "Reviews",
    gallery: "Gallery",
    quote: "Quote",
    contactForm: "Contact",
  };

  return sections
    .filter((section) => section.enabled)
    .map((section) => ({
      id: section.id,
      label: section.title?.split(" ").slice(0, 2).join(" ") || labels[section.type] || section.type,
    }));
}
