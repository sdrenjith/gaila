"use client";

import { useActionState, useEffect, useMemo, useState, useTransition } from "react";
import { saveCategoryAction, type AdminActionState } from "@/app/actions/admin";
import { AdminListSearch } from "@/components/admin/AdminListSearch";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { ImageSourceInput } from "@/components/admin/ImageSourceInput";
import { useToast } from "@/components/admin/Toaster";
import { useConfirmDelete } from "@/components/admin/useConfirmDelete";
import { useDebouncedValue } from "@/components/admin/useDebouncedValue";
import { Panel, Select, Textarea, TextInput } from "@/components/admin/forms/Field";
import { categoryStoryMatchesSearch } from "@/lib/admin-search";
import { normalizeStoryOrder, sortStoriesByOrder, withSequentialStoryOrder, withSequentialSubitemOrder } from "@/lib/category-order";
import type { CategoryRecord, CategoryStoryRecord, StorySubitemRecord } from "@/types/cms";

type Props = {
  category?: CategoryRecord;
};

const initialState: AdminActionState = { ok: false, message: "" };

function randomId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function cloneStories(stories: CategoryStoryRecord[]) {
  return sortStoriesByOrder(normalizeStoryOrder(structuredClone(stories)));
}

export function CategoryEditor({ category }: Props) {
  const { push } = useToast();
  const [state, formAction, pending] = useActionState(saveCategoryAction, initialState);
  const [, startTransition] = useTransition();
  const [title, setTitle] = useState(category?.title ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "new-category");
  const [description, setDescription] = useState(category?.description ?? "");
  const [status, setStatus] = useState<CategoryRecord["status"]>(category?.status ?? "draft");
  const [stories, setStories] = useState<CategoryStoryRecord[]>(cloneStories(category?.stories ?? []));
  const [openStoryId, setOpenStoryId] = useState<string | null>(
    () => sortStoriesByOrder(normalizeStoryOrder(category?.stories ?? []))[0]?.id ?? null,
  );
  const [dragStoryId, setDragStoryId] = useState<string | null>(null);
  const [dragSubitem, setDragSubitem] = useState<{ storyId: string; subitemId: string } | null>(null);
  const [storySearchTerm, setStorySearchTerm] = useState("");
  const debouncedStorySearch = useDebouncedValue(storySearchTerm);
  const { pending: pendingDelete, requestDelete, cancelDelete, confirmDelete } = useConfirmDelete();

  useEffect(() => {
    if (state.message) {
      push({ message: state.message, variant: state.ok ? "success" : "error" });
    }
  }, [push, state.message, state.ok]);

  useEffect(() => {
    const nextStories = cloneStories(category?.stories ?? []);
    setTitle(category?.title ?? "");
    setSlug(category?.slug ?? "new-category");
    setDescription(category?.description ?? "");
    setStatus(category?.status ?? "draft");
    setStories(nextStories);
    setOpenStoryId(nextStories[0]?.id ?? null);
    setStorySearchTerm("");
  }, [category?._id, category]);

  const filteredStories = useMemo(() => {
    const needle = debouncedStorySearch.trim().toLowerCase();
    if (!needle) return stories;
    return stories.filter((story) => categoryStoryMatchesSearch(story, needle));
  }, [stories, debouncedStorySearch]);

  const addStory = () => {
    const nextStory: CategoryStoryRecord = {
      id: randomId("story"),
      title: "New story",
      slug: randomId("story"),
      summary: "",
      body: "",
      status: "draft",
      media: "",
      order: stories.length,
      subitems: [],
    };
    setStories((current) => withSequentialStoryOrder([...current, nextStory]));
    setOpenStoryId(nextStory.id);
  };

  const updateStory = (storyId: string, updater: (story: CategoryStoryRecord) => CategoryStoryRecord) => {
    setStories((current) => current.map((story) => (story.id === storyId ? updater(story) : story)));
  };

  const removeStory = (storyId: string) => {
    const story = stories.find((entry) => entry.id === storyId);
    requestDelete({
      title: "Delete story?",
      description: `This will remove “${story?.title || "this story"}” from the category. Save the category to persist the change.`,
      onConfirm: () => {
        setStories((current) => withSequentialStoryOrder(current.filter((entry) => entry.id !== storyId)));
        setOpenStoryId((current) => (current === storyId ? null : current));
      },
    });
  };

  const addSubitem = (storyId: string) => {
    updateStory(storyId, (story) => ({
      ...story,
      subitems: withSequentialSubitemOrder([
        ...story.subitems,
        {
          id: randomId("subitem"),
          title: "New subitem",
          content: "",
          status: "draft",
          media: "",
          order: story.subitems.length,
        },
      ]),
    }));
  };

  const moveStory = (storyId: string, direction: -1 | 1) => {
    setStories((current) => {
      const index = current.findIndex((entry) => entry.id === storyId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return withSequentialStoryOrder(next);
    });
  };

  const handleStoryDrop = (targetStoryId: string) => {
    if (!dragStoryId || dragStoryId === targetStoryId) return;
    setStories((current) => {
      const from = current.findIndex((entry) => entry.id === dragStoryId);
      const to = current.findIndex((entry) => entry.id === targetStoryId);
      if (from === -1 || to === -1) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return withSequentialStoryOrder(next);
    });
    setDragStoryId(null);
  };

  const moveSubitem = (storyId: string, subitemId: string, direction: -1 | 1) => {
    updateStory(storyId, (story) => {
      const index = story.subitems.findIndex((entry) => entry.id === subitemId);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= story.subitems.length) return story;
      const nextSubitems = [...story.subitems];
      const [moved] = nextSubitems.splice(index, 1);
      nextSubitems.splice(target, 0, moved);
      return {
        ...story,
        subitems: withSequentialSubitemOrder(nextSubitems),
      };
    });
  };

  const handleSubitemDrop = (storyId: string, targetSubitemId: string) => {
    if (!dragSubitem || dragSubitem.storyId !== storyId || dragSubitem.subitemId === targetSubitemId) return;
    updateStory(storyId, (story) => {
      const from = story.subitems.findIndex((entry) => entry.id === dragSubitem.subitemId);
      const to = story.subitems.findIndex((entry) => entry.id === targetSubitemId);
      if (from === -1 || to === -1) return story;
      const nextSubitems = [...story.subitems];
      const [moved] = nextSubitems.splice(from, 1);
      nextSubitems.splice(to, 0, moved);
      return {
        ...story,
        subitems: withSequentialSubitemOrder(nextSubitems),
      };
    });
    setDragSubitem(null);
  };

  const updateSubitem = (
    storyId: string,
    subitemId: string,
    updater: (subitem: StorySubitemRecord) => StorySubitemRecord,
  ) => {
    updateStory(storyId, (story) => ({
      ...story,
      subitems: story.subitems.map((subitem) => (subitem.id === subitemId ? updater(subitem) : subitem)),
    }));
  };

  const removeSubitem = (storyId: string, subitemId: string) => {
    const story = stories.find((entry) => entry.id === storyId);
    const subitem = story?.subitems.find((entry) => entry.id === subitemId);
    requestDelete({
      title: "Delete subitem?",
      description: `This will remove “${subitem?.title || "this subitem"}” from the story. Save the category to persist the change.`,
      onConfirm: () => {
        updateStory(storyId, (currentStory) => ({
          ...currentStory,
          subitems: withSequentialSubitemOrder(currentStory.subitems.filter((entry) => entry.id !== subitemId)),
        }));
      },
    });
  };

  const onSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData();
    if (category?._id) form.set("id", category._id);
    form.set("title", title);
    form.set("slug", slug);
    form.set("description", description);
    form.set("status", status);
    form.set("storiesJson", JSON.stringify(withSequentialStoryOrder(stories)));
    startTransition(() => formAction(form));
  };

  return (
    <form onSubmit={onSubmit} className="grid gap-6 pb-28">
      <Panel title="Category settings" description="Categories group related stories and their nested subitems.">
        <div className="grid gap-4 md:grid-cols-2">
          <TextInput label="Category title" value={title} onChange={(event) => setTitle(event.target.value)} required />
          <TextInput label="Slug" value={slug} onChange={(event) => setSlug(event.target.value)} required />
          <Select
            label="Status"
            value={status}
            onChange={(event) => setStatus(event.target.value as CategoryRecord["status"])}
            options={[
              { label: "Draft", value: "draft" },
              { label: "Active", value: "published" },
            ]}
          />
          <Textarea
            label="Description"
            rows={4}
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            className="md:col-span-2"
            required
          />
        </div>
      </Panel>

      <Panel
        title="Stories"
        description="Create nested stories and published subitems inside this category. Drag to reorder stories and subitems."
        actions={
          <button
            type="button"
            onClick={addStory}
            className="rounded-full bg-[var(--ink)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-soft)]"
          >
            + Add story
          </button>
        }
      >
        <div className="grid gap-4">
          {stories.length > 0 ? (
            <AdminListSearch
              value={storySearchTerm}
              onChange={setStorySearchTerm}
              placeholder="Search by title, slug, or status…"
              visibleCount={filteredStories.length}
              totalCount={stories.length}
              itemLabel="stories"
            />
          ) : null}

          {stories.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
              No stories yet. Add your first story to start building this category.
            </p>
          ) : filteredStories.length === 0 ? (
            <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
              No stories match your search.
            </p>
          ) : (
            filteredStories.map((story) => {
              const index = stories.findIndex((entry) => entry.id === story.id);
              const open = openStoryId === story.id;
              return (
                <section
                  key={story.id}
                  draggable
                  onDragStart={() => setDragStoryId(story.id)}
                  onDragOver={(event) => {
                    if (dragStoryId && dragStoryId !== story.id) event.preventDefault();
                  }}
                  onDrop={() => handleStoryDrop(story.id)}
                  onDragEnd={() => setDragStoryId(null)}
                  className={`rounded-2xl border bg-stone-50 transition ${
                    dragStoryId === story.id ? "border-[var(--gold)] opacity-60" : "border-stone-200"
                  }`}
                >
                  <div className="flex flex-wrap items-center gap-3 px-4 py-3">
                    <span
                      aria-hidden="true"
                      title="Drag to reorder"
                      className="cursor-grab select-none text-lg text-stone-300 active:cursor-grabbing"
                    >
                      ⋮⋮
                    </span>
                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => setOpenStoryId(open ? null : story.id)}
                        className="block w-full text-left"
                      >
                        <p className="truncate text-sm font-semibold text-stone-950">
                          {String(index + 1).padStart(2, "0")} · {story.title || "Untitled story"}
                        </p>
                        <p className="truncate text-[11px] text-stone-500">
                          {story.status === "published" ? "active" : "draft"} · {story.subitems.length} subitems
                        </p>
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => moveStory(story.id, -1)}
                      disabled={index === 0}
                      className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Move story up"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => moveStory(story.id, 1)}
                      disabled={index === stories.length - 1}
                      className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label="Move story down"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => removeStory(story.id)}
                      className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600 hover:bg-red-50"
                    >
                      Delete
                    </button>
                    <button
                      type="button"
                      onClick={() => setOpenStoryId(open ? null : story.id)}
                      className="rounded-full bg-stone-900 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-white hover:bg-stone-700"
                    >
                      {open ? "Close" : "Edit"}
                    </button>
                  </div>

                  {open ? (
                    <div className="border-t border-stone-200 bg-white p-5">
                      <div className="grid gap-4 md:grid-cols-2">
                        <TextInput
                          label="Story title"
                          value={story.title}
                          onChange={(event) =>
                            updateStory(story.id, (current) => ({ ...current, title: event.target.value }))
                          }
                          required
                        />
                        <TextInput
                          label="Story slug"
                          value={story.slug}
                          onChange={(event) =>
                            updateStory(story.id, (current) => ({ ...current, slug: event.target.value }))
                          }
                          required
                        />
                        <Select
                          label="Story status"
                          value={story.status}
                          onChange={(event) =>
                            updateStory(story.id, (current) => ({
                              ...current,
                              status: event.target.value as CategoryStoryRecord["status"],
                            }))
                          }
                          options={[
                            { label: "Draft", value: "draft" },
                            { label: "Published", value: "published" },
                          ]}
                        />
                        <ImageSourceInput
                          label="Story media"
                          name={`story-media-${story.id}`}
                          value={story.media || ""}
                          folder="categories"
                          onChange={(next) => updateStory(story.id, (current) => ({ ...current, media: next }))}
                        />
                      </div>
                      <div className="mt-4 grid gap-4">
                        <Textarea
                          label="Summary"
                          rows={3}
                          value={story.summary}
                          onChange={(event) =>
                            updateStory(story.id, (current) => ({ ...current, summary: event.target.value }))
                          }
                          required
                        />
                        <Textarea
                          label="Story body"
                          rows={6}
                          value={story.body}
                          onChange={(event) =>
                            updateStory(story.id, (current) => ({ ...current, body: event.target.value }))
                          }
                          required
                        />
                      </div>

                      <div className="mt-6 rounded-2xl border border-stone-200 bg-stone-50 p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-stone-950">Subitems</p>
                            <p className="text-xs text-stone-500">
                              Draft subitems stay hidden from public category sections.
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => addSubitem(story.id)}
                            className="rounded-full bg-[var(--ink)] px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-soft)]"
                          >
                            + Add subitem
                          </button>
                        </div>

                        <div className="mt-4 grid gap-4">
                          {story.subitems.length === 0 ? (
                            <p className="rounded-xl border border-dashed border-stone-300 bg-white p-4 text-sm text-stone-500">
                              No subitems yet.
                            </p>
                          ) : (
                            story.subitems.map((subitem, subitemIndex) => (
                              <div
                                key={subitem.id}
                                draggable
                                onDragStart={() => setDragSubitem({ storyId: story.id, subitemId: subitem.id })}
                                onDragOver={(event) => {
                                  if (
                                    dragSubitem?.storyId === story.id &&
                                    dragSubitem.subitemId !== subitem.id
                                  ) {
                                    event.preventDefault();
                                  }
                                }}
                                onDrop={() => handleSubitemDrop(story.id, subitem.id)}
                                onDragEnd={() => setDragSubitem(null)}
                                className={`rounded-xl border bg-white p-4 transition ${
                                  dragSubitem?.storyId === story.id && dragSubitem.subitemId === subitem.id
                                    ? "border-[var(--gold)] opacity-60"
                                    : "border-stone-200"
                                }`}
                              >
                                <div className="mb-4 flex flex-wrap items-center gap-2">
                                  <span
                                    aria-hidden="true"
                                    title="Drag to reorder"
                                    className="cursor-grab select-none text-lg text-stone-300 active:cursor-grabbing"
                                  >
                                    ⋮⋮
                                  </span>
                                  <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-stone-400">
                                    {String(subitemIndex + 1).padStart(2, "0")}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => moveSubitem(story.id, subitem.id, -1)}
                                    disabled={subitemIndex === 0}
                                    className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Move subitem up"
                                  >
                                    ↑
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => moveSubitem(story.id, subitem.id, 1)}
                                    disabled={subitemIndex === story.subitems.length - 1}
                                    className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                                    aria-label="Move subitem down"
                                  >
                                    ↓
                                  </button>
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                  <TextInput
                                    label="Subitem title"
                                    value={subitem.title}
                                    onChange={(event) =>
                                      updateSubitem(story.id, subitem.id, (current) => ({
                                        ...current,
                                        title: event.target.value,
                                      }))
                                    }
                                    required
                                  />
                                  <Select
                                    label="Subitem status"
                                    value={subitem.status}
                                    onChange={(event) =>
                                      updateSubitem(story.id, subitem.id, (current) => ({
                                        ...current,
                                        status: event.target.value as StorySubitemRecord["status"],
                                      }))
                                    }
                                    options={[
                                      { label: "Draft", value: "draft" },
                                      { label: "Published", value: "published" },
                                    ]}
                                  />
                                  <ImageSourceInput
                                    label="Subitem media"
                                    name={`subitem-media-${subitem.id}`}
                                    value={subitem.media || ""}
                                    folder="categories"
                                    onChange={(next) =>
                                      updateSubitem(story.id, subitem.id, (current) => ({ ...current, media: next }))
                                    }
                                  />
                                  <div className="flex items-end">
                                    <button
                                      type="button"
                                      onClick={() => removeSubitem(story.id, subitem.id)}
                                      className="rounded-full border border-red-200 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-red-600 hover:bg-red-50"
                                    >
                                      Remove subitem
                                    </button>
                                  </div>
                                </div>
                                <Textarea
                                  label="Subitem content"
                                  rows={4}
                                  value={subitem.content}
                                  onChange={(event) =>
                                    updateSubitem(story.id, subitem.id, (current) => ({
                                      ...current,
                                      content: event.target.value,
                                    }))
                                  }
                                  className="mt-4"
                                  required
                                />
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </div>
                  ) : null}
                </section>
              );
            })
          )}
        </div>
      </Panel>

      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-stone-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1480px] items-center justify-between gap-3 px-5 py-3 sm:px-8 lg:px-14">
          <p className="text-xs text-stone-500">
            {pending ? "Saving…" : "Changes stay local until you save this category."}
          </p>
          <button
            type="submit"
            disabled={pending}
            className="rounded-full bg-[var(--ink)] px-5 py-2.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-white transition hover:bg-[var(--ink-soft)] disabled:opacity-60"
          >
            {pending ? "Saving…" : "Save category"}
          </button>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title ?? "Delete item?"}
        description={pendingDelete?.description ?? "This action cannot be undone."}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </form>
  );
}
