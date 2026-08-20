"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, Input, Select, Textarea, Checkbox } from "@/components/admin/FormField";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { slugify } from "@/lib/admin/utils";

interface PricingItem {
  _id: string;
  name: string;
  slug: string;
  price: number;
  currency: string;
  billingPeriod: string;
  status: string;
  isPopular: boolean;
}

interface PricingManagerProps {
  items: PricingItem[];
}

export function PricingManager({ items: initial }: PricingManagerProps) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<PricingItem | null>(null);
  const [creating, setCreating] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: 0,
    currency: "CAD",
    billingPeriod: "one_time",
    status: "draft",
    isPopular: false,
    sortOrder: 0,
  });

  function resetForm() {
    setForm({
      name: "",
      slug: "",
      description: "",
      price: 0,
      currency: "CAD",
      billingPeriod: "one_time",
      status: "draft",
      isPopular: false,
      sortOrder: 0,
    });
  }

  function startEdit(item: PricingItem) {
    setEditing(item);
    setCreating(false);
    setForm({
      name: item.name,
      slug: item.slug,
      description: "",
      price: item.price,
      currency: item.currency,
      billingPeriod: item.billingPeriod,
      status: item.status,
      isPopular: item.isPopular,
      sortOrder: 0,
    });
  }

  async function handleSave() {
    const url = editing ? `/api/admin/pricing/${editing._id}` : "/api/admin/pricing";
    const method = editing ? "PATCH" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();

    if (!res.ok) {
      toast.error(data.error ?? "Save failed");
      return;
    }

    toast.success(editing ? "Package updated" : "Package created");
    setEditing(null);
    setCreating(false);
    resetForm();
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/pricing/${deleteId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    setItems((prev) => prev.filter((i) => i._id !== deleteId));
    setDeleteId(null);
    toast.success("Package deleted");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            resetForm();
            setCreating(true);
            setEditing(null);
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Add Package
        </button>
      </div>

      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Name</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Price</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Period</th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
              <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.map((item) => (
              <tr key={item._id}>
                <td className="px-4 py-3 text-sm">{item.name}</td>
                <td className="px-4 py-3 text-sm">
                  {item.currency} {item.price.toLocaleString()}
                </td>
                <td className="px-4 py-3 text-sm capitalize">{item.billingPeriod.replace("_", " ")}</td>
                <td className="px-4 py-3 text-sm capitalize">{item.status}</td>
                <td className="px-4 py-3 text-right text-sm">
                  <button type="button" onClick={() => startEdit(item)} className="text-blue-600 hover:underline">
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteId(item._id)}
                    className="ml-3 text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(creating || editing) && (
        <div className="rounded-xl border border-slate-200 bg-white p-6">
          <h3 className="mb-4 font-semibold">{editing ? "Edit Package" : "New Package"}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Name" name="name" required>
              <Input
                value={form.name}
                onChange={(e) =>
                  setForm((p) => ({
                    ...p,
                    name: e.target.value,
                    slug: editing ? p.slug : slugify(e.target.value),
                  }))
                }
              />
            </FormField>
            <FormField label="Slug" name="slug" required>
              <Input value={form.slug} onChange={(e) => setForm((p) => ({ ...p, slug: e.target.value }))} />
            </FormField>
            <FormField label="Price" name="price" required>
              <Input
                type="number"
                value={form.price}
                onChange={(e) => setForm((p) => ({ ...p, price: Number(e.target.value) }))}
              />
            </FormField>
            <FormField label="Billing Period" name="billingPeriod">
              <Select
                value={form.billingPeriod}
                onChange={(e) => setForm((p) => ({ ...p, billingPeriod: e.target.value }))}
              >
                <option value="one_time">One Time</option>
                <option value="monthly">Monthly</option>
                <option value="yearly">Yearly</option>
                <option value="custom">Custom</option>
              </Select>
            </FormField>
            <FormField label="Status" name="status">
              <Select value={form.status} onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}>
                <option value="draft">Draft</option>
                <option value="published">Published</option>
                <option value="archived">Archived</option>
              </Select>
            </FormField>
            <div className="flex items-end">
              <Checkbox
                label="Popular package"
                checked={form.isPopular}
                onChange={(e) => setForm((p) => ({ ...p, isPopular: e.target.checked }))}
              />
            </div>
            <div className="md:col-span-2">
              <FormField label="Description" name="description">
                <Textarea
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  rows={3}
                />
              </FormField>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={handleSave}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => {
                setCreating(false);
                setEditing(null);
              }}
              className="rounded-lg border border-slate-200 px-4 py-2 text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        title="Delete pricing package?"
        description="This action cannot be undone."
        variant="danger"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}
