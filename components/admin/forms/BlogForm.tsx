"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Select, Textarea } from "@/components/admin/FormField";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { PublishActions } from "@/components/admin/PublishActions";
import { slugify } from "@/lib/admin/utils";

interface BlogFormProps {
  postId?: string;
  initial?: Record<string, unknown>;
}

export function BlogForm({ postId, initial }: BlogFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: (initial?.title as string) ?? "",
    slug: (initial?.slug as string) ?? "",
    excerpt: (initial?.excerpt as string) ?? "",
    content: (initial?.content as string) ?? "",
    tags: ((initial?.tags as string[]) ?? []).join(", "),
    status: (initial?.status as string) ?? "draft",
    isFeatured: (initial?.isFeatured as boolean) ?? false,
  });

  function update(field: string, value: string | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !postId && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function save(status?: string) {
    setSaving(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      excerpt: form.excerpt || undefined,
      content: form.content,
      tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
      status: status ?? form.status,
      isFeatured: form.isFeatured,
    };

    const url = postId ? `/api/admin/blog/${postId}` : "/api/admin/blog";
    const res = await fetch(url, {
      method: postId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) throw new Error(data.error ?? "Save failed");
    if (!postId) router.push(`/admin/blog/${data._id}`);
    else router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" name="title" required>
          <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
        </FormField>
        <FormField label="Slug" name="slug" required>
          <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} />
        </FormField>
        <FormField label="Tags" name="tags" hint="Comma separated">
          <Input value={form.tags} onChange={(e) => update("tags", e.target.value)} />
        </FormField>
        <FormField label="Status" name="status">
          <Select value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </FormField>
      </div>
      <FormField label="Excerpt" name="excerpt">
        <Textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} />
      </FormField>
      <FormField label="Content" name="content" required>
        <RichTextEditor value={form.content} onChange={(html) => update("content", html)} />
      </FormField>
      <PublishActions status={form.status} saving={saving} onSave={() => save()} onPublish={() => save("published")} />
    </div>
  );
}
