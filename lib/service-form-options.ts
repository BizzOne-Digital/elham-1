import { z } from "zod";

/** Published service titles — matches /services listing (seed + fallbacks). */
export const SERVICE_FORM_OPTIONS = [
  "Custom Web Design",
  "Web and Mobile App Development",
  "AI Automation",
  "Social Media Management",
  "Competitor Analysis and Market Research",
  "Google and Meta Advertising",
  "Search Engine Optimisation",
  "Growth Marketing Strategy",
] as const;

export type ServiceFormOption = (typeof SERVICE_FORM_OPTIONS)[number];

export const selectedServiceFieldSchema = z.enum(SERVICE_FORM_OPTIONS, {
  message: "Please select a service.",
});

export const optionalServiceFieldSchema = z.union([z.literal(""), selectedServiceFieldSchema]);
