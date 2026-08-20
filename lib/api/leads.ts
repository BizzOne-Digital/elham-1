import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models";
import { sanitizePlainText } from "@/lib/validation/sanitize";

export interface CreateLeadPayload {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject?: string;
  message: string;
  source?: string;
  ipAddress?: string;
  userAgent?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
}

export async function createLeadRecord(payload: CreateLeadPayload) {
  await connectDB();

  return Lead.create({
    name: sanitizePlainText(payload.name, 120),
    email: payload.email.trim().toLowerCase(),
    phone: payload.phone ? sanitizePlainText(payload.phone, 32) : undefined,
    company: payload.company ? sanitizePlainText(payload.company, 160) : undefined,
    subject: payload.subject ? sanitizePlainText(payload.subject, 200) : undefined,
    message: sanitizePlainText(payload.message, 5000),
    source: payload.source ? sanitizePlainText(payload.source, 120) : "website",
    status: "new",
    priority: "medium",
    ipAddress: payload.ipAddress,
    userAgent: payload.userAgent,
    referrer: payload.referrer,
    metadata: payload.metadata ?? {},
  });
}
