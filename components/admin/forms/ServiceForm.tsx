"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormField, Input, Select, Textarea, Checkbox } from "@/components/admin/FormField";
import { PublishActions } from "@/components/admin/PublishActions";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { Tabs } from "@/components/admin/Tabs";
import { slugify } from "@/lib/admin/utils";

interface ServiceFormProps {
  serviceId?: string;
  initial?: Record<string, unknown>;
}

export function ServiceForm({ serviceId, initial }: ServiceFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const detailPage = (initial?.detailPage as Record<string, unknown>) ?? {};

  const [form, setForm] = useState({
    title: (initial?.title as string) ?? "",
    slug: (initial?.slug as string) ?? "",
    shortDescription: (initial?.shortDescription as string) ?? "",
    description: (initial?.description as string) ?? "",
    icon: (initial?.icon as string) ?? "",
    isFeatured: (initial?.isFeatured as boolean) ?? false,
    sortOrder: (initial?.sortOrder as number) ?? 0,
    status: (initial?.status as string) ?? "draft",
    detailContent: (detailPage.content as string) ?? "",
    seoTitle: ((detailPage.seo as Record<string, string>)?.title) ?? "",
    seoDescription: ((detailPage.seo as Record<string, string>)?.description) ?? "",
  });

  function update(field: string, value: string | number | boolean) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "title" && !serviceId && typeof value === "string") {
        next.slug = slugify(value);
      }
      return next;
    });
  }

  async function save(status?: string) {
    setSaving(true);
    const overview = {
      title: form.title,
      slug: form.slug,
      shortDescription: form.shortDescription || undefined,
      description: form.description || undefined,
      icon: form.icon || undefined,
      isFeatured: form.isFeatured,
      sortOrder: form.sortOrder,
      status: status ?? form.status,
    };

    const url = serviceId ? `/api/admin/services/${serviceId}` : "/api/admin/services";
    const method = serviceId ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(
        serviceId
          ? {
              ...overview,
              detailPage: {
                content: form.detailContent,
                seo: {
                  title: form.seoTitle || undefined,
                  description: form.seoDescription || undefined,
                },
              },
            }
          : overview,
      ),
    });
    const data = await res.json();
    setSaving(false);

    if (!res.ok) throw new Error(data.error ?? "Save failed");

    if (!serviceId) {
      router.push(`/admin/services/${data._id}`);
    } else {
      router.refresh();
    }
  }

  return (
    <div>
      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "detail", label: "Detail Page" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      >
        {activeTab === "overview" ? (
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="Title" name="title" required>
                <Input value={form.title} onChange={(e) => update("title", e.target.value)} />
              </FormField>
              <FormField label="Slug" name="slug" required>
                <Input value={form.slug} onChange={(e) => update("slug", e.target.value)} />
              </FormField>
              <FormField label="Icon" name="icon" hint="Lucide icon name">
                <Input value={form.icon} onChange={(e) => update("icon", e.target.value)} />
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
            <FormField label="Short Description" name="shortDescription">
              <Textarea
                value={form.shortDescription}
                onChange={(e) => update("shortDescription", e.target.value)}
                rows={2}
              />
            </FormField>
            <FormField label="Description" name="description">
              <Textarea
                value={form.description}
                onChange={(e) => update("description", e.target.value)}
                rows={4}
              />
            </FormField>
            <Checkbox
              label="Featured service"
              checked={form.isFeatured}
              onChange={(e) => update("isFeatured", e.target.checked)}
            />
          </div>
        ) : (
          <div className="space-y-4">
            <FormField label="Detail Page Content" name="detailContent">
              <RichTextEditor
                value={form.detailContent}
                onChange={(html) => update("detailContent", html)}
              />
            </FormField>
            <div className="grid gap-4 md:grid-cols-2">
              <FormField label="SEO Title" name="seoTitle">
                <Input value={form.seoTitle} onChange={(e) => update("seoTitle", e.target.value)} />
              </FormField>
              <FormField label="SEO Description" name="seoDescription">
                <Textarea
                  value={form.seoDescription}
                  onChange={(e) => update("seoDescription", e.target.value)}
                  rows={2}
                />
              </FormField>
            </div>
          </div>
        )}
      </Tabs>

      <div className="mt-6 border-t border-slate-200 pt-6">
        <PublishActions
          status={form.status}
          saving={saving}
          onSave={() => save()}
          onPublish={() => save("published")}
        />
      </div>
    </div>
  );
}
