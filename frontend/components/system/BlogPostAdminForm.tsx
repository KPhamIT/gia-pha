"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import IconRoundButton from "@/components/ui/IconRoundButton";
import { FormField, inputClassName } from "@/components/ui/CollapsibleSection";
import {
  BLOG_CATEGORIES,
  BLOG_CATEGORY_LABELS,
} from "@/lib/constants/ui-strings/blog";
import type {
  BlogCategory,
  BlogPostAdmin,
  BlogPostInput,
} from "@/lib/blog/types";
import { UI } from "@/lib/constants/ui-strings";
import { BT } from "@/lib/constants/ui-theme";
import BlogContentEditor from "./BlogContentEditor";

type BlogPostAdminFormProps = {
  initial?: BlogPostAdmin;
  saving?: boolean;
  onCancel: () => void;
  onSubmit: (data: BlogPostInput) => Promise<void>;
};

function toDateInputValue(iso?: string): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toISOString().slice(0, 10);
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function formatTags(tags: string[]): string {
  return tags.join(", ");
}

export default function BlogPostAdminForm({
  initial,
  saving = false,
  onCancel,
  onSubmit,
}: BlogPostAdminFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [category, setCategory] = useState<BlogCategory>(
    initial?.category ?? "BASICS",
  );
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [metaDescription, setMetaDescription] = useState(
    initial?.metaDescription ?? "",
  );
  const [content, setContent] = useState(initial?.content ?? "");
  const [tags, setTags] = useState(formatTags(initial?.tags ?? []));
  const [published, setPublished] = useState(initial?.published ?? true);
  const [publishedAt, setPublishedAt] = useState(
    toDateInputValue(initial?.publishedAt),
  );

  useEffect(() => {
    if (!initial) return;
    setTitle(initial.title);
    setSlug(initial.slug);
    setCategory(initial.category);
    setExcerpt(initial.excerpt);
    setMetaDescription(initial.metaDescription);
    setContent(initial.content);
    setTags(formatTags(initial.tags));
    setPublished(initial.published);
    setPublishedAt(toDateInputValue(initial.publishedAt));
  }, [initial]);

  const handleSubmit = async () => {
    const trimmedTitle = title.trim();
    const trimmedSlug = slug.trim();
    if (!trimmedTitle || !trimmedSlug) return;

    await onSubmit({
      title: trimmedTitle,
      slug: trimmedSlug,
      excerpt,
      content,
      metaDescription: metaDescription.trim(),
      category,
      tags: parseTags(tags),
      published,
      ...(publishedAt ? { publishedAt: new Date(publishedAt).toISOString() } : {}),
    });
  };

  const textareaClass = `${inputClassName} min-h-24 resize-y`;

  return (
    <div className="space-y-3">
      <FormField label={UI.BLOG_ADMIN_TITLE}>
        <input
          className={inputClassName}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </FormField>

      <FormField label={UI.BLOG_ADMIN_SLUG}>
        <input
          className={inputClassName}
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          spellCheck={false}
        />
      </FormField>

      <FormField label={UI.BLOG_ADMIN_CATEGORY}>
        <select
          className={inputClassName}
          value={category}
          onChange={(e) => setCategory(e.target.value as BlogCategory)}
        >
          {BLOG_CATEGORIES.map((key) => (
            <option key={key} value={key}>
              {BLOG_CATEGORY_LABELS[key]}
            </option>
          ))}
        </select>
      </FormField>

      <FormField label={UI.BLOG_ADMIN_EXCERPT}>
        <textarea
          className={textareaClass}
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
        />
      </FormField>

      <FormField label={UI.BLOG_ADMIN_META}>
        <input
          className={inputClassName}
          maxLength={320}
          value={metaDescription}
          onChange={(e) => setMetaDescription(e.target.value)}
        />
      </FormField>

      <FormField label={UI.BLOG_ADMIN_CONTENT}>
        <BlogContentEditor
          value={content}
          onChange={setContent}
          imageAltBase={title}
        />
      </FormField>

      <FormField label={UI.BLOG_ADMIN_TAGS}>
        <input
          className={inputClassName}
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="gia phả, dòng họ"
        />
      </FormField>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField label={UI.BLOG_ADMIN_PUBLISHED_AT}>
          <input
            type="date"
            className={inputClassName}
            value={publishedAt}
            onChange={(e) => setPublishedAt(e.target.value)}
          />
        </FormField>

        <label className="flex items-center gap-2 pt-6 text-sm text-neutral-800">
          <input
            type="checkbox"
            checked={published}
            onChange={(e) => setPublished(e.target.checked)}
            className="size-4 rounded border-amber-300"
          />
          {UI.BLOG_ADMIN_PUBLISHED_LABEL}
        </label>
      </div>

      <div className="flex flex-wrap gap-2 pt-1">
        <IconRoundButton
          icon="save"
          variant="gold"
          label={UI.SAVE}
          loading={saving}
          onClick={() => void handleSubmit()}
        />
        <IconRoundButton
          icon="close"
          variant="ghost"
          label={UI.CANCEL}
          onClick={onCancel}
        />
        {initial?.published ? (
          <Link
            href={`/bai-viet/${initial.slug}`}
            target="_blank"
            className={`text-sm font-medium underline-offset-2 hover:underline ${BT.mutedOnDark}`}
          >
            {UI.BLOG_ADMIN_VIEW_PUBLIC} →
          </Link>
        ) : null}
      </div>
    </div>
  );
}
