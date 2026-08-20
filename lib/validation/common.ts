import { z } from "zod";
import { BOOKING_STATUS, FORM_TYPES, LEAD_STATUS } from "@/lib/constants";

const trimmedString = (min = 1, max = 500) =>
  z.string().trim().min(min).max(max);

export const emailSchema = z.string().trim().email().max(320);

export const phoneSchema = z
  .string()
  .trim()
  .max(32)
  .regex(/^[+\d\s().-]*$/, "Invalid phone number")
  .optional()
  .or(z.literal(""));

export const utmSchema = z
  .object({
    utm_source: z.string().trim().max(120).optional(),
    utm_medium: z.string().trim().max(120).optional(),
    utm_campaign: z.string().trim().max(120).optional(),
    utm_term: z.string().trim().max(120).optional(),
    utm_content: z.string().trim().max(120).optional(),
  })
  .partial();

export const contactFormSchema = z.object({
  name: trimmedString(2, 120),
  email: emailSchema,
  phone: phoneSchema,
  message: trimmedString(10, 5000),
  source: z.string().trim().max(120).optional(),
  website: z.string().max(0).optional(),
  ...utmSchema.shape,
});

export type ContactFormInput = z.infer<typeof contactFormSchema>;

export const quoteFormSchema = contactFormSchema.extend({
  company: trimmedString(1, 160).optional(),
  budget: z.string().trim().max(80).optional(),
  timeline: z.string().trim().max(80).optional(),
});

export type QuoteFormInput = z.infer<typeof quoteFormSchema>;

export const newsletterFormSchema = z.object({
  email: emailSchema,
  source: z.string().trim().max(120).optional(),
  ...utmSchema.shape,
});

export type NewsletterFormInput = z.infer<typeof newsletterFormSchema>;

export const leadUpdateSchema = z.object({
  status: z.enum([
    LEAD_STATUS.new,
    LEAD_STATUS.contacted,
    LEAD_STATUS.qualified,
    LEAD_STATUS.converted,
    LEAD_STATUS.closed,
    LEAD_STATUS.spam,
  ]),
  notes: z.string().trim().max(5000).optional(),
});

export type LeadUpdateInput = z.infer<typeof leadUpdateSchema>;

export const bookingFormSchema = z.object({
  name: trimmedString(2, 120),
  email: emailSchema,
  phone: phoneSchema,
  service: trimmedString(2, 160),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date"),
  time: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time"),
  notes: z.string().trim().max(2000).optional(),
  ...utmSchema.shape,
});

export type BookingFormInput = z.infer<typeof bookingFormSchema>;

export const bookingActionSchema = z.object({
  token: trimmedString(10, 2048),
});

export const loginFormSchema = z.object({
  email: emailSchema,
  password: z.string().min(8).max(128),
});

export type LoginFormInput = z.infer<typeof loginFormSchema>;

export const formTypeSchema = z.enum([
  FORM_TYPES.contact,
  FORM_TYPES.quote,
  FORM_TYPES.newsletter,
  FORM_TYPES.booking,
]);

export const bookingStatusSchema = z.enum([
  BOOKING_STATUS.pending,
  BOOKING_STATUS.confirmed,
  BOOKING_STATUS.cancelled,
  BOOKING_STATUS.completed,
  BOOKING_STATUS.noShow,
  BOOKING_STATUS.rescheduled,
]);

export function parseFormData<T extends z.ZodTypeAny>(
  schema: T,
  data: unknown,
): z.SafeParseReturnType<unknown, z.infer<T>> {
  return schema.safeParse(data);
}
