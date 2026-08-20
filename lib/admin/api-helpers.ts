import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth/config";
import { connectDB } from "@/lib/db/connect";
import type { Session } from "next-auth";

export type AdminSessionResult =
  | { session: Session; error?: never }
  | { session?: never; error: NextResponse };

export async function requireAdminSession(): Promise<AdminSessionResult> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  await connectDB();
  return { session };
}

export function jsonOk<T>(data: T, status = 200) {
  return NextResponse.json(data, { status });
}

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export function serialize<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export { slugify } from "./utils";
