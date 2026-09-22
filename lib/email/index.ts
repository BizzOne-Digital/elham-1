import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";
import {
  bookingConfirmationTemplate,
  contactNotificationTemplate,
  leadNotificationTemplate,
} from "@/lib/email/templates";
import { BRAND } from "@/lib/constants";

export interface SendMailOptions {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
  replyTo?: string;
}

function parseBoolean(value: string | undefined, fallback: boolean): boolean {
  if (value === undefined || value === "") {
    return fallback;
  }
  return value === "true" || value === "1";
}

const DEFAULT_NOTIFICATION_EMAIL = "info@netbrandit.com";

function getSmtpConfig() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT ?? 587);
  const secure = parseBoolean(process.env.SMTP_SECURE, port === 465);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASSWORD?.replace(/\s+/g, "");
  const from = process.env.SMTP_FROM?.trim() ?? user;

  if (!host || !from) {
    throw new Error("SMTP_HOST and SMTP_FROM must be configured");
  }

  if (!user || !pass) {
    throw new Error("SMTP_USER and SMTP_PASSWORD must be configured");
  }

  return {
    host,
    port,
    secure,
    auth: { user, pass },
    from,
  };
}

export function getNotificationEmail(): string {
  return (
    process.env.SMTP_TO?.trim() ||
    process.env.ADMIN_EMAIL?.trim() ||
    DEFAULT_NOTIFICATION_EMAIL
  );
}

let transporter: Transporter | null = null;

export function getMailTransporter(): Transporter {
  if (transporter) {
    return transporter;
  }

  const config = getSmtpConfig();
  transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.secure,
    auth: config.auth,
    tls: config.secure ? { minVersion: "TLSv1.2" } : undefined,
  });

  return transporter;
}

export async function sendMail(options: SendMailOptions): Promise<void> {
  const config = getSmtpConfig();
  const mailer = getMailTransporter();

  await mailer.sendMail({
    from: config.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
    text: options.text,
    replyTo: options.replyTo,
  });
}

export interface BookingEmailPayload {
  to: string;
  name: string;
  service: string;
  startAt: Date;
  timeZone: string;
  bookingId: string;
  cancelUrl?: string;
  rescheduleUrl?: string;
}

export async function sendBookingConfirmation(
  payload: BookingEmailPayload,
): Promise<void> {
  const template = bookingConfirmationTemplate(payload);

  await sendMail({
    to: payload.to,
    subject: template.subject,
    html: template.html,
    text: template.text,
  });
}

export interface ContactEmailPayload {
  name: string;
  email: string;
  phone?: string;
  message: string;
  source?: string;
}

export async function sendContactNotification(
  payload: ContactEmailPayload,
): Promise<void> {
  const template = contactNotificationTemplate(payload);

  await sendMail({
    to: getNotificationEmail(),
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: payload.email,
  });
}

export interface LeadEmailPayload {
  name: string;
  email: string;
  phone?: string;
  message?: string;
  source?: string;
  status?: string;
  utm?: Record<string, string | undefined>;
}

export async function sendLeadNotification(
  payload: LeadEmailPayload,
): Promise<void> {
  const template = leadNotificationTemplate(payload);

  await sendMail({
    to: getNotificationEmail(),
    subject: template.subject,
    html: template.html,
    text: template.text,
    replyTo: payload.email,
  });
}

export function isEmailConfigured(): boolean {
  return Boolean(
    process.env.SMTP_HOST?.trim() &&
      process.env.SMTP_FROM?.trim() &&
      process.env.SMTP_USER?.trim() &&
      process.env.SMTP_PASSWORD?.trim(),
  );
}

export function getSiteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function getBrandName(): string {
  return BRAND.name;
}
