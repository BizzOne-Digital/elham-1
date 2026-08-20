import { formatInTimeZone } from "date-fns-tz";
import { BRAND } from "@/lib/constants";

function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function layout(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>${escapeHtml(BRAND.name)}</title>
  </head>
  <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #0f172a;">
    ${content}
    <p style="margin-top: 32px; color: #64748b; font-size: 12px;">
      ${escapeHtml(BRAND.name)} · ${escapeHtml(getSiteUrl())}
    </p>
  </body>
</html>`;
}

export interface BookingConfirmationInput {
  name: string;
  service: string;
  startAt: Date;
  timeZone: string;
  bookingId: string;
  cancelUrl?: string;
  rescheduleUrl?: string;
}

export function bookingConfirmationTemplate(
  input: BookingConfirmationInput,
): EmailTemplate {
  const formattedDate = formatInTimeZone(
    input.startAt,
    input.timeZone,
    "EEEE, MMMM d, yyyy",
  );
  const formattedTime = formatInTimeZone(
    input.startAt,
    input.timeZone,
    "h:mm a zzz",
  );

  const actionLinks = [
    input.rescheduleUrl ?
      `<p><a href="${escapeHtml(input.rescheduleUrl)}">Reschedule appointment</a></p>`
    : "",
    input.cancelUrl ?
      `<p><a href="${escapeHtml(input.cancelUrl)}">Cancel appointment</a></p>`
    : "",
  ].join("");

  const html = layout(`
    <h1>Booking confirmed</h1>
    <p>Hi ${escapeHtml(input.name)},</p>
    <p>Your appointment with ${escapeHtml(BRAND.name)} is confirmed.</p>
    <ul>
      <li><strong>Service:</strong> ${escapeHtml(input.service)}</li>
      <li><strong>Date:</strong> ${escapeHtml(formattedDate)}</li>
      <li><strong>Time:</strong> ${escapeHtml(formattedTime)}</li>
      <li><strong>Reference:</strong> ${escapeHtml(input.bookingId)}</li>
    </ul>
    ${actionLinks}
  `);

  const text = [
    "Booking confirmed",
    "",
    `Hi ${input.name},`,
    "",
    `Service: ${input.service}`,
    `Date: ${formattedDate}`,
    `Time: ${formattedTime}`,
    `Reference: ${input.bookingId}`,
    input.rescheduleUrl ? `Reschedule: ${input.rescheduleUrl}` : "",
    input.cancelUrl ? `Cancel: ${input.cancelUrl}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `Your ${BRAND.name} booking is confirmed`,
    html,
    text,
  };
}

export interface ContactNotificationInput {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}

export function contactNotificationTemplate(
  input: ContactNotificationInput,
): EmailTemplate {
  const html = layout(`
    <h1>New contact form submission</h1>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(input.name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(input.email)}</li>
      ${
        input.phone ?
          `<li><strong>Phone:</strong> ${escapeHtml(input.phone)}</li>`
        : ""
      }
      ${
        input.source ?
          `<li><strong>Source:</strong> ${escapeHtml(input.source)}</li>`
        : ""
      }
    </ul>
    <p><strong>Message</strong></p>
    <p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>
  `);

  const text = [
    "New contact form submission",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : "",
    input.source ? `Source: ${input.source}` : "",
    "",
    input.message,
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `New contact from ${input.name}`,
    html,
    text,
  };
}

export interface LeadNotificationInput {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  status?: string;
  utm?: Record<string, string | undefined>;
}

export function leadNotificationTemplate(
  input: LeadNotificationInput,
): EmailTemplate {
  const utmEntries = Object.entries(input.utm ?? {}).filter(([, value]) => value);
  const utmHtml =
    utmEntries.length > 0 ?
      `<ul>${utmEntries
        .map(
          ([key, value]) =>
            `<li><strong>${escapeHtml(key)}:</strong> ${escapeHtml(value ?? "")}</li>`,
        )
        .join("")}</ul>`
    : "<p>No UTM parameters captured.</p>";

  const html = layout(`
    <h1>New lead captured</h1>
    <ul>
      <li><strong>Name:</strong> ${escapeHtml(input.name)}</li>
      <li><strong>Email:</strong> ${escapeHtml(input.email)}</li>
      ${
        input.phone ?
          `<li><strong>Phone:</strong> ${escapeHtml(input.phone)}</li>`
        : ""
      }
      ${
        input.status ?
          `<li><strong>Status:</strong> ${escapeHtml(input.status)}</li>`
        : ""
      }
      ${
        input.source ?
          `<li><strong>Source:</strong> ${escapeHtml(input.source)}</li>`
        : ""
      }
    </ul>
    ${
      input.message ?
        `<p><strong>Message</strong></p><p>${escapeHtml(input.message).replace(/\n/g, "<br />")}</p>`
      : ""
    }
    <p><strong>UTM</strong></p>
    ${utmHtml}
  `);

  const text = [
    "New lead captured",
    `Name: ${input.name}`,
    `Email: ${input.email}`,
    input.phone ? `Phone: ${input.phone}` : "",
    input.status ? `Status: ${input.status}` : "",
    input.source ? `Source: ${input.source}` : "",
    input.message ? `\n${input.message}` : "",
    utmEntries.length > 0 ?
      `\nUTM:\n${utmEntries.map(([k, v]) => `${k}: ${v}`).join("\n")}`
    : "",
  ]
    .filter(Boolean)
    .join("\n");

  return {
    subject: `New lead: ${input.name}`,
    html,
    text,
  };
}
