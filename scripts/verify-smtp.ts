/**
 * Quick SMTP check for Netbrandit (Zoho Canada).
 * Usage: npx tsx scripts/verify-smtp.ts
 * Requires SMTP_* vars in .env.local
 */
import { readFileSync, existsSync } from "fs";
import { resolve } from "path";
import { getMailTransporter, getNotificationEmail, sendMail } from "@/lib/email";

function loadEnvLocal() {
  const path = resolve(process.cwd(), ".env.local");
  if (!existsSync(path)) return;
  const lines = readFileSync(path, "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

async function main() {
  loadEnvLocal();
  const to = getNotificationEmail();
  const transporter = getMailTransporter();
  await transporter.verify();
  console.log("SMTP connection OK.");
  await sendMail({
    to,
    subject: "Netbrandit SMTP test",
    html: "<p>SMTP is configured correctly for Netbrandit.</p>",
    text: "SMTP is configured correctly for Netbrandit.",
  });
  console.log(`Test message sent to ${to}`);
}

main().catch((error) => {
  console.error("SMTP verification failed:", error);
  process.exit(1);
});
