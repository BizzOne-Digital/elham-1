"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Select, Textarea } from "@/components/admin/FormField";
import { PublishActions } from "@/components/admin/PublishActions";
import { slugify } from "@/lib/admin/utils";

interface PageFormProps {
  pageId?: string;
  initial?: {
    title: string;
    slug: string;
    subtitle?: string;
    status: string;
    sortOrder?: number;
    seo?: { title?: string; description?: string; noIndex?: boolean };
  };
}

export function PageForm({ pageId, initial }: PageFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    slug: initial?.slug ?? "",
    subtitle: initial?.subtitle ?? "",
    status: initial?.status ?? "draft",
    sortOrder: initial?.sortOrder ?? 0,
    seoTitle: initial?.seo?.title ?? "",
    seoDescription: initial?.seo?.description ?? "",
    noIndex: initial?.seo?.noIndex ?? false,
  });

  function update(field: string, value: string | number | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !pageId && typeof value === "string") {
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
      subtitle: form.subtitle || undefined,
      status: status ?? form.status,
      sortOrder: form.sortOrder,
      seo: {
        title: form.seoTitle || undefined,
        description: form.seoDescription || undefined,
        noIndex: form.noIndex,
      },
    };

    const url = pageId ? `/api/admin/pages/${pageId}` : "/api/admin/pages";
    const method = pageId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) throw new Error(data.error ?? "Save failed");

    if (!pageId) {
      router.push(`/admin/pages/${data._id}`);
    } else {
      router.refresh();
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" name="title" required>
          <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
        </FormField>
        <FormField label="Slug" name="slug" required hint="URL path segment">
          <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} />
        </FormField>
        <FormField label="Subtitle" name="subtitle">
          <Input value={form.subtitle} onChange={(e) => update("subtitle", e.target.value)} />
        </FormField>
        <FormField label="Status" name="status">
          <Select value={form.status} onChange={(e) => update("status", e.target.value)}>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </Select>
        </FormField>
        <FormField label="Sort Order" name="sortOrder">
          <Input
            type="number"
            value={form.sortOrder}
            onChange={(e) => update("sortOrder", Number(e.target.value))}
          />
        </FormField>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-6">
        <h3 className="mb-4 font-semibold text-slate-900">SEO</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <FormField label="Meta Title" name="seoTitle">
            <Input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
          </FormField>
          <FormField label="Meta Description" name="seoDescription">
            <Textarea
              value={form.seoDescription}
              onChange={(e) => update("seoDescription", e.target.value)}
              rows={2}
            />
          </FormField>
        </div>
      </div>

      <PublishActions
        status={form.status}
        saving={saving}
        onSave={() => save()}
        onPublish={() => save("published")}
      />
    </div>
  );
}
