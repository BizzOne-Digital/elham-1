"use client";

import { useState } from "react";
import { toast } from "sonner";
import { FormField, Input } from "@/components/admin/FormField";

interface ProfileFormProps {
  user: { name: string; email: string };
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    currentPassword: "",
    newPassword: "",
  });
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    toast.info("Profile updates use env-based auth. Update ADMIN_EMAIL in .env to change credentials.");
    setSaving(false);
  }

  return (
    <div className="max-w-lg space-y-4 rounded-xl border bg-white p-6">
      <FormField label="Name" name="name">
        <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
      </FormField>
      <FormField label="Email" name="email">
        <Input type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} />
      </FormField>
      <FormField label="Current Password" name="currentPassword">
        <Input type="password" value={form.currentPassword} onChange={(e) => setForm((p) => ({ ...p, currentPassword: e.target.value }))} />
      </FormField>
      <FormField label="New Password" name="newPassword">
        <Input type="password" value={form.newPassword} onChange={(e) => setForm((p) => ({ ...p, newPassword: e.target.value }))} />
      </FormField>
      <p className="text-xs text-slate-500">
        Authentication is configured via ADMIN_EMAIL and ADMIN_PASSWORD environment variables.
      </p>
      <button type="button" onClick={save} disabled={saving} className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50">
        {saving ? "Saving..." : "Save Profile"}
      </button>
    </div>
  );
}
