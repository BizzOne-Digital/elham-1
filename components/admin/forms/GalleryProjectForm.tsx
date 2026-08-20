"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Select, Textarea } from "@/components/admin/FormField";
import { PublishActions } from "@/components/admin/PublishActions";
import { slugify } from "@/lib/admin/utils";

interface ProjectFormProps {
  projectId?: string;
  categoryId: string;
  initial?: Record<string, unknown>;
}

export function GalleryProjectForm({ projectId, categoryId, initial }: ProjectFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: (initial?.title as string) ?? "",
    slug: (initial?.slug as string) ?? "",
    description: (initial?.description as string) ?? "",
    excerpt: (initial?.excerpt as string) ?? "",
    clientName: (initial?.clientName as string) ?? "",
    location: (initial?.location as string) ?? "",
    status: (initial?.status as string) ?? "draft",
    sortOrder: (initial?.sortOrder as number) ?? 0,
  });

  function update(field: string, value: string | number) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !projectId && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function save(status?: string) {
    setSaving(true);
    const payload = { ...form, category: categoryId, status: status ?? form.status };
    const url = projectId ? `/api/admin/gallery/projects/${projectId}` : "/api/admin/gallery/projects";
    const res = await fetch(url, {
      method: projectId ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) throw new Error(data.error ?? "Save failed");
    if (!projectId) router.push(`/admin/gallery/projects/${data._id}`);
    else router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label="Title" name="title" required><Input value={form.title} onChange={(e) => update("title", e.target.value)} /></FormField>
        <FormField label="Slug" name="slug" required><Input value={form.slug} onChange={(e) => update("slug", e.target.value)} /></FormField>
        <FormField label="Client" name="clientName"><Input value={form.clientName} onChange={(e) => update("clientName", e.target.value)} /></FormField>
        <FormField label="Location" name="location"><Input value={form.location} onChange={(e) => update("location", e.target.value)} /></FormField>
        <FormField label="Status" name="status"><Select value={form.status} onChange={(e) => update("status", e.target.value)}><option value="draft">Draft</option><option value="published">Published</option></Select></FormField>
      </div>
      <FormField label="Excerpt" name="excerpt"><Textarea value={form.excerpt} onChange={(e) => update("excerpt", e.target.value)} rows={2} /></FormField>
      <FormField label="Description" name="description"><Textarea value={form.description} onChange={(e) => update("description", e.target.value)} rows={4} /></FormField>
      <PublishActions status={form.status} saving={saving} onSave={() => save()} onPublish={() => save("published")} />
    </div>
  );
}
