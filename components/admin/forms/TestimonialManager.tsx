"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, Input, Select, Textarea, Checkbox } from "@/components/admin/FormField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";

interface TestimonialItem {
  _id: string;
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  status: string;
  isFeatured: boolean;
}

export function TestimonialManager({ items: initial }: { items: TestimonialItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<TestimonialItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    role: "",
    company: "",
    content: "",
    rating: 5,
    status: "published",
    isFeatured: false,
    sortOrder: 0,
  });

  async function save() {
    const url = editing ? `/api/admin/testimonials/${editing._id}` : "/api/admin/testimonials";
    const res = await fetch(url, {
      method: editing ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Save failed");
      return;
    }
    toast.success("Testimonial saved");
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    await fetch(`/api/admin/testimonials/${deleteId}`, { method: "DELETE" });
    toast.success("Deleted");
    setDeleteId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button type="button" onClick={() => { setCreating(true); setEditing(null); setForm({ name: "", role: "", company: "", content: "", rating: 5, status: "published", isFeatured: false, sortOrder: 0 }); }} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white">Add Testimonial</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {initial.map((item) => (
          <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-5">
            <p className="text-sm text-slate-600">&ldquo;{item.content}&rdquo;</p>
            <p className="mt-3 font-medium">{item.name}</p>
            <p className="text-xs text-slate-500">{item.role}{item.company ? ` · ${item.company}` : ""}</p>
            <div className="mt-3 flex gap-2 text-sm">
              <button type="button" className="text-blue-600" onClick={() => { setEditing(item); setCreating(false); setForm({ name: item.name, role: item.role ?? "", company: item.company ?? "", content: item.content, rating: item.rating, status: item.status, isFeatured: item.isFeatured, sortOrder: 0 }); }}>Edit</button>
              <button type="button" className="text-red-600" onClick={() => setDeleteId(item._id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" name="name" required><Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></FormField>
            <FormField label="Role" name="role"><Input value={form.role} onChange={(e) => setForm((p) => ({ ...p, role: e.target.value }))} /></FormField>
            <FormField label="Company" name="company"><Input value={form.company} onChange={(e) => setForm((p) => ({ ...p, company: e.target.value }))} /></FormField>
            <FormField label="Rating" name="rating"><Input type="number" min={1} max={5} value={form.rating} onChange={(e) => setForm((p) => ({ ...p, rating: Number(e.target.value) }))} /></FormField>
            <FormField label="Status" name="status"><Select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}><option value="draft">Draft</option><option value="published">Published</option></Select></FormField>
            <Checkbox label="Featured" checked={form.isFeatured} onChange={(e) => setForm((p) => ({ ...p, isFeatured: e.target.checked }))} />
          </div>
          <FormField label="Content" name="content" required><Textarea value={form.content} onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))} rows={4} /></FormField>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Save</button>
            <button type="button" onClick={() => { setCreating(false); setEditing(null); }} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete testimonial?" variant="danger" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
