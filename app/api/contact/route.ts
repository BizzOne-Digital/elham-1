import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models/Lead";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { buildFormRateLimitKey } from "@/lib/api/helpers";
import { contactFormSchema } from "@/lib/validation/common";
import { sanitizePlainText } from "@/lib/validation/sanitize";
import { isEmailConfigured, sendContactNotification } from "@/lib/email";

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
    "contact",
    RATE_LIMITS.contactForm,
  );
  if (!rate.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  await connectDB();

  const messageParts = [parsed.data.message];
  const extended = body as Record<string, string | undefined>;
  if (extended.company) messageParts.unshift(`Business: ${sanitizePlainText(extended.company, 160)}`);
  if (extended.services) messageParts.unshift(`Services: ${sanitizePlainText(extended.services, 500)}`);
  if (extended.budget) messageParts.unshift(`Budget: ${sanitizePlainText(extended.budget, 80)}`);
  if (extended.timeline) messageParts.unshift(`Timeline: ${sanitizePlainText(extended.timeline, 80)}`);

  await Lead.create({
    name: sanitizePlainText(parsed.data.name, 120),
    email: parsed.data.email.toLowerCase(),
    phone: parsed.data.phone ? sanitizePlainText(parsed.data.phone, 32) : undefined,
    company: extended.company ? sanitizePlainText(extended.company, 160) : undefined,
    message: messageParts.join("\n"),
    source: extended.source ? sanitizePlainText(extended.source, 120) : "contact-form",
    status: "new",
  });

  if (isEmailConfigured()) {
    try {
      await sendContactNotification({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: messageParts.join("\n"),
        source: extended.source ? sanitizePlainText(extended.source, 120) : "contact-form",
      });
    } catch (error) {
      console.error("Contact SMTP notification failed:", error);
    }
  }

  return NextResponse.json({ success: true });
}
