"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FieldLabel, TextArea, TextInput } from "./shared";

const bookingSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  company: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  services: z.string().min(2),
  challenge: z.string().min(10),
  consent: z.boolean().refine((value) => value, { message: "Consent is required" }),
});

export function BookingForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
  });
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = handleSubmit(async (values) => {
    try {
      const response = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          clientTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        }),
      });
      const data = (await response.json()) as { error?: string; warning?: string };
      if (!response.ok) throw new Error(data.error ?? "Booking failed.");
      setStatus("success");
      setMessage(data.warning ?? "Discovery call booked. Check your email for confirmation.");
      reset();
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Booking failed.");
    }
  });

  return (
    <form onSubmit={submit} className="space-y-4 rounded-2xl border border-black/10 bg-warm-white p-6" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="book-name">Name</FieldLabel>
          <TextInput id="book-name" error={errors.name?.message} {...register("name")} />
        </div>
        <div>
          <FieldLabel htmlFor="book-company">Business name</FieldLabel>
          <TextInput id="book-company" {...register("company")} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="book-email">Email</FieldLabel>
          <TextInput id="book-email" type="email" error={errors.email?.message} {...register("email")} />
        </div>
        <div>
          <FieldLabel htmlFor="book-phone">Phone</FieldLabel>
          <TextInput id="book-phone" {...register("phone")} />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel htmlFor="book-date">Preferred date</FieldLabel>
          <TextInput id="book-date" type="date" error={errors.date?.message} {...register("date")} />
        </div>
        <div>
          <FieldLabel htmlFor="book-time">Preferred time</FieldLabel>
          <TextInput id="book-time" type="time" error={errors.time?.message} {...register("time")} />
        </div>
      </div>
      <div>
        <FieldLabel htmlFor="book-services">Services of interest</FieldLabel>
        <TextInput id="book-services" error={errors.services?.message} {...register("services")} />
      </div>
      <div>
        <FieldLabel htmlFor="book-challenge">Biggest current challenge</FieldLabel>
        <TextArea id="book-challenge" rows={4} error={errors.challenge?.message} {...register("challenge")} />
      </div>
      <label className="flex items-start gap-3 text-sm text-concrete">
        <input type="checkbox" className="mt-1" {...register("consent")} />
        I consent to Netbrandit contacting me about this booking request.
      </label>
      {errors.consent && <p className="text-xs text-signal-red">{errors.consent.message}</p>}
      <button type="submit" disabled={isSubmitting} className="min-h-11 w-full rounded-full bg-signal-red py-3 text-sm font-semibold">
        {isSubmitting ? "Booking..." : "Book Discovery Call"}
      </button>
      {status !== "idle" && (
        <p role="status" className={status === "success" ? "text-green-400" : "text-signal-red"}>
          {message}
        </p>
      )}
    </form>
  );
}
