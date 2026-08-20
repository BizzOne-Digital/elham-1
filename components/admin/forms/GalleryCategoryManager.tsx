"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, Input } from "@/components/admin/FormField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { slugify } from "@/lib/admin/utils";

interface Category {
  _id: string;
  name: string;
  slug: string;
  status: string;
}

export function GalleryCategoryManager({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: "", slug: "", description: "", status: "published", sortOrder: 0 });

  async function save() {
    const res = await fetch("/api/admin/gallery/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Save failed");
      return;
    }
    toast.success("Category created");
    setCreating(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/gallery/categories/${deleteId}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Delete failed");
      return;
    }
    toast.success("Deleted");
    setDeleteId(null);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button type="button" onClick={() => setCreating(true)} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Add Category</button>
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <div key={cat._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <Link href={`/admin/gallery/${cat._id}`} className="block hover:text-blue-600">
              <p className="font-medium">{cat.name}</p>
              <p className="text-sm text-slate-500">/{cat.slug}</p>
            </Link>
            <button type="button" onClick={() => setDeleteId(cat._id)} className="mt-2 text-xs text-red-600">Delete</button>
          </div>
        ))}
      </div>

      {creating && (
        <div className="rounded-xl border bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" name="name"><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value, slug: slugify(e.target.value) }))} /></FormField>
            <FormField label="Slug" name="slug"><Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} /></FormField>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Save</button>
            <button type="button" onClick={() => setCreating(false)} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete category?" variant="danger" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
