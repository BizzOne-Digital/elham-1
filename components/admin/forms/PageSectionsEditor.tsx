"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ChevronDown, ChevronUp, Eye, EyeOff } from "lucide-react";
import type { Section } from "@/models/shared";
import { FormField, Input, Textarea } from "@/components/admin/FormField";
import { LocalImageField } from "@/components/admin/LocalImageField";
import {
  formatSectionTypeLabel,
  getSectionFieldDefinitions,
  type SectionFieldDefinition,
} from "@/lib/cms/section-field-definitions";

interface PageSectionsEditorProps {
  pageId: string;
  pageSlug: string;
  initialSections: Section[];
}

function sortSections(sections: Section[]): Section[] {
  return [...sections].sort((a, b) => a.order - b.order);
}

function getFieldValue(data: Record<string, unknown>, key: string): unknown {
  return data[key];
}

function setFieldValue(data: Record<string, unknown>, key: string, value: unknown): Record<string, unknown> {
  const next = { ...data };
  if (value === undefined || value === "") {
    delete next[key];
  } else {
    next[key] = value;
  }
  return next;
}

function SectionFieldEditor({
  field,
  data,
  onChange,
}: {
  field: SectionFieldDefinition;
  data: Record<string, unknown>;
  onChange: (nextData: Record<string, unknown>) => void;
}) {
  const value = getFieldValue(data, field.key);

  if (field.type === "text") {
    return (
      <FormField label={field.label} name={field.key} hint={field.hint}>
        <Input
          value={String(value ?? "")}
          onChange={(event) => onChange(setFieldValue(data, field.key, event.target.value))}
          placeholder={field.placeholder}
        />
      </FormField>
    );
  }

  if (field.type === "textarea") {
    return (
      <FormField label={field.label} name={field.key} hint={field.hint}>
        <Textarea
          rows={4}
          value={String(value ?? "")}
          onChange={(event) => onChange(setFieldValue(data, field.key, event.target.value))}
          placeholder={field.placeholder}
        />
      </FormField>
    );
  }

  if (field.type === "boolean") {
    return (
      <label className="flex items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(event) => onChange(setFieldValue(data, field.key, event.target.checked))}
          className="h-4 w-4 rounded border-slate-300"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "image") {
    return (
      <LocalImageField
        label={field.label}
        hint={field.hint}
        folder={field.folder ?? "pages"}
        value={typeof value === "string" ? value : undefined}
        onChange={(url) => onChange(setFieldValue(data, field.key, url))}
      />
    );
  }

  if (field.type === "images") {
    const images = Array.isArray(value) ? value.map(String) : [];
    const slots = [0, 1, 2, 3];

    return (
      <div className="space-y-4">
        <p className="text-sm font-medium text-slate-700">{field.label}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {slots.map((index) => (
            <LocalImageField
              key={`${field.key}-${index}`}
              label={`Image ${index + 1}`}
              folder={field.folder ?? "pages"}
              value={images[index]}
              onChange={(url) => {
                const next = [...slots.map((slotIndex) => images[slotIndex] ?? "")];
                if (url) {
                  next[index] = url;
                } else {
                  next[index] = "";
                }
                onChange(
                  setFieldValue(
                    data,
                    field.key,
                    next.filter(Boolean),
                  ),
                );
              }}
            />
          ))}
        </div>
      </div>
    );
  }

  if (field.type === "lines") {
    const lines = Array.isArray(value) ? value.map(String) : [];
    return (
      <FormField label={field.label} name={field.key} hint={field.hint ?? "One item per line"}>
        <Textarea
          rows={6}
          value={lines.join("\n")}
          onChange={(event) =>
            onChange(
              setFieldValue(
                data,
                field.key,
                event.target.value
                  .split("\n")
                  .map((line) => line.trim())
                  .filter(Boolean),
              ),
            )
          }
        />
      </FormField>
    );
  }

  if (field.type === "cta") {
    const cta = (value as { label?: string; href?: string } | undefined) ?? {};
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <FormField label={`${field.label} label`} name={`${field.key}.label`}>
          <Input
            value={cta.label ?? ""}
            onChange={(event) =>
              onChange(
                setFieldValue(data, field.key, {
                  ...cta,
                  label: event.target.value,
                  href: cta.href ?? "",
                }),
              )
            }
          />
        </FormField>
        <FormField label={`${field.label} link`} name={`${field.key}.href`}>
          <Input
            value={cta.href ?? ""}
            onChange={(event) =>
              onChange(
                setFieldValue(data, field.key, {
                  ...cta,
                  label: cta.label ?? "",
                  href: event.target.value,
                }),
              )
            }
          />
        </FormField>
      </div>
    );
  }

  return null;
}

export function PageSectionsEditor({ pageId, pageSlug, initialSections }: PageSectionsEditorProps) {
  const [sections, setSections] = useState<Section[]>(() => sortSections(initialSections));
  const [expandedId, setExpandedId] = useState<string | null>(initialSections[0]?.id ?? null);
  const [saving, setSaving] = useState(false);

  const orderedSections = useMemo(() => sortSections(sections), [sections]);

  function updateSection(sectionId: string, updater: (section: Section) => Section) {
    setSections((current) => current.map((section) => (section.id === sectionId ? updater(section) : section)));
  }

  function moveSection(sectionId: string, direction: -1 | 1) {
    const sorted = sortSections(sections);
    const index = sorted.findIndex((section) => section.id === sectionId);
    const targetIndex = index + direction;
    if (index < 0 || targetIndex < 0 || targetIndex >= sorted.length) {
      return;
    }

    const reordered = [...sorted];
    const [item] = reordered.splice(index, 1);
    reordered.splice(targetIndex, 0, item!);
    setSections(reordered.map((section, order) => ({ ...section, order })));
  }

  async function saveSections() {
    setSaving(true);
    try {
      const payload = {
        sections: sortSections(sections).map((section, index) => ({
          ...section,
          order: index,
        })),
      };

      const res = await fetch(`/api/admin/pages/${pageId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "Failed to save sections");
      }

      setSections(sortSections(data.sections ?? payload.sections));
      toast.success(`Sections saved for /${pageSlug}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save sections");
    } finally {
      setSaving(false);
    }
  }

  if (orderedSections.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No sections found for this page yet. Run the seed script or add sections in MongoDB.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Page sections</h3>
          <p className="text-sm text-slate-500">
            Edit each section below. Saving updates the live frontend for published pages.
          </p>
        </div>
        <button
          type="button"
          onClick={saveSections}
          disabled={saving}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800 disabled:opacity-50"
        >
          {saving ? "Saving sections..." : "Save sections"}
        </button>
      </div>

      <div className="space-y-3">
        {orderedSections.map((section, index) => {
          const isOpen = expandedId === section.id;
          const fields = getSectionFieldDefinitions(section.type);

          return (
            <div key={section.id} className="overflow-hidden rounded-xl border border-slate-200 bg-white">
              <div className="flex flex-wrap items-center gap-3 border-b border-slate-100 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setExpandedId(isOpen ? null : section.id)}
                  className="flex min-w-0 flex-1 items-center gap-3 text-left"
                >
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-700">
                    {index + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-semibold text-slate-900">
                      {section.label ?? formatSectionTypeLabel(section.type)}
                    </span>
                    <span className="block truncate text-xs uppercase tracking-wide text-slate-400">
                      {section.type}
                    </span>
                  </span>
                  {isOpen ? (
                    <ChevronUp className="ml-auto h-4 w-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="ml-auto h-4 w-4 text-slate-400" />
                  )}
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => moveSection(section.id, -1)}
                    disabled={index === 0}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 disabled:opacity-40"
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    onClick={() => moveSection(section.id, 1)}
                    disabled={index === orderedSections.length - 1}
                    className="rounded-lg border border-slate-200 px-2 py-1 text-xs text-slate-600 disabled:opacity-40"
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateSection(section.id, (current) => ({ ...current, enabled: !current.enabled }))
                    }
                    className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                      section.enabled ?
                        "bg-emerald-50 text-emerald-700"
                      : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {section.enabled ?
                      <>
                        <Eye className="h-3.5 w-3.5" /> Visible
                      </>
                    : <>
                        <EyeOff className="h-3.5 w-3.5" /> Hidden
                      </>
                    }
                  </button>
                </div>
              </div>

              {isOpen ? (
                <div className="space-y-4 p-4">
                  <FormField label="Section label" name={`${section.id}-label`}>
                    <Input
                      value={section.label ?? ""}
                      onChange={(event) =>
                        updateSection(section.id, (current) => ({
                          ...current,
                          label: event.target.value,
                        }))
                      }
                    />
                  </FormField>

                  {fields.length > 0 ? (
                    fields.map((field) => (
                      <SectionFieldEditor
                        key={`${section.id}-${field.key}`}
                        field={field}
                        data={section.data}
                        onChange={(nextData) =>
                          updateSection(section.id, (current) => ({ ...current, data: nextData }))
                        }
                      />
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">This section has no editable fields.</p>
                  )}
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
