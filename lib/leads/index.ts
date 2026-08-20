import mongoose, { Schema, type Model } from "mongoose";
import { connectDB } from "@/lib/db/connect";
import { FORM_TYPES, LEAD_STATUS, type FormType, type LeadStatus } from "@/lib/constants";
import { sanitizePlainText } from "@/lib/validation/sanitize";

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
}

export interface LeadDocument {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  phone?: string;
  message?: string;
  source?: string;
  formType: FormType;
  status: LeadStatus;
  utm: UtmParams;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateLeadInput {
  email: string;
  name: string;
  phone?: string;
  message?: string;
  source?: string;
  formType?: FormType;
  utm?: UtmParams;
}

export interface UpdateLeadInput {
  name?: string;
  phone?: string;
  message?: string;
  source?: string;
  status?: LeadStatus;
  notes?: string;
  utm?: UtmParams;
}

const UtmSchema = new Schema(
  {
    utm_source: String,
    utm_medium: String,
    utm_campaign: String,
    utm_term: String,
    utm_content: String,
  },
  { _id: false },
);

const LeadSchema = new Schema<LeadDocument>(
  {
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, trim: true },
    message: { type: String, trim: true },
    source: { type: String, trim: true },
    formType: {
      type: String,
      enum: Object.values(FORM_TYPES),
      default: FORM_TYPES.contact,
    },
    status: {
      type: String,
      enum: Object.values(LEAD_STATUS),
      default: LEAD_STATUS.new,
    },
    utm: { type: UtmSchema, default: {} },
    notes: { type: String, trim: true },
  },
  { timestamps: true },
);

LeadSchema.index({ email: 1, updatedAt: -1 });

function getLeadModel(): Model<LeadDocument> {
  return (
    (mongoose.models.Lead as Model<LeadDocument> | undefined) ??
    mongoose.model<LeadDocument>("Lead", LeadSchema)
  );
}

export function normalizeLeadEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function captureUtmFromSearchParams(
  params: URLSearchParams | Record<string, string | undefined>,
): UtmParams {
  const read = (key: keyof UtmParams): string | undefined => {
    const value =
      params instanceof URLSearchParams ? params.get(key) : params[key];
    return value ? sanitizePlainText(value, 120) : undefined;
  };

  return {
    utm_source: read("utm_source"),
    utm_medium: read("utm_medium"),
    utm_campaign: read("utm_campaign"),
    utm_term: read("utm_term"),
    utm_content: read("utm_content"),
  };
}

export async function findLeadByEmail(email: string): Promise<LeadDocument | null> {
  await connectDB();
  const Lead = getLeadModel();
  return Lead.findOne({ email: normalizeLeadEmail(email) })
    .sort({ updatedAt: -1 })
    .lean<LeadDocument>()
    .exec();
}

/**
 * Create a new lead or merge updates into the most recent lead for the same email.
 */
export async function upsertLead(input: CreateLeadInput): Promise<LeadDocument> {
  await connectDB();
  const Lead = getLeadModel();
  const email = normalizeLeadEmail(input.email);

  const payload = {
    email,
    name: sanitizePlainText(input.name, 120),
    phone: input.phone ? sanitizePlainText(input.phone, 32) : undefined,
    message: input.message ? sanitizePlainText(input.message, 5000) : undefined,
    source: input.source ? sanitizePlainText(input.source, 120) : undefined,
    formType: input.formType ?? FORM_TYPES.contact,
    utm: input.utm ?? {},
  };

  const existing = await Lead.findOne({ email }).sort({ updatedAt: -1 }).exec();

  if (existing) {
    existing.name = payload.name;
    if (payload.phone) existing.phone = payload.phone;
    if (payload.message) existing.message = payload.message;
    if (payload.source) existing.source = payload.source;
    existing.formType = payload.formType;
    existing.utm = { ...existing.utm, ...payload.utm };
    if (existing.status === LEAD_STATUS.closed || existing.status === LEAD_STATUS.spam) {
      existing.status = LEAD_STATUS.new;
    }
    await existing.save();
    return existing.toObject() as LeadDocument;
  }

  const created = await Lead.create({
    ...payload,
    status: LEAD_STATUS.new,
  });

  return created.toObject() as LeadDocument;
}

export async function updateLeadById(
  id: string,
  input: UpdateLeadInput,
): Promise<LeadDocument | null> {
  await connectDB();
  const Lead = getLeadModel();

  const update: Partial<LeadDocument> = {};

  if (input.name) update.name = sanitizePlainText(input.name, 120);
  if (input.phone) update.phone = sanitizePlainText(input.phone, 32);
  if (input.message) update.message = sanitizePlainText(input.message, 5000);
  if (input.source) update.source = sanitizePlainText(input.source, 120);
  if (input.status) update.status = input.status;
  if (input.notes) update.notes = sanitizePlainText(input.notes, 5000);
  if (input.utm) update.utm = input.utm;

  return Lead.findByIdAndUpdate(id, update, { new: true }).lean<LeadDocument>().exec();
}

export { getLeadModel };
