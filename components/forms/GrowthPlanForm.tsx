"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { contactFormSchema } from "@/lib/validation/common";
import { FieldLabel, TextArea, TextInput, postLead } from "./shared";

const growthPlanSchema = contactFormSchema.extend({
  company: z.string().trim().min(1).max(160),
  services: z.string().trim().min(2).max(500),
  timeline: z.string().trim().max(80).optional(),
});

export function GrowthPlanForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof growthPlanSchema>>({
    resolver: zodResolver(growthPlanSchema),
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = handleSubmit(async (values) => {
    try {
      await postLead({
        ...values,
        formType: "quote",
        source: "growth-plan-form",
        message: `Services: ${values.services}\nTimeline: ${values.timeline ?? "Not specified"}\n\n${values.message}`,
      });
      setStatus("success");
      setMessage("Your growth plan request has been received.");
      reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Unable to submit.");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-black/10 bg-warm-white p-6" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("website")} />
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="gp-name">Name</FieldLabel>
          <TextInput id="gp-name" error={errors.name?.message} {...register("name")} />
        </div>
        <div>
          <FieldLabel htmlFor="gp-company">Business name</FieldLabel>
          <TextInput id="gp-company" error={errors.company?.message} {...register("company")} />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="gp-email">Email</FieldLabel>
        <TextInput id="gp-email" type="email" error={errors.email?.message} {...register("email")} />
      </div>
      <div>
        <FieldLabel htmlFor="gp-services">Services of interest</FieldLabel>
        <TextInput id="gp-services" error={errors.services?.message} {...register("services")} />
      </div>
      <div>
        <FieldLabel htmlFor="gp-message">Biggest current challenge</FieldLabel>
        <TextArea id="gp-message" rows={4} error={errors.message?.message} {...register("message")} />
      </div>
      <button type="submit" disabled={isSubmitting} className="min-h-11 w-full rounded-full bg-signal-red py-3 text-sm font-semibold">
        {isSubmitting ? "Sending..." : "Get My Free Growth Plan"}
      </button>
      {status !== "idle" && (
        <p role="status" className={status === "success" ? "text-green-400" : "text-signal-red"}>
          {message}
        </p>
      )}
    </form>
  );
}
