"use client";

import { useState } from "react";
import { useForm, type FieldErrors, type UseFormRegister } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/lib/validation/common";
import { cn } from "@/lib/utils";
import type { z } from "zod";

export type ContactFormValues = z.infer<typeof contactFormSchema>;

interface FormShellProps {
  onSubmit: (values: ContactFormValues) => Promise<void>;
  children: (props: {
    register: UseFormRegister<ContactFormValues>;
    errors: FieldErrors<ContactFormValues>;
    isSubmitting: boolean;
  }) => React.ReactNode;
  className?: string;
  submitLabel?: string;
}

export function FormShell({
  onSubmit,
  children,
  className,
  submitLabel = "Submit",
}: FormShellProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
  });

  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = handleSubmit(async (values) => {
    setStatus("idle");
    try {
      await onSubmit(values);
      setStatus("success");
      setMessage("Thank you — we will be in touch shortly.");
      reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Something went wrong. Please try again.");
    }
  });

  return (
    <form
      onSubmit={submit}
      className={cn("min-w-0 max-w-full space-y-4 rounded-2xl border border-black/10 bg-warm-white p-6", className)}
      noValidate
    >
      {children({ register, errors, isSubmitting })}
      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-full bg-signal-red px-6 py-3 text-sm font-semibold text-warm-white disabled:opacity-60"
      >
        {isSubmitting ? "Sending..." : submitLabel}
      </button>
      {status !== "idle" && (
        <p role="status" className={cn("text-sm", status === "success" ? "text-green-400" : "text-signal-red")}>
          {message}
        </p>
      )}
    </form>
  );
}

export function FieldLabel({ children, htmlFor }: { children: React.ReactNode; htmlFor: string }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm font-medium text-concrete">
      {children}
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement> & { error?: string }) {
  const { error, className, ...rest } = props;
  return (
    <>
      <input
        {...rest}
        className={cn(
          "mt-1 w-full min-w-0 max-w-full rounded-lg border border-black/15 bg-warm-white px-4 py-3 text-sm text-ink placeholder:text-steel focus:border-signal-red",
          className,
        )}
      />
      {error && <p className="mt-1 text-xs text-signal-red">{error}</p>}
    </>
  );
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }) {
  const { error, className, ...rest } = props;
  return (
    <>
      <textarea
        {...rest}
        className={cn(
          "mt-1 w-full min-w-0 max-w-full rounded-lg border border-black/15 bg-warm-white px-4 py-3 text-sm text-ink placeholder:text-steel focus:border-signal-red",
          className,
        )}
      />
      {error && <p className="mt-1 text-xs text-signal-red">{error}</p>}
    </>
  );
}

export async function postLead(payload: Record<string, unknown>) {
  const response = await fetch("/api/leads", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const data = (await response.json().catch(() => ({}))) as { error?: string };
    throw new Error(data.error ?? "Unable to submit form.");
  }
}
