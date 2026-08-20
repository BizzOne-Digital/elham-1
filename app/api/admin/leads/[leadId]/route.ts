import { NextRequest } from "next/server";
import { Lead } from "@/models";
import { leadUpdateSchema } from "@/lib/admin/schemas";
import {
  requireAdminSession,
  jsonOk,
  jsonError,
  serialize,
} from "@/lib/admin/api-helpers";

type RouteParams = { params: Promise<{ leadId: string }> };

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { leadId } = await params;
  const lead = await Lead.findById(leadId).lean();
  if (!lead) return jsonError("Lead not found", 404);

  return jsonOk(serialize(lead));
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { leadId } = await params;
  const body = await request.json();
  const parsed = leadUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(parsed.error.errors[0]?.message ?? "Invalid data");
  }

  const lead = await Lead.findById(leadId);
  if (!lead) return jsonError("Lead not found", 404);

  lead.status = parsed.data.status;
  if (parsed.data.priority) lead.priority = parsed.data.priority;
  if (parsed.data.note) {
    lead.notes.push({ body: parsed.data.note, createdAt: new Date() });
  }
  if (parsed.data.status === "contacted") {
    lead.lastContactedAt = new Date();
  }
  if (parsed.data.status === "won") {
    lead.convertedAt = new Date();
  }

  await lead.save();
  return jsonOk(serialize(lead.toObject()));
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
  const auth = await requireAdminSession();
  if (auth.error) return auth.error;

  const { leadId } = await params;
  const lead = await Lead.findByIdAndDelete(leadId);
  if (!lead) return jsonError("Lead not found", 404);

  return jsonOk({ deleted: true });
}
