"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, Input, Select, Textarea } from "@/components/admin/FormField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { slugify } from "@/lib/admin/utils";

interface FAQItem {
  _id: string;
  question: string;
  answer: string;
  category: string;
  status: string;
  sortOrder: number;
}

export function FAQManager({ items: initial }: { items: FAQItem[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    question: "",
    answer: "",
    category: "general",
    status: "published",
    sortOrder: 0,
  });

  async function save() {
    const url = editing ? `/api/admin/faqs/${editing._id}` : "/api/admin/faqs";
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
    toast.success("FAQ saved");
    setEditing(null);
    setCreating(false);
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/faqs/${deleteId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    toast.success("FAQ deleted");
    setDeleteId(null);
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setCreating(true);
            setEditing(null);
            setForm({ question: "", answer: "", category: "general", status: "published", sortOrder: 0 });
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white"
        >
          Add FAQ
        </button>
      </div>

      <div className="space-y-3">
        {initial.map((item) => (
          <div key={item._id} className="rounded-xl border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-medium text-slate-900">{item.question}</p>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{item.answer}</p>
                <p className="mt-2 text-xs text-slate-400">{item.category} · {item.status}</p>
              </div>
              <div className="flex shrink-0 gap-2 text-sm">
                <button type="button" className="text-blue-600" onClick={() => { setEditing(item); setCreating(false); setForm({ question: item.question, answer: item.answer, category: item.category, status: item.status, sortOrder: item.sortOrder }); }}>Edit</button>
                <button type="button" className="text-red-600" onClick={() => setDeleteId(item._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {(creating || editing) && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">{editing ? "Edit FAQ" : "New FAQ"}</h3>
          <div className="space-y-4">
            <FormField label="Question" name="question" required>
              <Input value={form.question} onChange={(e) => setForm((p) => ({ ...p, question: e.target.value }))} />
            </FormField>
            <FormField label="Answer" name="answer" required>
              <Textarea value={form.answer} onChange={(e) => setForm((p) => ({ ...p, answer: e.target.value }))} rows={4} />
            </FormField>
            <div className="grid gap-4 md:grid-cols-3">
              <FormField label="Category" name="category">
                <Input value={form.category} onChange={(e) => setForm((p) => ({ ...p, category: e.target.value }))} />
              </FormField>
              <FormField label="Status" name="status">
                <Select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </Select>
              </FormField>
              <FormField label="Sort Order" name="sortOrder">
                <Input type="number" value={form.sortOrder} onChange={(e) => setForm((p) => ({ ...p, sortOrder: Number(e.target.value) }))} />
              </FormField>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button type="button" onClick={save} className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white">Save</button>
            <button type="button" onClick={() => { setCreating(false); setEditing(null); }} className="rounded-lg border px-4 py-2 text-sm">Cancel</button>
          </div>
        </div>
      )}

      <ConfirmDialog open={!!deleteId} title="Delete FAQ?" variant="danger" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
