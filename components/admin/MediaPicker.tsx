"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageIcon, X, Upload } from "lucide-react";
import { toast } from "sonner";

interface MediaAsset {
  _id: string;
  url: string;
  alt?: string;
  originalName: string;
}

interface MediaPickerProps {
  value?: { url: string; alt?: string } | null;
  onChange: (value: { url: string; alt?: string } | null) => void;
  label?: string;
}

export function MediaPicker({ value, onChange, label = "Image" }: MediaPickerProps) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function openPicker() {
    setOpen(true);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/uploads?limit=50");
      const data = await res.json();
      if (res.ok) {
        setAssets(data.items ?? []);
      }
    } catch {
      toast.error("Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Upload failed");
      onChange({ url: data.url, alt: data.alt });
      setOpen(false);
      toast.success("Image uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <span className="block text-sm font-medium text-slate-700">{label}</span>
      {value?.url ? (
        <div className="relative inline-block">
          <div className="relative h-32 w-48 overflow-hidden rounded-lg border border-slate-200">
            <Image src={value.url} alt={value.alt ?? ""} fill className="object-cover" />
          </div>
          <button
            type="button"
            onClick={() => onChange(null)}
            className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white shadow"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => void openPicker()}
          className="flex h-32 w-48 flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
        >
          <ImageIcon className="h-8 w-8" />
          <span className="text-xs">Select image</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="flex max-h-[80vh] w-full max-w-2xl flex-col rounded-xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
              <h3 className="font-semibold text-slate-900">Media Library</h3>
              <button type="button" onClick={() => setOpen(false)}>
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>
            <div className="border-b border-slate-200 px-4 py-3">
              <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800">
                <Upload className="h-4 w-4" />
                {uploading ? "Uploading..." : "Upload new"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleUpload}
                  disabled={uploading}
                />
              </label>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              {loading ? (
                <p className="text-center text-sm text-slate-500">Loading...</p>
              ) : assets.length === 0 ? (
                <p className="text-center text-sm text-slate-500">No media uploaded yet.</p>
              ) : (
                <div className="grid grid-cols-3 gap-3 sm:grid-cols-4">
                  {assets.map((asset) => (
                    <button
                      key={asset._id}
                      type="button"
                      onClick={() => {
                        onChange({ url: asset.url, alt: asset.alt });
                        setOpen(false);
                      }}
                      className="group relative aspect-square overflow-hidden rounded-lg border border-slate-200 hover:border-blue-500"
                    >
                      <Image
                        src={asset.url}
                        alt={asset.alt ?? asset.originalName}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
