"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { FormField, Select, Textarea } from "@/components/admin/FormField";
import { StatusBadge } from "@/components/admin/StatusBadge";
import { formatDateTime } from "@/lib/admin/utils";

interface BookingItem {
  _id: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  startUtc: string;
  endUtc: string;
  status: string;
  notes?: string;
  meetingType?: { name?: string };
}

export function BookingsManager({ items: initial }: { items: BookingItem[] }) {
  const router = useRouter();
  const [selected, setSelected] = useState<BookingItem | null>(null);
  const [status, setStatus] = useState("");
  const [internalNotes, setInternalNotes] = useState("");

  function openBooking(item: BookingItem) {
    setSelected(item);
    setStatus(item.status);
    setInternalNotes("");
  }

  async function updateBooking() {
    if (!selected) return;
    const res = await fetch(`/api/admin/bookings/${selected._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, internalNotes: internalNotes || undefined }),
    });
    if (!res.ok) {
      toast.error("Update failed");
      return;
    }
    toast.success("Booking updated");
    setSelected(null);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2">
        <div className="overflow-hidden rounded-xl border bg-white">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Customer</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase text-slate-500">Status</th>
                <th className="px-4 py-3 text-right text-xs font-semibold uppercase text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {initial.map((item) => (
                <tr key={item._id}>
                  <td className="px-4 py-3 text-sm">
                    <p className="font-medium">{item.customerName}</p>
                    <p className="text-xs text-slate-500">{item.customerEmail}</p>
                  </td>
                  <td className="px-4 py-3 text-sm">{formatDateTime(item.startUtc)}</td>
                  <td className="px-4 py-3"><StatusBadge status={item.status} /></td>
                  <td className="px-4 py-3 text-right">
                    <button type="button" onClick={() => openBooking(item)} className="text-sm text-blue-600">Manage</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selected && (
        <div className="rounded-xl border bg-white p-6 space-y-4">
          <h3 className="font-semibold">{selected.customerName}</h3>
          <p className="text-sm text-slate-600">{selected.meetingType?.name ?? "Meeting"}</p>
          <p className="text-sm">{formatDateTime(selected.startUtc)}</p>
          <FormField label="Status" name="status">
            <Select value={status} onChange={(e) => setStatus(e.target.value)}>
              {["pending", "confirmed", "cancelled", "completed", "no_show"].map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </Select>
          </FormField>
          <FormField label="Internal Notes" name="internalNotes">
            <Textarea value={internalNotes} onChange={(e) => setInternalNotes(e.target.value)} rows={3} />
          </FormField>
          <div className="flex gap-2">
            <button type="button" onClick={updateBooking} className="flex-1 rounded-lg bg-blue-600 py-2 text-sm text-white">Save</button>
            <button type="button" onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2 text-sm">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
