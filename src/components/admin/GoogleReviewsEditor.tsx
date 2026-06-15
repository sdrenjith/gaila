"use client";

import { useMemo, useState } from "react";
import { ConfirmDeleteDialog } from "@/components/admin/ConfirmDeleteDialog";
import { Select, Textarea, TextInput } from "@/components/admin/forms/Field";
import { useConfirmDelete } from "@/components/admin/useConfirmDelete";
import type { GoogleReviewRecord } from "@/types/cms";

type EditableGoogleReview = GoogleReviewRecord & { _id: string };

type Props = {
  initialReviews: GoogleReviewRecord[];
};

const RATING_OPTIONS = [1, 2, 3, 4, 5].map((value) => ({
  label: `${value} star${value === 1 ? "" : "s"}`,
  value: String(value),
}));

function randomId() {
  return `review-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function toEditableReviews(reviews: GoogleReviewRecord[]): EditableGoogleReview[] {
  return reviews.map((review) => ({
    ...structuredClone(review),
    _id: randomId(),
  }));
}

function toGoogleReviewRecords(reviews: EditableGoogleReview[]): GoogleReviewRecord[] {
  return reviews.map(({ _id: _unused, ...review }) => review);
}

export function GoogleReviewsEditor({ initialReviews }: Props) {
  const [reviews, setReviews] = useState<EditableGoogleReview[]>(() =>
    toEditableReviews(Array.isArray(initialReviews) ? initialReviews : []),
  );
  const [dragId, setDragId] = useState<string | null>(null);
  const { pending: pendingDelete, requestDelete, cancelDelete, confirmDelete } = useConfirmDelete();

  const googleReviewsJson = useMemo(() => JSON.stringify(toGoogleReviewRecords(reviews)), [reviews]);

  const updateReview = (id: string, updater: (review: EditableGoogleReview) => EditableGoogleReview) => {
    setReviews((current) => current.map((review) => (review._id === id ? updater(review) : review)));
  };

  const addReview = () => {
    setReviews((current) => [
      ...current,
      {
        _id: randomId(),
        author: "New reviewer",
        rating: 5,
        review: "",
        location: "",
        postedAt: "Recently",
      },
    ]);
  };

  const removeReview = (id: string) => {
    const review = reviews.find((entry) => entry._id === id);
    requestDelete({
      title: "Delete review?",
      description: `This will remove the review from “${review?.author || "this reviewer"}”. Save settings to persist the change.`,
      onConfirm: () => {
        setReviews((current) => current.filter((entry) => entry._id !== id));
      },
    });
  };

  const moveReview = (id: string, direction: -1 | 1) => {
    setReviews((current) => {
      const index = current.findIndex((entry) => entry._id === id);
      const target = index + direction;
      if (index < 0 || target < 0 || target >= current.length) return current;
      const next = [...current];
      const [moved] = next.splice(index, 1);
      next.splice(target, 0, moved);
      return next;
    });
  };

  const handleDrop = (targetId: string) => {
    if (!dragId || dragId === targetId) return;
    setReviews((current) => {
      const from = current.findIndex((entry) => entry._id === dragId);
      const to = current.findIndex((entry) => entry._id === targetId);
      if (from === -1 || to === -1) return current;
      const next = [...current];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return next;
    });
    setDragId(null);
  };

  return (
    <div className="grid gap-3">
      <input type="hidden" name="googleReviewsJson" value={googleReviewsJson} />

      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500">Google reviews</p>
          <p className="mt-1 text-[12px] text-stone-500">
            Reviews shown in the Google reviews slider on the site. Drag to reorder or use the arrow buttons.
          </p>
        </div>
        <button
          type="button"
          onClick={addReview}
          className="rounded-full bg-[var(--ink)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-white hover:bg-[var(--ink-soft)]"
        >
          + Add review
        </button>
      </div>

      {reviews.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-500">
          No reviews yet. Add your first Google review to show in the site slider.
        </p>
      ) : (
        <ul className="grid gap-3">
          {reviews.map((review, index) => (
            <li
              key={review._id}
              draggable
              onDragStart={() => setDragId(review._id)}
              onDragOver={(event) => {
                if (dragId && dragId !== review._id) event.preventDefault();
              }}
              onDrop={() => handleDrop(review._id)}
              onDragEnd={() => setDragId(null)}
              className={`rounded-2xl border bg-stone-50 transition ${
                dragId === review._id ? "border-[var(--gold)] opacity-60" : "border-stone-200"
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
                  <p className="truncate text-sm font-semibold text-stone-950">
                    {String(index + 1).padStart(2, "0")} · {review.author || "Untitled review"}
                  </p>
                  <p className="truncate text-[11px] text-stone-500">
                    {review.rating} star{review.rating === 1 ? "" : "s"}
                    {review.location ? ` · ${review.location}` : ""}
                    {review.postedAt ? ` · ${review.postedAt}` : ""}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => moveReview(review._id, -1)}
                  disabled={index === 0}
                  className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move review up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => moveReview(review._id, 1)}
                  disabled={index === reviews.length - 1}
                  className="grid h-8 w-8 place-items-center rounded-full text-stone-500 hover:bg-stone-100 disabled:cursor-not-allowed disabled:opacity-40"
                  aria-label="Move review down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => removeReview(review._id)}
                  className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-red-600 hover:bg-red-50"
                >
                  Delete
                </button>
              </div>

              <div className="border-t border-stone-200 bg-white p-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <TextInput
                    label="Author"
                    value={review.author}
                    onChange={(event) =>
                      updateReview(review._id, (current) => ({ ...current, author: event.target.value }))
                    }
                    required
                  />
                  <Select
                    label="Rating"
                    value={String(review.rating)}
                    onChange={(event) =>
                      updateReview(review._id, (current) => ({
                        ...current,
                        rating: Number(event.target.value),
                      }))
                    }
                    options={RATING_OPTIONS}
                    required
                  />
                  <TextInput
                    label="Location"
                    value={review.location}
                    onChange={(event) =>
                      updateReview(review._id, (current) => ({ ...current, location: event.target.value }))
                    }
                    required
                  />
                  <TextInput
                    label="Posted"
                    value={review.postedAt}
                    onChange={(event) =>
                      updateReview(review._id, (current) => ({ ...current, postedAt: event.target.value }))
                    }
                    hint='Display text such as "3 weeks ago".'
                    required
                  />
                </div>
                <Textarea
                  label="Review"
                  rows={4}
                  value={review.review}
                  onChange={(event) =>
                    updateReview(review._id, (current) => ({ ...current, review: event.target.value }))
                  }
                  className="mt-4"
                  required
                />
              </div>
            </li>
          ))}
        </ul>
      )}

      <ConfirmDeleteDialog
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title ?? "Delete review?"}
        description={pendingDelete?.description ?? "This action cannot be undone."}
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
}
