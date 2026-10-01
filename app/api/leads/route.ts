import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models/Lead";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { buildFormRateLimitKey } from "@/lib/api/helpers";
import { contactFormSchema } from "@/lib/validation/common";
import { sanitizePlainText } from "@/lib/validation/sanitize";
import { isEmailConfigured, sendLeadNotification } from "@/lib/email";

export async function POST(request: Request) {
  let body: Record<string, unknown>;
  try {
    body = (await request.json()) as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
  }

  const rate = checkRateLimit(
    buildFormRateLimitKey(request, parsed.data.email),
    "leads",
    RATE_LIMITS.contactForm,
  );
  if (!rate.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  await connectDB();

  await Lead.create({
    name: sanitizePlainText(parsed.data.name, 120),
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone ? sanitizePlainText(parsed.data.phone, 32) : undefined,
    message: sanitizePlainText(parsed.data.message, 5000),
    source: sanitizePlainText(String(body.source ?? "lead-form"), 120),
    status: "new",
    metadata: {
      formType: body.formType ?? "contact",
      utm: body.utm ?? {},
    },
  });

  if (isEmailConfigured()) {
    try {
      await sendLeadNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message,
        source: sanitizePlainText(String(body.source ?? "lead-form"), 120),
      });
    } catch (error) {
      console.error("Lead SMTP notification failed:", error);
    }
  }

  return NextResponse.json({ success: true });
}
