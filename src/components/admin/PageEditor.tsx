"use client";

import Link from "next/link";
import { useActionState, useEffect, useState, useTransition } from "react";
import { savePageAction, type AdminActionState } from "@/app/actions/admin";
import { SectionsManager } from "@/components/admin/SectionsManager";
import { useToast } from "@/components/admin/Toaster";
import { Panel, Select, Textarea, TextInput, Toggle } from "@/components/admin/forms/Field";
import type { PageRecord, PageSection } from "@/types/cms";
import type { CategoryOption } from "@/components/admin/SectionFieldRow";

type Props = {
  page?: PageRecord;
  starterSections: PageSection[];
  categories?: CategoryOption[];
};

const initialState: AdminActionState = { ok: false, message: "" };

function cloneSections(sections: PageSection[]) {
  return structuredClone(sections);
}

function syncHeroSection(
  sections: PageSection[],
  next: { title?: string; subtitle?: string },
) {
  const index = sections.findIndex((section) => section.type === "heroEditorial" || section.type === "heroSlider");
  if (index === -1) {
    return sections;
  }

  return sections.map((section, sectionIndex) =>
    sectionIndex === index
      ? {
          ...section,
          title: next.title ?? section.title,
          subtitle: next.subtitle ?? section.subtitle,
        }
      : section,
  );
}

export function PageEditor({ page, starterSections, categories = [] }: Props) {
  const { push } = useToast();
  const [state, formAction, pending] = useActionState(savePageAction, initialState);
  const [, startTransition] = useTransition();
  const [sections, setSections] = useState<PageSection[]>(() => cloneSections(page?.sections ?? starterSections));

  const [title, setTitle] = useState(page?.title ?? "");
  const [slug, setSlug] = useState(page?.slug ?? "new-page");
  const [status, setStatus] = useState(page?.status ?? "draft");
  const [template, setTemplate] = useState(page?.template ?? "standard");
  const [showInHeader, setShowInHeader] = useState(Boolean(page?.showInHeader));
  const [headerLabel, setHeaderLabel] = useState(page?.headerLabel ?? page?.title ?? "");
  const [headerOrder, setHeaderOrder] = useState(String(page?.headerOrder ?? 0));
  const [seoTitle, setSeoTitle] = useState(page?.seo.title ?? "New page | Gaila");
  const [seoDescription, setSeoDescription] = useState(
    page?.seo.description ?? "A new page on the Gaila site.",
  );
  const heroSection =
    sections.find((section) => section.type === "heroEditorial" || section.type === "heroSlider") ?? sections[0];
  const [headerTitle, setHeaderTitle] = useState(heroSection?.title ?? page?.title ?? "");
  const [headerContent, setHeaderContent] = useState(heroSection?.subtitle ?? "");

  useEffect(() => {
    const nextSections = cloneSections(page?.sections ?? starterSections);
    const nextHero =
      nextSections.find((section) => section.type === "heroEditorial" || section.type === "heroSlider") ??
      nextSections[0];

    setSections(nextSections);
    setTitle(page?.title ?? "");
    setSlug(page?.slug ?? "new-page");
    setStatus(page?.status ?? "draft");
    setTemplate(page?.template ?? "standard");
    setShowInHeader(Boolean(page?.showInHeader));
    setHeaderLabel(page?.headerLabel ?? page?.title ?? "");
    setHeaderOrder(String(page?.headerOrder ?? 0));
    setSeoTitle(page?.seo.title ?? "New page | Gaila");
    setSeoDescription(page?.seo.description ?? "A new page on the Gaila site.");
    setHeaderTitle(nextHero?.title ?? page?.title ?? "");
    setHeaderContent(nextHero?.subtitle ?? "");
  }, [page?._id, page, starterSections]);

  useEffect(() => {
    if (state.message) {
      push({ message: state.message, variant: state.ok ? "success" : "error" });
    }
  }, [state.message, state.ok, push]);

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    if (page?._id) form.set("id", page._id);
    form.set("title", title);
    form.set("slug", slug);
    form.set("status", status);
    form.set("template", template);
    form.set("showInHeader", showInHeader ? "on" : "");
    form.set("headerLabel", headerLabel);
    form.set("headerOrder", headerOrder);
    form.set("seoTitle", seoTitle);
    form.set("seoDescription", seoDescription);
    form.set(
      "sectionsJson",
      JSON.stringify(
        syncHeroSection(sections, {
          title: headerTitle,
          subtitle: headerContent,
        }),
      ),
    );
    startTransition(() => formAction(form));
  };

  const publicHref = `/${slug === "home" ? "" : slug}`;

  return (
    <form onSubmit={onSubmit} className="grid gap-6 pb-32">
      <Panel title="Page settings" description="The basics — title, slug, status, and SEO.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Page title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <TextInput label="Slug" value={slug} onChange={(e) => setSlug(e.target.value)} required />
          <Select
            label="Status"
            value={status}
            onChange={(e) => setStatus(e.target.value as PageRecord["status"])}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Active", value: "published" },
            ]}
          />
          <Select
            label="Template"
            value={template}
            onChange={(e) => setTemplate(e.target.value as PageRecord["template"])}
            options={[
              { label: "Standard", value: "standard" },
              { label: "Landing", value: "landing" },
              { label: "Service", value: "service" },
              { label: "Contact", value: "contact" },
            ]}
          />
          <TextInput label="SEO title" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} required />
          <TextInput
            label="SEO description"
            value={seoDescription}
            onChange={(e) => setSeoDescription(e.target.value)}
            required
          />
        </div>
      </Panel>

      <Panel
        title="Page header"
        description="This controls the default hero/header copy for the page. You can still add more sections below."
      >
        <div className="grid gap-4">
          <TextInput
            label="Header title"
            value={headerTitle}
            onChange={(event) => {
              const next = event.target.value;
              setHeaderTitle(next);
              setSections((current) => syncHeroSection(current, { title: next }));
            }}
            required
          />
          <Textarea
            label="Header content"
            rows={4}
            value={headerContent}
            onChange={(event) => {
              const next = event.target.value;
              setHeaderContent(next);
              setSections((current) => syncHeroSection(current, { subtitle: next }));
            }}
            required
          />
        </div>
      </Panel>

      <Panel
        title="Header menu"
        description="Published pages can optionally appear in the main site header without manually editing menu JSON."
      >
        <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <Toggle
            label="Show this page in the main header"
            hint="Only active pages appear publicly."
            checked={showInHeader}
            onChange={(event) => setShowInHeader(event.target.checked)}
          />
          <TextInput
            label="Menu label"
            value={headerLabel}
            onChange={(event) => setHeaderLabel(event.target.value)}
            optional
            hint="Leave blank to use the page title."
          />
          <TextInput
            label="Menu order"
            type="number"
            value={headerOrder}
            onChange={(event) => setHeaderOrder(event.target.value)}
            hint="Lower numbers appear first."
          />
        </div>
      </Panel>

      <Panel
        title="Sections"
        description="Reorder by dragging. Click a row to edit fields. Every section type is supported."
        actions={
          <Link
            href={publicHref}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-stone-300 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-stone-700 hover:bg-stone-100"
          >
            Open public page ↗
          </Link>
        }
      >
        <SectionsManager value={sections} onChange={setSections} categories={categories} />
      </Panel>

      <details className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-5 text-sm text-stone-600">
        <summary className="cursor-pointer text-[12px] font-semibold uppercase tracking-[0.18em] text-stone-500">
          Advanced · raw sections JSON
        </summary>
        <Textarea
          rows={14}
          label="Sections JSON"
          value={JSON.stringify(sections, null, 2)}
          onChange={(e) => {
            try {
              const parsed = JSON.parse(e.target.value);
              if (Array.isArray(parsed)) setSections(parsed);
            } catch {
              // ignore invalid intermediate JSON
            }
          }}
          className="mt-4"
        />
      </details>

      {/* Sticky save bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1480px] flex-wrap items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-14">
          <div className="text-xs text-stone-500">
            {pending ? "Saving…" : "Unsaved changes are kept in this tab only until you save."}
          </div>
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={pending}
              className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--ink-soft)] disabled:opacity-60"
            >
              {pending ? "Saving…" : "Save"}
            </button>
            <Link
              href={publicHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Preview public page"
              className="rounded-full bg-[var(--gold)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--ink)] hover:bg-[var(--gold-light)]"
            >
              Preview ↗
            </Link>
          </div>
        </div>
      </div>
    </form>
  );
}
