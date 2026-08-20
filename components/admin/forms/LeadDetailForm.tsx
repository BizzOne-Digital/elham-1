"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, Select, Textarea } from "@/components/admin/FormField";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin/utils";

interface LeadDetailProps {
  lead: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    company?: string;
    message: string;
    status: string;
    priority: string;
    source: string;
    createdAt: string;
    notes: { body: string; createdAt: string }[];
  };
}

export function LeadDetailForm({ lead }: LeadDetailProps) {
  const router = useRouter();
  const [status, setStatus] = useState(lead.status);
  const [priority, setPriority] = useState(lead.priority);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    const res = await fetch(`/api/admin/leads/${lead._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, priority, note: note || undefined }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Lead updated");
    setNote("");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-4">
        <div className="rounded-xl border bg-white p-6">
          <h3 className="font-semibold">Message</h3>
          <p className="mt-3 whitespace-pre-wrap text-sm text-slate-700">{lead.message}</p>
        </div>
        {lead.notes?.length > 0 && (
          <div className="rounded-xl border bg-white p-6">
            <h3 className="font-semibold">Notes</h3>
            <ul className="mt-3 space-y-3">
              {lead.notes.map((n, i) => (
                <li key={i} className="rounded-lg bg-slate-50 p-3 text-sm">
                  <p>{n.body}</p>
                  <p className="mt-1 text-xs text-slate-400">{formatDateTime(n.createdAt)}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <div className="space-y-4">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-lg font-semibold">{lead.name}</p>
          <p className="text-sm text-slate-600">{lead.email}</p>
          {lead.phone && <p className="text-sm text-slate-600">{lead.phone}</p>}
          {lead.company && <p className="text-sm text-slate-600">{lead.company}</p>}
          <p className="mt-3 text-xs text-slate-400">Source: {lead.source} · {formatDateTime(lead.createdAt)}</p>
          <div className="mt-3"><StatusBadge status={lead.status} /></div>
        </div>
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <FormField label="Status" name="status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {["new", "contacted", "qualified", "proposal", "won", "lost", "archived"].map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Priority" name="priority">
            <Select value={priority} onChange={(e) => setPriority(e.target.value)}>
              {["low", "medium", "high", "urgent"].map((p) => (
                <option key={p} value={p}>{p}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Add Note" name="note">
            <Textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} />
          </FormField>
          <button type="button" onClick={save} disabled={saving} className="w-full rounded-lg bg-blue-600 py-2 text-sm text-white disabled:opacity-50">
            {saving ? "Saving..." : "Update Lead"}
          </button>
        </div>
      </div>
    </div>
  );
}
