"use client";

import { toast } from "sonner";

interface PublishActionsProps {
  status: string;
  onSave: () => Promise<void>;
  onPublish?: () => Promise<void>;
  saving?: boolean;
}

export function PublishActions({
  status,
  onSave,
  onPublish,
  saving,
}: PublishActionsProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={async () => {
          try {
            await onSave();
            toast.success("Saved");
          } catch (err) {
            toast.error(err instanceof Error ? err.message : "Save failed");
          }
        }}
        disabled={saving}
        className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save draft"}
      </button>
      {onPublish && (
        <button
          type="button"
          onClick={async () => {
            try {
              await onPublish();
              toast.success("Published");
            } catch (err) {
              toast.error(err instanceof Error ? err.message : "Publish failed");
            }
          }}
          disabled={saving}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {status === "published" ? "Update published" : "Publish"}
        </button>
      )}
    </div>
  );
}
