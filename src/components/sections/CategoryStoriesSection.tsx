import Image from "next/image";
import { SectionShell } from "@/components/ui/SectionShell";
import { sortStoriesByOrder, sortSubitemsByOrder } from "@/lib/category-order";
import type { CategoryRecord } from "@/types/cms";

type Props = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  categories: CategoryRecord[];
  storyLimit: number;
  subitemLimit: number;
  showSubitems: boolean;
};

export function CategoryStoriesSection({
  eyebrow,
  title,
  subtitle,
  categories,
  storyLimit,
  subitemLimit,
  showSubitems,
}: Props) {
  return (
    <SectionShell eyebrow={eyebrow} title={title} subtitle={subtitle}>
      <div className="grid gap-6">
        {categories.map((category) => {
          const stories = sortStoriesByOrder(category.stories).slice(0, Math.max(storyLimit, 1));
          return (
            <section
              key={category._id}
              className="rounded-[2rem] border border-[var(--hairline)] bg-[var(--cream)] p-6 shadow-[0_18px_50px_-34px_rgba(0,0,0,0.6)]"
            >
              <div className="border-b border-[var(--hairline-strong)] pb-4">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--gold-deep)]">
                  Category
                </p>
                <h3 className="mt-2 font-display text-3xl tracking-[-0.03em] text-[var(--ink)]">
                  {category.title}
                </h3>
                {category.description ? (
                  <p className="mt-2 max-w-3xl text-sm leading-7 text-[var(--ink-mute)]">
                    {category.description}
                  </p>
                ) : null}
              </div>

              <div className="mt-6 grid gap-5 xl:grid-cols-2">
                {stories.map((story) => {
                  const subitems = sortSubitemsByOrder(story.subitems)
                    .filter((subitem) => subitem.status === "published")
                    .slice(0, Math.max(subitemLimit, 1));

                  return (
                    <article
                      key={story.id}
                      className="overflow-hidden rounded-[1.5rem] border border-[var(--hairline-strong)] bg-[var(--background)]"
                    >
                      {story.media ? (
                        <div className="relative aspect-[16/9] bg-[var(--cream-deep)]">
                          <Image
                            src={story.media}
                            alt={story.title}
                            fill
                            sizes="(min-width: 1280px) 33vw, 100vw"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : null}
                      <div className="grid gap-3 p-5">
                        <div className="flex items-center justify-between gap-3">
                          <h4 className="text-lg font-semibold text-[var(--ink)]">{story.title}</h4>
                          <span className="rounded-full bg-[var(--cream)] px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                            Story
                          </span>
                        </div>
                        {story.summary ? (
                          <p className="text-sm leading-7 text-[var(--ink-mute)]">{story.summary}</p>
                        ) : null}
                        {story.body ? (
                          <p className="text-sm leading-7 text-[var(--ink-soft)] line-clamp-4">{story.body}</p>
                        ) : null}

                        {showSubitems && subitems.length > 0 ? (
                          <div className="mt-2 rounded-[1.25rem] border border-[var(--hairline-strong)] bg-[var(--cream)] p-4">
                            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--ink-mute)]">
                              Published subitems
                            </p>
                            <ul className="mt-3 grid gap-3">
                              {subitems.map((subitem) => (
                                <li key={subitem.id} className="rounded-xl border border-[var(--hairline)] bg-[var(--background)] p-3">
                                  <p className="font-semibold text-[var(--ink)]">{subitem.title}</p>
                                  {subitem.content ? (
                                    <p className="mt-1 text-sm leading-6 text-[var(--ink-soft)]">{subitem.content}</p>
                                  ) : null}
                                </li>
                              ))}
                            </ul>
                          </div>
                        ) : null}
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </SectionShell>
  );
}
