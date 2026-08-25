"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactFormSchema } from "@/lib/validation/common";
import { FieldLabel, TextArea, TextInput } from "./shared";

const extendedContactSchema = contactFormSchema.extend({
  company: z.string().trim().max(160).optional(),
  services: z.string().trim().max(500).optional(),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
});

export function ContactForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof extendedContactSchema>>({
    resolver: zodResolver(extendedContactSchema),
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!response.ok) throw new Error("Unable to send message.");
      setStatus("success");
      setMessage("Message sent. We typically respond within one business day.");
      reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to send.");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-black/10 bg-warm-white p-6" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="contact-name">Name</FieldLabel>
          <TextInput id="contact-name" error={errors.name?.message} {...register("name")} />
        </div>
        <div>
          <FieldLabel htmlFor="contact-company">Business</FieldLabel>
          <TextInput id="contact-company" {...register("company")} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="contact-email">Email</FieldLabel>
          <TextInput id="contact-email" type="email" error={errors.email?.message} {...register("email")} />
        </div>
        <div>
          <FieldLabel htmlFor="contact-phone">Phone</FieldLabel>
          <TextInput id="contact-phone" type="tel" {...register("phone")} />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="contact-services">Service interests</FieldLabel>
        <TextInput id="contact-services" {...register("services")} />
      </div>
      <div>
        <FieldLabel htmlFor="contact-message">Message</FieldLabel>
        <TextArea id="contact-message" rows={5} error={errors.message?.message} {...register("message")} />
      </div>
      <button type="submit" disabled={isSubmitting} className="min-h-11 w-full rounded-full bg-signal-red py-3 text-sm font-semibold">
        {isSubmitting ? "Sending..." : "Send Message"}
      </button>
      {status !== "idle" && (
        <p role="status" className={status === "success" ? "text-green-400" : "text-signal-red"}>
          {message}
        </p>
      )}
    </form>
  );
}
