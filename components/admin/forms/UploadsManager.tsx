"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Image from "next/image";
import { Upload, Trash2 } from "lucide-react";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { formatDateTime } from "@/lib/admin/utils";

interface MediaItem {
  _id: string;
  url: string;
  originalName: string;
  mimeType: string;
  size: number;
  createdAt: string;
}

export function UploadsManager({ items: initial }: { items: MediaItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [uploading, setUploading] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
    const data = await res.json();
    setUploading(false);
    if (!res.ok) {
      toast.error(data.error ?? "Upload failed");
      return;
    }
    toast.success("Uploaded");
    router.refresh();
  }

  async function handleDelete() {
    if (!deleteId) return;
    const res = await fetch(`/api/admin/uploads?id=${deleteId}`, { method: "DELETE" });
    if (!res.ok) {
      toast.error("Delete failed");
      return;
    }
    setItems((prev) => prev.filter((i) => i._id !== deleteId));
    setDeleteId(null);
    toast.success("Deleted");
    router.refresh();
  }

  return (
    <div>
      <div className="mb-6">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
          <Upload className="h-4 w-4" />
          {uploading ? "Uploading..." : "Upload Image"}
          <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {items.map((item) => (
          <div key={item._id} className="group relative overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="relative aspect-square">
              <Image src={item.url} alt={item.originalName} fill className="object-cover" />
            </div>
            <div className="p-3">
              <p className="truncate text-sm font-medium">{item.originalName}</p>
              <p className="text-xs text-slate-500">{formatDateTime(item.createdAt)}</p>
              <button type="button" onClick={() => setDeleteId(item._id)} className="mt-2 flex items-center gap-1 text-xs text-red-600">
                <Trash2 className="h-3 w-3" /> Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog open={!!deleteId} title="Delete file?" variant="danger" confirmLabel="Delete" onConfirm={handleDelete} onCancel={() => setDeleteId(null)} />
    </div>
  );
}
