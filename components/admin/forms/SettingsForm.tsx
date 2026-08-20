"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Tabs } from "@/components/admin/Tabs";
import { FormField, Input, Textarea, Checkbox } from "@/components/admin/FormField";

interface SettingsFormProps {
  settings: Record<string, unknown>;
}

const TAB_SECTIONS = [
  { id: "brand", label: "Brand", section: "brand" },
  { id: "contact", label: "Contact", section: "contact" },
  { id: "social", label: "Social", section: "social" },
  { id: "nav", label: "Header/Nav", section: "nav" },
  { id: "footer", label: "Footer", section: "footer" },
  { id: "seo", label: "SEO", section: "seo" },
  { id: "leadForms", label: "Lead Forms", section: "featureFlags" },
  { id: "booking", label: "Booking", section: "bookingPolicy" },
  { id: "email", label: "Email", section: "contact" },
  { id: "analytics", label: "Analytics", section: "seo" },
  { id: "features", label: "Feature Flags", section: "featureFlags" },
  { id: "legal", label: "Legal", section: "legal" },
];

export function SettingsForm({ settings }: SettingsFormProps) {
  const [activeTab, setActiveTab] = useState("brand");
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(settings);

  const tab = TAB_SECTIONS.find((t) => t.id === activeTab)!;
  const sectionData = (formData[tab.section] as Record<string, unknown>) ?? {};

  function updateField(key: string, value: unknown) {
    setFormData((prev) => ({
      ...prev,
      [tab.section]: { ...(prev[tab.section] as Record<string, unknown>), [key]: value },
    }));
  }

  async function save() {
    setSaving(true);
    const res = await fetch("/api/admin/settings", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ section: tab.section, data: formData[tab.section] }),
    });
    setSaving(false);
    if (!res.ok) {
      toast.error("Save failed");
      return;
    }
    toast.success("Settings saved");
  }

  function renderFields() {
    switch (activeTab) {
      case "brand":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Brand Name" name="name"><Input value={(sectionData.name as string) ?? ""} onChange={(e) => updateField("name", e.target.value)} /></FormField>
            <FormField label="Tagline" name="tagline"><Input value={(sectionData.tagline as string) ?? ""} onChange={(e) => updateField("tagline", e.target.value)} /></FormField>
            <FormField label="Logo URL" name="logo"><Input value={(sectionData.logo as string) ?? ""} onChange={(e) => updateField("logo", e.target.value)} /></FormField>
            <FormField label="Primary Color" name="primaryColor"><Input value={(sectionData.primaryColor as string) ?? ""} onChange={(e) => updateField("primaryColor", e.target.value)} /></FormField>
          </div>
        );
      case "contact":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Email" name="email"><Input value={(sectionData.email as string) ?? ""} onChange={(e) => updateField("email", e.target.value)} /></FormField>
            <FormField label="Phone" name="phone"><Input value={(sectionData.phone as string) ?? ""} onChange={(e) => updateField("phone", e.target.value)} /></FormField>
            <FormField label="Address" name="addressLine1"><Input value={(sectionData.addressLine1 as string) ?? ""} onChange={(e) => updateField("addressLine1", e.target.value)} /></FormField>
            <FormField label="City" name="city"><Input value={(sectionData.city as string) ?? ""} onChange={(e) => updateField("city", e.target.value)} /></FormField>
          </div>
        );
      case "social":
        return (
          <p className="text-sm text-slate-500">
            Social links are stored as an array. Use the API or seed script for bulk updates.
            Current count: {Array.isArray(formData.social) ? (formData.social as unknown[]).length : 0}
          </p>
        );
      case "nav":
        return (
          <p className="text-sm text-slate-500">
            Navigation items: {((sectionData.main as unknown[]) ?? []).length} main links configured.
          </p>
        );
      case "footer":
        return (
          <div className="space-y-4">
            <FormField label="Copyright Text" name="copyrightText"><Input value={(sectionData.copyrightText as string) ?? ""} onChange={(e) => updateField("copyrightText", e.target.value)} /></FormField>
            <Checkbox label="Show social links" checked={(sectionData.showSocialLinks as boolean) ?? true} onChange={(e) => updateField("showSocialLinks", e.target.checked)} />
          </div>
        );
      case "seo":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Default Meta Title" name="title"><Input value={(sectionData.title as string) ?? ""} onChange={(e) => updateField("title", e.target.value)} /></FormField>
            <FormField label="Default Meta Description" name="description"><Textarea value={(sectionData.description as string) ?? ""} onChange={(e) => updateField("description", e.target.value)} rows={2} /></FormField>
          </div>
        );
      case "leadForms":
        return (
          <p className="text-sm text-slate-500">
            Lead capture is controlled by the Feature Flags tab. Contact, quote, and newsletter forms submit to public API routes.
          </p>
        );
      case "booking":
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <FormField label="Min Notice (hours)" name="minNoticeHours"><Input type="number" value={(sectionData.minNoticeHours as number) ?? 24} onChange={(e) => updateField("minNoticeHours", Number(e.target.value))} /></FormField>
            <FormField label="Max Advance (days)" name="maxAdvanceDays"><Input type="number" value={(sectionData.maxAdvanceDays as number) ?? 60} onChange={(e) => updateField("maxAdvanceDays", Number(e.target.value))} /></FormField>
            <Checkbox label="Auto confirm bookings" checked={(sectionData.autoConfirm as boolean) ?? false} onChange={(e) => updateField("autoConfirm", e.target.checked)} />
          </div>
        );
      case "email":
        return (
          <p className="text-sm text-slate-500">Email settings are configured via environment variables (SMTP_HOST, SMTP_USER, etc.) in .env</p>
        );
      case "analytics":
        return (
          <p className="text-sm text-slate-500">Add analytics tracking IDs via environment variables or extend SiteSettings model.</p>
        );
      case "features":
        return (
          <div className="grid gap-3 md:grid-cols-2">
            {["enableBlog", "enableGallery", "enableBooking", "enableTestimonials", "enableFAQ", "enableLeadCapture", "enablePricing", "maintenanceMode"].map((flag) => (
              <Checkbox
                key={flag}
                label={flag.replace(/([A-Z])/g, " $1").trim()}
                checked={(sectionData[flag] as boolean) ?? false}
                onChange={(e) => updateField(flag, e.target.checked)}
              />
            ))}
          </div>
        );
      case "legal":
        return (
          <div className="space-y-4">
            <FormField label="Privacy Policy URL" name="privacyPolicyUrl"><Input value={(sectionData.privacyPolicyUrl as string) ?? ""} onChange={(e) => updateField("privacyPolicyUrl", e.target.value)} /></FormField>
            <FormField label="Terms of Service URL" name="termsOfServiceUrl"><Input value={(sectionData.termsOfServiceUrl as string) ?? ""} onChange={(e) => updateField("termsOfServiceUrl", e.target.value)} /></FormField>
          </div>
        );
      default:
        return null;
    }
  }

  return (
    <div>
      <Tabs tabs={TAB_SECTIONS.map(({ id, label }) => ({ id, label }))} activeTab={activeTab} onChange={setActiveTab}>
        <div className="rounded-xl border bg-white p-6">
          {renderFields()}
          {!["social", "nav", "email", "analytics", "leadForms"].includes(activeTab) && (
            <button
              type="button"
              onClick={save}
              disabled={saving}
              className="mt-6 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
          )}
        </div>
      </Tabs>
    </div>
  );
}
