import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { connectDB } from "@/lib/db/connect";
import { Lead } from "@/models/Lead";
import { checkRateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { contactFormSchema } from "@/lib/validation/common";
import { sanitizePlainText } from "@/lib/validation/sanitize";

export async function POST(request: Request) {
  const headerStore = await headers();
  const ip = headerStore.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const rate = checkRateLimit(ip, "leads", RATE_LIMITS.contactForm);
  if (!rate.success) {
    return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
  }

  const body = await request.json();
  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid form data." }, { status: 400 });
  }

  if (parsed.data.website) {
    return NextResponse.json({ success: true });
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

  return NextResponse.json({ success: true });
}
