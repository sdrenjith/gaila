import type { CategoryStoryRecord, StorySubitemRecord } from "@/types/cms";

function readOrder(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeSubitemOrder(subitems: StorySubitemRecord[]): StorySubitemRecord[] {
  return subitems.map((subitem, index) => ({
    ...subitem,
    order: readOrder(subitem.order, index),
  }));
}

export function normalizeStoryOrder(stories: CategoryStoryRecord[]): CategoryStoryRecord[] {
  return stories.map((story, index) => ({
    ...story,
    order: readOrder(story.order, index),
    subitems: normalizeSubitemOrder(story.subitems ?? []),
  }));
}

export function sortSubitemsByOrder(subitems: StorySubitemRecord[]): StorySubitemRecord[] {
  return [...subitems].sort((a, b) => readOrder(a.order, 0) - readOrder(b.order, 0));
}

export function sortStoriesByOrder(stories: CategoryStoryRecord[]): CategoryStoryRecord[] {
  return [...stories]
    .sort((a, b) => readOrder(a.order, 0) - readOrder(b.order, 0))
    .map((story) => ({
      ...story,
      subitems: sortSubitemsByOrder(story.subitems ?? []),
    }));
}

export function withSequentialSubitemOrder(subitems: StorySubitemRecord[]): StorySubitemRecord[] {
  return subitems.map((subitem, subitemIndex) => ({
    ...subitem,
    order: subitemIndex,
  }));
}

export function withSequentialStoryOrder(stories: CategoryStoryRecord[]): CategoryStoryRecord[] {
  return stories.map((story, storyIndex) => ({
    ...story,
    order: storyIndex,
    subitems: withSequentialSubitemOrder(story.subitems ?? []),
  }));
}
