"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { ImagePlus, Trash2, Upload } from "lucide-react";
import type { StoredUploadFolder } from "@/lib/uploads/constants";

interface LocalImageFieldProps {
  label: string;
  value?: string;
  folder?: StoredUploadFolder;
  onChange: (url: string | undefined) => void;
  hint?: string;
}

export function LocalImageField({
  label,
  value,
  folder = "pages",
  onChange,
  hint,
}: LocalImageFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFileSelect(file: File | null) {
    if (!file) return;

    setUploading(true);
    try {
      if (value?.startsWith("/api/uploads/")) {
        await fetch(`/api/upload?url=${encodeURIComponent(value)}`, { method: "DELETE" });
      }

      const formData = new FormData();
      formData.append("file", file);
      formData.append("folder", folder);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Upload failed");
      }

      onChange(data.url as string);
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      setUploading(false);
      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  async function handleRemove() {
    if (value?.startsWith("/api/uploads/")) {
      try {
        await fetch(`/api/upload?url=${encodeURIComponent(value)}`, { method: "DELETE" });
      } catch {
        toast.error("Could not delete stored image");
        return;
      }
    }

    onChange(undefined);
    toast.success("Image removed");
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <label className="text-sm font-medium text-slate-700">{label}</label>
        {hint ? <span className="text-xs text-slate-400">{hint}</span> : null}
      </div>

      {value ? (
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
          <div className="relative aspect-[16/10] max-h-48 w-full bg-slate-100">
            <Image
              src={value}
              alt=""
              fill
              unoptimized
              className="object-cover"
              sizes="320px"
            />
          </div>
          <div className="flex gap-2 border-t border-slate-200 p-3">
            <button
              type="button"
              disabled={uploading}
              onClick={() => inputRef.current?.click()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-white disabled:opacity-50"
            >
              <Upload className="h-4 w-4" />
              {uploading ? "Uploading..." : "Replace"}
            </button>
            <button
              type="button"
              disabled={uploading}
              onClick={handleRemove}
              className="inline-flex items-center gap-2 rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
              Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-4 py-8 text-sm text-slate-500 hover:border-slate-400 hover:bg-white disabled:opacity-50"
        >
          <ImagePlus className="h-6 w-6 text-slate-400" />
          {uploading ? "Uploading..." : "Upload image"}
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif"
        className="hidden"
        onChange={(event) => handleFileSelect(event.target.files?.[0] ?? null)}
      />
    </div>
  );
}
